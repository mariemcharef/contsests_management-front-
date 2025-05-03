import React from 'react';
import { NavLink,useSearchParams,useLoaderData} from 'react-router-dom';
import "./Competitions.css"
import { getcompetitions } from '../../src/api';



export async function loader(){
    const data = await getcompetitions()
     return data
}

export default function Competitions() {
  const [searchParams,setSearchParams]=useSearchParams();
  const competitions=useLoaderData()
  const sortedCompetitions = competitions.sort((a, b) => {
    return new Date(b.startTime)-new Date(a.startTime);
  });
  
  const typeFilter=searchParams.get("status")
  
  const getCompetitionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { status: 'Not Started', class: 'not-started' };
    if (now >= start && now <= end) return { status: 'Running', class: 'running' };
    return { status: 'Completed', class: 'completed' };
  };

  const formatDate = (dateString) => {//Input: "2023-12-25T14:30:00Z" → Output: "Dec 25, 2023, 2:30 PM"
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);//Converts the input string into a JavaScript Date object
  };

  const handleStatusFilter = (status) => {
    setSearchParams(status ? { status } : {});
   // setSearchParams("?status="+`${status}`)string
    //setSearchParams({status}); object
  };
 
  const filteredElements = typeFilter
  ? sortedCompetitions.filter(c => {
      const status = getCompetitionStatus(c.startTime, c.endTime);
      return typeFilter === status.status;
    })
  : sortedCompetitions; 

  const competitionElements = filteredElements
  .map(c => {
    const status = getCompetitionStatus(c.startTime, c.endTime);
    
    return (
      <div key={c.id} className={`competition-card ${status.class}`}>
        {(() => {
          const now = new Date();
          const start = new Date(c.startTime);
          return start < now ? (
            <NavLink to={`/competitions/${c.id}?status=${status.status}`}
              
              className="competition-link">
              <div className="competition-header">
                <h3>{c.name}</h3>
                <span className={`status-badge ${status.class}`}>
                  {status.status}
                </span>
              </div>
              <div className="competition-details">
                <div className="detail-item">
                  <span className="detail-label">Starts:</span>
                  <span>{formatDate(c.startTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span>{Math.floor(c.duration / 60)}h {c.duration % 60}m</span>
                </div>
              </div>
            </NavLink>
          ) : (
            <div to={`/competitions/${c.id}`}
             state={{search:`?${searchParams.toString()}`,status:status}}
              className="competition-link">
              <div className="competition-header">
                <h3>{c.name}</h3>
                <span className={`status-badge ${status.class}`}>
                  {status.status}
                </span>
              </div>
              <div className="competition-details">
                <div className="detail-item">
                  <span className="detail-label">Starts:</span>
                  <span>{formatDate(c.startTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span>{Math.floor(c.duration / 60)}h {c.duration % 60}m</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  })
 //instead of button we can use Link as <Link to="?status=sth">sth</Link>
 //and to clear <Link to="."></Link>


  return (
    <div className="competitions-container">
      <div className='competitions_header'>
        <h3>Competitions</h3>
        <button className='create_competition'>Create Competition</button>
      </div>
      <div className='status_items'>
        <button className={
          `status-badge_not-started
           ${typeFilter==="Not Started"
           ?"selectedClass":""}`}
           onClick={() => handleStatusFilter('Not Started')}>Not Started</button> 

        <button className={
          `status-badge_running
           ${typeFilter==="Running"
           ?"selectedClass":""}`}
           onClick={() => handleStatusFilter('Running')}>Running</button>

        <button className={
          `status-badge_completed
           ${typeFilter==="Completed"
           ?"selectedClass":""}`}
           onClick={() => handleStatusFilter('Completed')}>Completed</button>
      </div>
      <div className="competitions-grid">
        {competitionElements}
      </div>
    </div>
  );
}