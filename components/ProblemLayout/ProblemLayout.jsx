import React from 'react'
import {NavLink ,useParams,Outlet} from "react-router-dom"
import "./ProblemLayout.css"
import back from '../Assets/back.png'
export default function ProblemLayout() {
    
    const { id } = useParams(); 
    return (
    <>
    <nav className='problemNav'>
        <NavLink 
                to='..'
                relative="path"
                className="back"
            ><img src={back}/>
        </NavLink>
        <NavLink 
            to={`/problems/${id}`}
            className={({isActive})=> isActive? "linkIsActive":null}
            end
        >Problem</NavLink>
        <NavLink 
            to={`submit`}
            className={({isActive})=> isActive? "linkIsActive":null}
        >Submit</NavLink>
        <NavLink 
            to={`status`}
            className={({isActive})=> isActive? "linkIsActive":null}

        >Status</NavLink>
        <NavLink 
            to={`clarification`}
            className={({isActive})=> isActive? "linkIsActive":null}

        >Clarifications</NavLink>
        
    </nav>
    <Outlet/>
    </>
  )
}

