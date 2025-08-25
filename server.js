// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');


// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');
// const crypto = require('crypto');
// const moment = require('moment');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');


// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server);
// const PORT = 3001;
// app.use(express.json());

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST"]
// }));


// // const io = require('socket.io')(server, {
// //   cors: { origin: "http://localhost:3000" }
// // });

// const io = socketIo(server, {
//   cors: {
//     origin: ["http://localhost:3000" , 'http://spaceshare-scjy.onrender.com/' , "https://meli-flow.vercel.app/"],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ['websocket', 'polling'] // Enable both transports
// });

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('join-chat', (chatId) => {
//     socket.join(chatId);
//   });

//   socket.on('send-message', (message) => {
//     io.to(message.chatId).emit('new-message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// const apiConfig = {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Request-Headers': '*',
//       'api-key': '4graSqucDumhuePX7lpf75s6TrTFkwYXU1KN2h6vN3j72edWz6oue9BBFYOHvfUC',
//     },
//     urlBase: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-nmutxbv/endpoint/data/v1/action/'
//   };

// const axiosInstance = axios.create({
//     baseURL: apiConfig.urlBase,
//     headers: apiConfig.headers,
//   });

//   // app.post('/create-chat', (req, res) => {
//   //   const packageData = req.body;
//   //   if (!packageData._id) {
//   //     packageData._id = generateId();
//   //   }
  
//   //   const data = JSON.stringify({
//   //     "collection": "chats",
//   //     "database": "meli-flow-prod",
//   //     "dataSource": "Cluster0",
//   //     "document": packageData
//   //   });
  
//   //   axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//   //     .then(response => {
//   //       res.json(response.data);
//   //     })
//   //     .catch(error => {
//   //       console.error('Error:', error);
//   //       res.status(500).send(error);
//   //     });
//   // });

//   app.post('/create-chat', (req, res) => {
//   const packageData = req.body;
//   if (!packageData._id) {
//     packageData._id = generateId();
//   }

//   const data = JSON.stringify({
//     "collection": "chats",
//     "database": "meli-flow-prod",
//     "dataSource": "Cluster0",
//     "document": packageData
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//     .then(response => {
//       // Emit the new chat to all relevant users
//       io.emit('new-chat', packageData);
//       res.json(response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });

//   // check if a chat already exists 
//   app.post('/check-chat', async (req, res) => {
//     const { userId, recieverName } = req.body;
  
//     if (!userId || !recieverName) {
//       return res.status(400).json({ error: 'Both userId and recieverName are required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "chats",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: {
//         $or: [
//           { userId, recieverName },
//           { userId: recieverName, recieverName: userId } // reverse match
//         ]
//       }
//     });
  
//     try {
//       const response = await axios({
//         ...apiConfig,
//         url: `${apiConfig.urlBase}findOne`,
//         data,
//       });
  
//       if (response.data.document) {
//         console.log("This chat exists")
//         return res.json({ exists: true, chat: response.data.document });
//       } else {
//         console.log("This chat doesnt exists")
//         return res.json({ exists: false });
//       }
//     } catch (error) {
//       console.error('Error checking chat existence:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  

//   app.post('/get-chats', (req, res) => {
//     const { username } = req.body;
  
//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     } else {
//       console.log("username is valid");
//     }
  
//     const data = JSON.stringify({
//       collection: "chats",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: {
//         $or: [
//           { userId: username },
//           { recieverName: username }
//         ]
//       },
//       sort: {
//         lastTimestamp: -1  // Descending order
//       }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });
  
  
//   app.post('/send-message', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "messages",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/get-messages', (req, res) => {
//     const { chatId } = req.body;

//     console.log(chatId)
  
//     if (!chatId) {
//       return res.status(400).json({ error: 'Username is required' });
//     }
//     else{
//       console.log("username is vlid")
//     }
  
//     const data = JSON.stringify({
//       collection: "messages",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { chatId: chatId },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         console.log(response.data)
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });



// //   app.put('/edit-chats/:id', async (req, res) => {
// //     const { id } = req.params; 
// //     const updateData = req.body; 

// //     console.log(id)

// //     const data = JSON.stringify({
// //         collection: "chats", 
// //         database: "meli-flow-prod", 
// //         dataSource: "Cluster0",
// //         filter: { _id: id }, 
// //         update: { $set: updateData }, 
// //     });

// //     axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
// //         .then(response => res.json(response.data))
// //         .catch(error => {
// //             console.error('Error updating offer:', error);
// //             res.status(500).send(error);
// //         });
// // });

// app.put('/edit-chats/:id', async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const data = JSON.stringify({
//       collection: "chats", 
//       database: "meli-flow-prod", 
//       dataSource: "Cluster0",
//       filter: { _id: id }, 
//       update: { $set: updateData }, 
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
//       .then(response => {
//           // Emit the updated chat
//           io.emit('update-chat', { id, ...updateData });
//           res.json(response.data);
//       })
//       .catch(error => {
//           console.error('Error updating offer:', error);
//           res.status(500).send(error);
//       });
// });

// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'alive', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime() 
//   });
// });

// // Super simple HTTP-only keep-alive
// const simpleKeepAlive = async () => {
//   try {
//     console.log('🔄 Simple keep-alive ping at:', new Date().toISOString());
    
//     // Just hit your health endpoint
//     const response = await axios.get(`http://localhost:${PORT}/health`);
//     console.log('✅ Simple keep-alive successful');
    
//   } catch (error) {
//     console.log('⚠️ Simple keep-alive error:', error.message);
//   }
// };

// // Start simple keep-alive
// setInterval(simpleKeepAlive, 15 * 60 * 1000);
// simpleKeepAlive(); // Run once immediately


// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const server = http.createServer(app);
const PORT = 3001;

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// Socket.IO Configuration
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://spaceshare-scjy.onrender.com", "https://meli-flow.onrender.com", "https://meli-flow.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// MongoDB Connection
const uri = "mongodb+srv://thomasmethembe43:KSqoTlwvlK45FyVP@cluster0.2vjumfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection
let db;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("meli-flow-prod");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Initialize database connection
connectToDatabase();

// Utility function
const generateId = () => {
  return crypto.randomBytes(12).toString('hex');
};

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send-message', async (message) => {
    try {
      // Save message to database
      if (!message._id) {
        message._id = generateId();
      }
      
      await db.collection("messages").insertOne(message);
      
      // Emit to all clients in the chat room
      io.to(message.chatId).emit('new-message', message);
      
      // Update chat's last message timestamp
      await db.collection("chats").updateOne(
        { _id: message.chatId },
        { 
          $set: { 
            lastTimestamp: new Date(),
            lastMessage: message.message,
            lastSender: message.sender
          } 
        }
      );
      
      // Emit chat update to relevant users
      io.emit('update-chat', { 
        id: message.chatId, 
        lastTimestamp: new Date(),
        lastMessage: message.message,
        lastSender: message.sender
      });
      
    } catch (error) {
      console.error('Error handling send-message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('message-read', async (data) => {
    try {
      // Update message read status in database
      await db.collection("messages").updateMany(
        { 
          chatId: data.chatId,
          sender: { $ne: data.userId },
          read: { $ne: true }
        },
        { $set: { read: true, readAt: new Date() } }
      );
      
      // Notify other users in the chat
      socket.to(data.chatId).emit('messages-read', {
        chatId: data.chatId,
        readBy: data.userId
      });
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Chat Endpoints
app.post('/create-chat', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    // Add creation timestamp
    packageData.createdAt = new Date();
    packageData.lastTimestamp = new Date();

    const result = await db.collection("chats").insertOne(packageData);
    
    // Emit the new chat to all relevant users
    io.emit('new-chat', packageData);
    
    res.json(result);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).send(error);
  }
});

app.post('/check-chat', async (req, res) => {
  try {
    const { userId, recieverName } = req.body;

    if (!userId || !recieverName) {
      return res.status(400).json({ error: 'Both userId and recieverName are required' });
    }

    const chat = await db.collection("chats").findOne({
      $or: [
        { userId, recieverName },
        { userId: recieverName, recieverName: userId }
      ]
    });

    if (chat) {
      console.log("This chat exists");
      return res.json({ exists: true, chat });
    } else {
      console.log("This chat doesn't exist");
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking chat existence:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/get-chats', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    } else {
      console.log("username is valid");
    }

    const chats = await db.collection("chats").find({
      $or: [
        { userId: username },
        { recieverName: username }
      ]
    }).sort({ lastTimestamp: -1 }).toArray();

    res.json(chats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/send-message', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    // Add timestamp
    packageData.timestamp = new Date();

    const result = await db.collection("messages").insertOne(packageData);
    
    // Update the chat's last message info
    await db.collection("chats").updateOne(
      { _id: packageData.chatId },
      { 
        $set: { 
          lastTimestamp: packageData.timestamp,
          lastMessage: packageData.message,
          lastSender: packageData.sender
        } 
      }
    );

    // Emit the message via Socket.IO
    io.to(packageData.chatId).emit('new-message', packageData);
    
    res.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send(error);
  }
});

app.post('/get-messages', async (req, res) => {
  try {
    const { chatId } = req.body;

    console.log(chatId);

    if (!chatId) {
      return res.status(400).json({ error: 'ChatId is required' });
    } else {
      console.log("chatId is valid");
    }

    const messages = await db.collection("messages").find({ chatId })
      .sort({ timestamp: 1 }).toArray();

    console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.put('/edit-chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(id);

    // Add update timestamp
    updateData.updatedAt = new Date();

    const result = await db.collection("chats").updateOne(
      { _id: id },
      { $set: updateData }
    );

    // Emit the updated chat
    io.emit('update-chat', { id, ...updateData });
    
    res.json(result);
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).send(error);
  }
});

// Additional endpoints for enhanced functionality
app.post('/mark-messages-read', async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ error: 'ChatId and UserId are required' });
    }

    const result = await db.collection("messages").updateMany(
      { 
        chatId,
        sender: { $ne: userId },
        read: { $ne: true }
      },
      { 
        $set: { 
          read: true, 
          readAt: new Date() 
        } 
      }
    );

    // Notify other users in the chat
    io.to(chatId).emit('messages-read', {
      chatId,
      readBy: userId
    });

    res.json(result);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).send(error);
  }
});

app.post('/get-unread-count', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    // Get all chats for the user
    const userChats = await db.collection("chats").find({
      $or: [
        { userId },
        { recieverName: userId }
      ]
    }).toArray();

    const chatIds = userChats.map(chat => chat._id);

    // Count unread messages in all user's chats
    const unreadCount = await db.collection("messages").countDocuments({
      chatId: { $in: chatIds },
      sender: { $ne: userId },
      read: { $ne: true }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).send(error);
  }
});

app.delete('/delete-chat/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all messages in the chat
    await db.collection("messages").deleteMany({ chatId: id });
    
    // Delete the chat
    const result = await db.collection("chats").deleteOne({ _id: id });

    // Emit chat deletion
    io.emit('chat-deleted', { chatId: id });

    res.json(result);
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).send(error);
  }
});

app.delete('/delete-message/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { chatId } = req.body;

    const result = await db.collection("messages").deleteOne({ _id: id });

    // Emit message deletion to chat participants
    if (chatId) {
      io.to(chatId).emit('message-deleted', { messageId: id });
    }

    res.json(result);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).send(error);
  }
});

// Keep-alive function
const keepAlive = async () => {
  try {
    console.log('🔄 Keep-alive ping at:', new Date().toISOString());
    await db.collection("chats").findOne({ "_id": "keep_alive_ping" });
    console.log('✅ Keep-alive successful');
  } catch (error) {
    console.log('⚠️ Keep-alive ping:', error.message);
  }
};

// Start keep-alive service
const startKeepAlive = () => {
  console.log('🚀 Starting keep-alive service...');
  keepAlive();
  return setInterval(keepAlive, 15 * 60 * 1000);
};

startKeepAlive();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db ? 'connected' : 'disconnected',
    socketConnections: io.engine.clientsCount
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  io.close();
  await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  io.close();
  await client.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
