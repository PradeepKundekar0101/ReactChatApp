import React,{useState, useEffect} from 'react';
import { IoSendSharp } from "react-icons/io5";
import { MdExitToApp} from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
// import Picker from 'emoji-picker-react';
import ThankYou from '../Components/ThankYou';
import 'react-toastify/dist/ReactToastify.css';
const Chat = ({socket,name,room}) => {
  const notify = () =>toast.success('Joined '+room+" Successfully");
  const notify1 = () =>toast.info( userJoined+ " Joined the Room");
  const notifyleft = () =>toast.error( userLeft+ " Left the Room");
  const [message, setmessage] = useState("");
  const [messageList,setMessageList]=useState([]);
  const [clients,setClients]=useState(0);
  const [someoneJoined,setSomeJoined]=useState(false);
  const [someoneLeft,setSomeLeft]=useState(false);
  const [userJoined,setUserJoined]=useState("");
  const [userLeft,setUserLeft] =useState("");
  const [youLeft, setYouLeft] = useState(false);

    const send=async() =>
    {    
        const messageDetails={
            author:name,
            room:room,
            message:message,
            time: new Date().getHours()+":"+new Date().getMinutes()
          };
       
        await socket.emit("send_message",messageDetails); //Emit the Event Send Message and Pass on the 
        //Message Data.... On the BackEnd we hava Listener to this Event ie: socket.on("send_message",()=>{});
        setMessageList((list)=>[...list,messageDetails]);
        setmessage("");
        const chatBody=document.getElementById("chatBody");
        chatBody.scrollTop=chatBody.scrollHeight;
        
    }
    const leave=()=>{
      socket.emit("disconnect_client",{room,name});
      setmessage("");
      setMessageList([]);
      setClients([]);
      setSomeJoined(false);
      setSomeLeft(false);
      setUserJoined("");
      setUserLeft("");
      setYouLeft(true);
    }
   
    useEffect(()=>{notify()},[]);
    useEffect(()=>{ if(someoneJoined) notify1()},[someoneJoined])
    useEffect(()=>{ if(someoneLeft) notifyleft();},[someoneLeft]);
    useEffect(()=>{
        socket.on("receive_message",(data)=>{
          setMessageList((list)=>[...list,data]);  
          const chatBody=document.getElementById("chatBody");
          chatBody.scrollTop=chatBody.scrollHeight;
        });
      
        socket.on("somejoined",(data)=>{
          setUserJoined(data.name);
          setSomeJoined(true); setSomeJoined(false);
          setClients((data)=>data+1);
        });
        socket.on("someoneleft",(data)=>{
         
          setUserLeft(data.name);
          setSomeLeft(true); setSomeLeft(false);
          setClients((data)=>data-1)
        });
        socket.on("send_client_no",(data)=>{
         setClients(data);
        }); 
    },[socket]); //Whenever there is any change in  socket.
      
  return (
    !youLeft?
      <div className='main'>
    <div className='chatContainer'>
      <div className='chatHeader'>
       <div className='left'>
          <h3 >Room: <h3 style={{color:"#fff",display:"inline"}}>{room}</h3></h3>
          <h4>  &nbsp;&nbsp;&nbsp;{clients} {clients>1 ?"Members":"Member"}</h4>
          <div className='circle'></div>
        </div>
        <div className='right'>
          <button onClick={leave} >Leave Room  <MdExitToApp/></button>
        </div>
      </div>
        <div className='chatBody' id="chatBody">
          {
            messageList.map((ele,index)=>{
              return(
                <div className="message" key={index} id={ele.author===name?"you":"other"}>
                    {ele.message}
                  <div className='belowDetails'>
                    <span>{ele.author===name?"You":ele.author}</span> {ele.time}
                  </div>
                </div>);
              })
          }
          
         
        </div>
        <div className='chatFooter'>
        
          <input type="text" placeholder='Write a Message...' onKeyPress={(e)=>{e.key==="Enter" && send()}} value={message} onChange={(e)=>{setmessage(e.target.value)}}/>
          {/* <button className='emoji'onClick={()=>{emojiShow?setEmojiShow(false):setEmojiShow(true)}} ><BsFillEmojiSmileFill/></button> */}
          <button onClick={message.length>0 && send}><IoSendSharp/></button>
        </div>
    </div> 

     
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
      {/* <div style={emojiShow?{opacity:"0"}:{opacity:"1"}} className='emojiPicker'>
            <Picker onEmojiClick={onEmojiClick}/>
      </div> */}
  </div>
  :<ThankYou name={name} room={room}/>
        );
}
export default Chat;
  

