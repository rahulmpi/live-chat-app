import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        room: ''
    })

    const [errors, setErrors] = useState({
        username: '',
        room: ''
    })

    const {username, room} = formData

    const handleChange = (e:any) =>{
        const {name, value} = e.target
        setFormData((prev) =>({
             ...prev,
             [name] : value
        }))
    }

  const handleSubmit = async (e:any) =>{
     e.preventDefault()
     if(Validate()){
      try {
        const response = await API.post('users/login', {name: username, room});
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/dashboard', {state : formData})  
      } catch (error:any) {
        toast.error('Invalid Credentials')
      }
     }
  }

  const Validate = () =>{
      let validation  = {...errors} 
      let result = true;
      if(!username.trim()){
        validation.username = 'Please enter username'
        result = false
      }
      else{
        validation.username = ''
      }
      if(!room.trim()){
        validation.room = 'Please enter room name'
        result = false
      }
      else{
        validation.room = ''
      }
      setErrors(validation)
      return result
  }


  return (
    <div className="centered-form">
    <div className="centered-form__box">
        <h1>Join</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Display name</label>
            <input type="text" name="username" placeholder="Display name" value={username} onChange={handleChange}/>
            {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="form-group">
            <label>Room</label>
            <input type="text" name="room" value={room} placeholder="Room" onChange={handleChange}/>
            {errors.room && <p className="error">{errors.room}</p>}
            </div>
            <button>Join</button>
        </form>
    </div>
    </div>
  )
}

export default Login