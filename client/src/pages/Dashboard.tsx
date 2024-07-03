import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import SideBar from "../components/SideBar";
import BottomBar from "../components/BottomBar";
import MsgContainer from "../components/MsgContainer";
import { Message } from "../components/Messages.interface";

const Dashboard = () => {
    const [msgs, setMsgs] = useState<Message[]>([])
    const [allUsers, setAllUsers] = useState([])
    const [input, setInput] = useState('')
    const {state} = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        socket.connect();
    
        // Emit 'join' event to join the room
        socket.emit('join', { username: state.username, room: state.room }, (error:any) => {
            if (error) {
                navigate('/');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        });
    
        // Define inline event handlers
        socket.on('message', (message) => {
            setMsgs([...message]);
        });
    
        socket.on('locationMessage', (message) => {
            setMsgs([...message]);
        });
    
        socket.on('roomData', ({ users }:any) => {
            setAllUsers(users);
        });
    
        // Clean up function
        return () => {
            socket.off('message');
            socket.off('locationMessage');
            socket.off('roomData');
            socket.disconnect();
        };
    }, []);
    
     const handleSubmit = (e:any) =>{
        e.preventDefault()
        socket.emit('sendMessage', input, (error:any) => {
            setInput('')
            if (error) {
                return console.log(error)
            }
            console.log('Message delivered!')
        })
     }
     
      const handleLocation = () =>{
        if (!navigator.geolocation) {
            return alert('Geolocation is not supported by your browser.')
        }
    
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, () => {
                console.log('Location shared!')  
            })
        })
      }

      const handleLogout =()=>{
        navigate('/')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        socket.disconnect()
      }

  return (
     <div className="chat">
       <SideBar users={allUsers} logout={handleLogout}/>
        <div className="chat__main">
        <MsgContainer messages={msgs}/>
        <BottomBar onSubmit={handleSubmit} onLocation={handleLocation} input={input} setInput={setInput}/>
        </div>
    </div>
  )
}

export default Dashboard