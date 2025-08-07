const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
const PORT = 3001;
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));


// const io = require('socket.io')(server, {
//   cors: { origin: "http://localhost:3000" }
// });

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000" , 'http://spaceshare-scjy.onrender.com/' , "https://meli-flow.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Enable both transports
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('send-message', (message) => {
    io.to(message.chatId).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const apiConfig = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '4graSqucDumhuePX7lpf75s6TrTFkwYXU1KN2h6vN3j72edWz6oue9BBFYOHvfUC',
    },
    urlBase: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-nmutxbv/endpoint/data/v1/action/'
  };

const axiosInstance = axios.create({
    baseURL: apiConfig.urlBase,
    headers: apiConfig.headers,
  });

  // app.post('/create-chat', (req, res) => {
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
  //       res.json(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //       res.status(500).send(error);
  //     });
  // });

  app.post('/create-chat', (req, res) => {
  const packageData = req.body;
  if (!packageData._id) {
    packageData._id = generateId();
  }

  const data = JSON.stringify({
    "collection": "chats",
    "database": "meli-flow-prod",
    "dataSource": "Cluster0",
    "document": packageData
  });

  axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
    .then(response => {
      // Emit the new chat to all relevant users
      io.emit('new-chat', packageData);
      res.json(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send(error);
    });
});

  // check if a chat already exists 
  app.post('/check-chat', async (req, res) => {
    const { userId, recieverName } = req.body;
  
    if (!userId || !recieverName) {
      return res.status(400).json({ error: 'Both userId and recieverName are required' });
    }
  
    const data = JSON.stringify({
      collection: "chats",
      database: "meli-flow-prod",
      dataSource: "Cluster0",
      filter: {
        $or: [
          { userId, recieverName },
          { userId: recieverName, recieverName: userId } // reverse match
        ]
      }
    });
  
    try {
      const response = await axios({
        ...apiConfig,
        url: `${apiConfig.urlBase}findOne`,
        data,
      });
  
      if (response.data.document) {
        console.log("This chat exists")
        return res.json({ exists: true, chat: response.data.document });
      } else {
        console.log("This chat doesnt exists")
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking chat existence:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.post('/get-chats', (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    } else {
      console.log("username is valid");
    }
  
    const data = JSON.stringify({
      collection: "chats",
      database: "meli-flow-prod",
      dataSource: "Cluster0",
      filter: {
        $or: [
          { userId: username },
          { recieverName: username }
        ]
      },
      sort: {
        lastTimestamp: -1  // Descending order
      }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        res.json(response.data.documents);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });
  
  
  app.post('/send-message', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "messages",
      "database": "meli-flow-prod",
      "dataSource": "Cluster0",
      "document": packageData
    });
  
    axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });

  app.post('/get-messages', (req, res) => {
    const { chatId } = req.body;

    console.log(chatId)
  
    if (!chatId) {
      return res.status(400).json({ error: 'Username is required' });
    }
    else{
      console.log("username is vlid")
    }
  
    const data = JSON.stringify({
      collection: "messages",
      database: "meli-flow-prod",
      dataSource: "Cluster0",
      filter: { chatId: chatId },
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        console.log(response.data)
        res.json(response.data.documents);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });



//   app.put('/edit-chats/:id', async (req, res) => {
//     const { id } = req.params; 
//     const updateData = req.body; 

//     console.log(id)

//     const data = JSON.stringify({
//         collection: "chats", 
//         database: "meli-flow-prod", 
//         dataSource: "Cluster0",
//         filter: { _id: id }, 
//         update: { $set: updateData }, 
//     });

//     axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
//         .then(response => res.json(response.data))
//         .catch(error => {
//             console.error('Error updating offer:', error);
//             res.status(500).send(error);
//         });
// });

app.put('/edit-chats/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const data = JSON.stringify({
      collection: "chats", 
      database: "meli-flow-prod", 
      dataSource: "Cluster0",
      filter: { _id: id }, 
      update: { $set: updateData }, 
  });

  axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
      .then(response => {
          // Emit the updated chat
          io.emit('update-chat', { id, ...updateData });
          res.json(response.data);
      })
      .catch(error => {
          console.error('Error updating offer:', error);
          res.status(500).send(error);
      });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// Super simple HTTP-only keep-alive
const simpleKeepAlive = async () => {
  try {
    console.log('🔄 Simple keep-alive ping at:', new Date().toISOString());
    
    // Just hit your health endpoint
    const response = await axios.get(`http://localhost:${PORT}/health`);
    console.log('✅ Simple keep-alive successful');
    
  } catch (error) {
    console.log('⚠️ Simple keep-alive error:', error.message);
  }
};

// Start simple keep-alive
setInterval(simpleKeepAlive, 15 * 60 * 1000);
simpleKeepAlive(); // Run once immediately


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

