import React from "react"
import "./CompetitionProblems.css"
import { Link ,useLoaderData} from "react-router-dom"
import { getproblemsbycompetition } from "../../src/api" 

export function loader({ params }){
    return getproblemsbycompetition(params.id)
}


export default function CompetitionProblems(){
    
    const problems = useLoaderData()
    
    const sortedProblems = [...problems].sort((a, b) => {
        const labelA = a.label.toUpperCase();
        const labelB = b.label.toUpperCase();
        if (labelA < labelB) return -1;
        if (labelA > labelB) return 1;
        return 0;
    });

 
    const problemElements = sortedProblems.map(pr=>(
        <div key={pr.id} className="problem">
            <Link to={`/problems/${pr.id}`} className="problem-link" >
            <div>
                <span className="problem-info">
                    <h3>{pr.label}</h3>
                    <h3>{pr.name}</h3>
                </span>
            </div>
            </Link>
        </div>)
    )
    
    return (
        <>
        <div className="content">
           
            <div className="problems-container">
                {problemElements}
            </div>
            </div>
        </>
    )
}