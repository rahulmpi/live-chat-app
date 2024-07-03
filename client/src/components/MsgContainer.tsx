import moment from "moment";
import { Message } from "./Messages.interface";
interface Props {
    messages: Message[];
}
interface User {
    name: string;
} 

const MsgContainer = ({messages}:Props) => {
  const activeUser = JSON.parse(localStorage.getItem('user') || '{}') as User;

  return (
    <div id="messages" className="chat__messages">
    {messages.map((elem:any, index) =>{
        const formattedTime = moment(elem.createdAt).format('h:mm a');
        if(elem.url) {
            return <div className={`message ${elem.sender_name === activeUser?.name ? 'active': ''}`} key={index}>
            <div className="box">
            <p>
                <span className="message__name">{elem.sender_name}</span>
                <span className="message__meta">{formattedTime}</span>
            </p>
            <p><a href={elem.url} target="_blank">My current location</a></p>
            </div>
             </div>
        }
        
        return <div className={`message ${elem.sender_name === activeUser?.name ? 'active': ''}`} key={index}>
        <div className="box">
        <p>
            <span className="message__name">{elem.sender_name}</span>
            <span className="message__meta">{formattedTime}</span>
        </p>
        <p>{elem.text}</p>
         </div>
         </div>
    })}
</div>
  )
}

export default MsgContainer