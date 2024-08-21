const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/CommentsSchema');  // Assuming you saved the schema as CommentsSchema.js
const Works = require('../models/Works');  // Assuming you have the Works model

const router = express.Router();

// Post a new comment
router.post('/comments', async (req, res) => {
  try {
    const { blogId, author, comment, email } = req.body;

    // Ensure the blog ID exists
    const blog = await Works.findById(blogId);
    if (!blog || blog.type !== 'blog') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Create a new comment
    const newComment = new Comment({
      blogId,
      author,
      comment,
      email
    });

    // Save the comment
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error posting comment', error: error.message });
  }
});

// Update or post a comment (upsert)
router.put('/comments', async (req, res) => {
  try {
    const { _id, blogId, author, comment, email, RepID } = req.body;

    // Ensure the blog ID exists
    const blog = await Works.findById(blogId);
    if (!blog || blog.type !== 'blog') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update or create a comment
    const updatedComment = await Comment.findOneAndUpdate(
      { _id },
      { blogId, author, comment, email, RepID },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
});

// GET comments by blogId
router.get('/comments/:blogId', async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      {
        $match: {
          blogId: mongoose.Types.ObjectId(req.params.blogId)
        }
      },
      {
        $graphLookup: {
          from: "comments", // The collection to search within
          startWith: "$_id", // Field from the input documents
          connectFromField: "_id", // Field from the input documents
          connectToField: "RepID", // Field from the documents in the `from` collection
          as: "children", // Output array field
          maxDepth: 5, // Limit depth of the lookup
          depthField: "depth" // Optional field to store depth of each document
        }
      },
      {
        $addFields: {
          children: {
            $map: {
              input: "$children",
              as: "comment",
              in: {
                _id: "$$comment._id",
                blogId: "$$comment.blogId",
                RepID: "$$comment.RepID",
                author: "$$comment.author",
                email: "$$comment.email",
                comment: "$$comment.comment",
                createdAt: "$$comment.createdAt",
                updatedAt: "$$comment.updatedAt",
                depth: "$$comment.depth",
                children: {
                  $filter: {
                    input: "$children",
                    as: "nestedComment",
                    cond: {
                      $and: [
                        { $eq: ["$$nestedComment.RepID", "$$comment._id"] },
                        { $ne: ["$$nestedComment._id", "$$comment._id"] }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          author: 1,
          email: 1,
          RepID: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          children: {
            $filter: {
              input: "$children",
              as: "topLevelComment",
              cond: {
                $eq: ["$$topLevelComment.depth", 0]
              }
            }
          }
        }
      }
    ]);

    res.json(comments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

module.exports = router;
