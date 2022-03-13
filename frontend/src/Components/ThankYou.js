import React from 'react'



const ThankYou = ({name,room}) => {
  
  
  return (
    
    <div className='thankyou'>
      <h1>ThankYou </h1>
      <h3 className='detail'>{name}</h3> 
      <h3>For Joining</h3>
       <h3 className='detail'> Room {room} !</h3>
      <button onClick={()=>{window.location.reload()}}>Join a New Room</button>
    </div>
    
  )
}

export default ThankYou