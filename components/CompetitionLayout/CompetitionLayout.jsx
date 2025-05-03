import React from 'react'
import { NavLink,Outlet,useParams, useLocation} from 'react-router-dom';
import './CompetitionLayout.css'
import {getCompetitionStatus}from '../../src/api';
import back from '../Assets/back.png'
import { requireAuth } from '../../src/utils'
import { redirect } from "react-router-dom"


export async function loader({ params,request }) {
    await requireAuth(request)
    const status = await  getCompetitionStatus(params.id);
    if(status==='Running'){
        await requireAuth(request)
    }
    if (status === 'Not Started') {
        throw redirect("/home")
    }
}

function CompetitionLayout() {
    const { id } = useParams(); 
    const location=useLocation()
     
    const search=location.state?.search || ""
    const status = location.state?.status?.status || "";
   
  return (
    <>
    <div> <nav className='competitionNav'>
    <NavLink 
            to={`..${search}`}
            relative="path"
            className="back"
            
            ><img src={back}/>
    </NavLink>
    <NavLink 
        to={`/competitions/${id}/problems`}
        className={({isActive})=> isActive? "linkCIsActive":""}
        
    >Problems</NavLink>
    <NavLink 
        to={`/competitions/${id}/submit`}
        className={({isActive})=> isActive? "linkCIsActive":""}
    >Submit</NavLink>
    <NavLink 
        to={`/competitions/${id}/scoreboard`}
        className={({isActive})=> isActive? "linkCIsActive":""}

    >Scoreboard</NavLink>
    
        </nav>
            <Outlet context={{competitionId: id ,status:status}}/>
        
        </div>
  </>
  )
}

export default CompetitionLayout