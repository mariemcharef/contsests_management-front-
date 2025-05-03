import React from 'react'
import { Link, useLoaderData,useParams } from "react-router-dom"
import { getsubmissions } from "../../src/api" 
import "./Scoreboard.css"
import { requireAuth } from '../../src/utils'
export async function loader({request}) {
    await requireAuth(request)
    const data= await getsubmissions()
    return data
}

export default function Scoreboard() {
    const submissions = useLoaderData()
    // const context=useOutletContext()
    // const competitionId = context?.competitionId;
    const competitionId=useParams().id

     const filteredSubmissions = competitionId
     ? submissions.filter(s =>s.problem.competitionId == competitionId)
     : submissions
     
     const sortedSubmissions = filteredSubmissions.sort((a, b) => {
        return new Date(b.time)-new Date(a.time);
      });
    const submissionElements = sortedSubmissions.map(submission => (
        <div key={submission.id} className="submission-row">
            <span>{submission.participant.name.toUpperCase()}</span>
            <span> {submission.problem.name}</span>
            <span className={`judgement ${submission.judgement.toLowerCase()}`}>
                {submission.judgement}
            </span>
            <span>{new Date(submission.time).toLocaleString()}</span>
            <span>{submission.language}</span>
            <Link 
                to={`/submission/${submission.id}`} 
                className="details-link"
            >
                View Details
            </Link>
        </div>
    ))
         
    return (
        <>
            <h1 className="scoreboard-title">Scoreboard</h1>
            <div className="submissions-container">
                {submissionElements}
            </div>
        </>
    )
}