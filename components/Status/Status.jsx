import React from 'react'
import { useLoaderData } from "react-router-dom"
import { getsubmissionsById } from "../../src/api" 
import "./Status.css"
import { requireAuth } from '../../src/utils'
import { useAuth } from '../../src/AuthContext';

export async function loader({ request }) {
    await requireAuth(request)
    const data = await getsubmissionsById()
    return data
}

export function SubmissionDetails({ submission, onclose }) {
    return (
         <div className="submission-details-overlay">
            <div className="submission-details-modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onclose}>×</button>
                    <div className="detail-row">
                        <span className="detail-label">Problem:</span>
                        <span>{submission.problem.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Language:</span>
                        <span>{submission.language}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`judgement ${submission.judgement.toLowerCase()}`}>
                            {submission.judgement}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span>{new Date(submission.time).toLocaleString()}</span>
                    </div>
                    <div className="detail-row code-row">
                        <span className="detail-label">Code:</span>
                        <pre className="code-block">{submission.code}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Status() {
    const { participant, name } = useAuth()
    const submissions = useLoaderData()  
    const [selectedSubmission, setSelectedSubmission] = React.useState(null);
    
    const sortedSubmissions = submissions.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });

    const submissionElements = sortedSubmissions.map(submission => (
        <div key={submission.id}>
            <div className="submission-row">
                <span data-label="Participant">{participant.toUpperCase()}</span>
                <span data-label="Problem">{submission.problem.name}</span>
                <span data-label="Status" className={`judgement ${submission.judgement.toLowerCase()}`}>
                    {submission.judgement}
                </span>
                <span data-label="Time">{new Date(submission.time).toLocaleString()}</span>
                <span data-label="Language">{submission.language}</span>
                <button 
                    onClick={() => setSelectedSubmission(submission)}
                    className="details-link"
                >
                    View Details
                </button>
            </div>
            {selectedSubmission === submission && (
                <SubmissionDetails
                    submission={selectedSubmission}
                    onclose={() => setSelectedSubmission(null)}
                />
            )}
        </div>
    ))
         
    return (
        <div className="status-page">
            <h1 className="scoreboard-title">{name} submissions</h1>
            <div className="submissions-container">
                {submissionElements}
            </div>
        </div>
    )
}