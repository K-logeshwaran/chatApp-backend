const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require("mongoose")
const {Server} = require('socket.io')
const dotenv = require('dotenv');
const app = express()
// const jwt = require('jsonwebtoken')
dotenv.config();
const dbUrl = "mongodb://localhost:27017/Chat-App"
// routes
const login = require("./routers/login")
const verifyToken = require('./middleware/tokn')
const userModel = require('./schema/user.model')


// middleware
app.use(cors());
app.use(express.json());    
app.use('/login',login)

const server =http.createServer(app)


app.post('/name',verifyToken,(req,res)=>{
    res.json(req.user.email);
});

app.put('/room',verifyToken,async (req,res)=>{
  let V= {...req.user}
  console.log(V);
  let usr = await userModel.findOne({email:V.email})
  usr.rooms.push(req.body.rooms)
  await usr.save()
  res.json(usr.rooms)
});


let io = new Server(server,{
  "cors":"http://localhost:3000/"
});

io.on("connection",socket=>{
  console.log(socket.id);
  socket.emit("connectionSuccess","connectionSuccess")
  socket.on("joinRoom",({roomId,userName})=>{
    socket.join(roomId)
    socket.emit("newUserJoined",{roomId,userName})
  })

  socket.on("sendMsg",({roomId,message,by})=>{
    console.log(roomId,message,by);
    socket.broadcast.to(roomId).emit("receivedMsg",{message,by,roomId})
  })
});

mongoose.connect(dbUrl)
.then(res=>{
    console.log("connected Successfully");
    //console.log(res);
    server.listen(process.env.PORT|| "3001")
}).catch(err=>console.log(err));





// io.on("connection",socket=>{
   
   
// })


// io.use(function(socket, next){
//     if (socket.handshake.query && socket.handshake.query.token){
//       jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET_KEY, function(err, decoded) {
//         if (err) return next(new Error('Authentication error'));
//         socket.decoded = decoded;
//         next();
//       });
//     }
//     else {
//       next(new Error('Authentication error'));
//     }    
//   })
//   .on('connection', function(socket) {
//     socket.on("join",({room})=>socket.join(room));
//     socket.on("msg",({message,room})=>socket.to(room).emit("msg",{message}))
//   });