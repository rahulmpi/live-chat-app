interface Props {
    users: {
      id: number;
      name: string;
      email: string;
    }[];
    logout: () => void
  }

const SideBar = ({users, logout}:Props) => {
  return (
    <div id="sidebar" className="chat__sidebar">
    <h2 className="room-title">Chat Room</h2>
        <h3 className="list-title">Users</h3>
        <ul className="users">
            {users.map((elem:any, index) => <li key={index}>{elem.name}</li>)}
        </ul>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default SideBar