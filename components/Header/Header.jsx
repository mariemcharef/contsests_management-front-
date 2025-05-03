import React from 'react'
import {NavLink,useNavigate} from "react-router-dom"
import './Header.css'
import { useAuth } from '../../src/AuthContext';

function Header() {
  const {user,logout,participant,name}=useAuth()
  const navigate=useNavigate()
  const handleLogout = () => {
    logout();
    navigate('/'); 
  };
 
  return (
    <header >
        <NavLink to=".">#CPCoding</NavLink>
        <nav className='headerNav'>
          <NavLink 
            to="."
            className={({isActive})=> isActive? "linkisActive":null}     
            >Home</NavLink>

          <NavLink 
            to="/competitions"
            className={({isActive})=> isActive? "linkisActive":null}           
            >Competitions</NavLink>

          <NavLink 
            to="/problems"
            className={({isActive})=> isActive? "linkisActive":null}     
            >Problems</NavLink>
          {name  && <NavLink 
          to={`/profile/${name}`}
          className={({isActive})=> isActive? "linkisActive":null}     
          >{name}{participant!=null && participant!=name && ` as ${participant}` }</NavLink>}

         {user  &&
         <button 
            className= "btnisActive"
            onClick={handleLogout}
            >Logout</button>}
          {!user && <NavLink 
            to="/login"
            className={({isActive})=> isActive? "linkisActive":null}
            
            >Login/Sign up</NavLink>}
            
        </nav>
      </header>
  )
}

export default Header