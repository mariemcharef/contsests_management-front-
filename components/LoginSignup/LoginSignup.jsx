import React, { useState } from 'react'
import './LoginSignup.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { useLoaderData ,redirect,Form,useActionData,useNavigation} from 'react-router-dom'
import { loginUser,signUpUser } from '../../src/api'

export async function action({request}){
  const formData =await request .formData()
  const action=formData.get("action")
  const name=formData.get("name")
  const email=formData.get("email")
  const password=formData.get("password")
  const pathname=new URL(request.url).searchParams.get("redirectTo") || "/"
  try{
    if(action==="Login"){
    const creds={email,password}
    await loginUser(creds)
    }
    else if(action=="Sign Up"){
    await signUpUser({name,email,password})
    }
  }catch(error){
    return {
      error: error.message,
    };
  }
  return redirect(pathname)
}


export function loader ({request}){
  return new URL (request.url).searchParams.get("message")
}


function LoginSignup() {
  const [action, setAction] = useState("Login");
  const message=useLoaderData()
  const actionData = useActionData();
    const navigation=useNavigation()
  
  const [formData, setFormData] = useState({
    action:'Sign Up',
    name: '',
    email: '',
    password: ''
  });

  const handleSwitch = (newAction) => {
    setAction(newAction);
  };

  return (
    <div className='container'>   
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
        {message &&<h2 className='message'>{message}</h2>}
        {actionData?.error && <h4 className='message'>{actionData.error}</h4>}      </div> 
      
      <Form method="post" replace>
        <div className='inputs'>
          {action === "Login" ? null : (
            <div className='input'>
              <img src={user_icon} alt=""/>
              <input 
                name="name"
                type="text"
                placeholder='Name'
                required={action === "Sign Up"}
              />
            </div>
          )}
        </div>
        <div className='inputs'>
          <div className='input'>
            <img src={email_icon} alt=""/>
            <input 
              name="email"
              type="email" 
              placeholder='Email' 
              required
            />
          </div>
        </div>
        <div className='inputs'>
          <div className='input'>
            <img src={password_icon} alt=""/>
            <input 
              name="password"
              type="password" 
              placeholder='Password'
              required
            />
          </div>
        </div> 
        <input type="hidden" name="action" value={action} />
        <div className="submit-container">
        <button
            disabled={navigation.state === "submitting"}
            className="submit"
          >
            {navigation.state === "submitting" ? (action==="Login" ? "Logging in..." : "Signing up...") : action}
          </button>      
        </div>
      </Form>
      
        {action==="Login" &&<button className="submit" onClick={()=>handleSwitch("Sign Up")}>Sign Up</button>}
        {action==="Sign Up" &&<button className="submit" onClick={()=>handleSwitch("Login")}>Login</button>}
      
      
    </div>
  )
}

export default LoginSignup