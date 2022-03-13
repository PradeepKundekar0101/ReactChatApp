
import React,{useState} from 'react'
import io from 'socket.io-client'; //Socket.io for Client side
import Chat from '../src/Components/Chat'
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let socket= io.connect("https://chatapplication001.herokuapp.com/"); //Connect our Front End to Socket Server Located at "http://localhost:3001"
const App = () => {
  const nameerror = () => toast.error('User Name must be atleast 3 Characters long', {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    });
  const roomerror = () => toast.error('RoomID must be atleast 5 Characters long', {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    });
  const [name, setname] = useState("");
  const [room,setroom]=useState("");
  const [showChat,setShowChat]=useState(false);
  const join=()=>{

    if(validate())
    {
      socket.emit("join_room",{room,name});
      setShowChat(true);
    }  

  }
  const validate=()=>
  {
    if(name.length<3)
    {
      nameerror();
    }
    if(room.length<5){
      roomerror();
    }
    else{
      return true;
    }
  }
  return (
    <>
   {
     !showChat?( <><h1>Join a Room</h1><div className='joinRoom'>
          <input
            placeholder='Name...'
            onChange={(e) => { setname(e.target.value); } }
            value={name} />
          <input
            placeholder='Room ID...'
            onChange={(e) => { setroom(e.target.value); } }
            value={room} />
          <button onClick={join}>Join</button>
        </div><ToastContainer />  </>): <Chat socket={socket} name={name} room={room} />
   }
     
   
       
   
    </>
  )
}

export default App