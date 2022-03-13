const express=require('express');
const app=express();

const http=require('http');
const server=http.createServer(app);
 
const cors=require('cors');
const PORT= process.env.PORT || 3003
app.use(cors);

const socket= require('socket.io');
const { json } = require('express');
const io=socket(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log("User Connected:"+ socket.id);
  
    socket.on('join_room',async(data)=>{
        
        const {name,room}=data;
       await socket.join(room);
        
      
        
        let  no=io.sockets.adapter.rooms.get(room).size
        
        


        socket.to(room).emit("somejoined",data);
        socket.emit("send_client_no",no);
        
    });
   
    socket.on("send_message",(data)=>{
         //Listening to a Event Called Send_message from FrontEnd.
         socket.to(data.room).emit("receive_message",data);   //Emit an Event receive_message which FrontEnd will Listen.Send Back the Data to all other Sockets received from the frontEnd.                                
    });
    socket.on("show_clients",(room)=>{
        const clients = io.sockets.adapter.rooms.get(room);
        console.log(clients);
        socket.emit("get_clients",clients[room]);
    })
    
    socket.on("disconnect_client",(data)=>{
        socket.to(data.room).emit("someoneleft",data);
        console.log(socket.id+" Disconnected");
        socket.disconnect();

    });
    
})

server.listen(PORT, ()=>{
    console.log("Server Listening at port 3003");
})