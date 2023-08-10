require("dotenv").config();
require("./config/db");
const express = require("express");
const cors = require("cors");
const swaggerJson = require("./swagger/swagger.json");
const swaggerUi = require("swagger-ui-express");
const app = express();
app.use(cors());
const routes = require("./routes/index");
// const socketIO = require('socket.io');
app.use(
  express.json({
    limit: "1024mb",
  })
);
app.use(
  express.urlencoded({
    limit: "1024mb",
    extended: true,
  })
);
app.use("/api", routes);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

const LOCALPORT = process.env.PORT || 8080;

app.listen(LOCALPORT, () => {
  console.log(`http://localhost:${LOCALPORT} is listening...`);
});

// const io = socketIO(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//   },
// });

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('A user connected');
//   // join group
//   socket.on('join', async (data) => {
//     try {
//       socket.join(data.group);
//       const messages = await MessageModel.find({ group: data.group });
//       socket.emit('message', messages);
//     } catch (error) {
//       console.error('Error joining group:', error);
//     }
//   });

//   // Send message
//   socket.on('message', async (data) => {
//     try {
//       console.log(data);
//       const newMessage = new MessageModel({
//         name: data.name,
//         group: data.group,
//         message: data.message,
//       });
//       await newMessage.save();
//       const updatedMessages = await MessageModel.find({ group: data.group });
//       io.to(data.group).emit('message', updatedMessages);
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   });
//   // Disconnect user
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });