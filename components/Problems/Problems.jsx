import React from "react"
import "./Problems.css"
import { Link,Await    ,useLoaderData} from "react-router-dom"
import { getproblems } from "../../src/api" 

export function loader(){
    return getproblems()
}


//when we use loader instead of fetch, react router can delay the rendring of our component until the loader has finished its task
export default function Problems(){

    const [allTopics, setAllTopics] = React.useState([
        "DYNAMIC_PROGRAMMING",
        "GRAPH_THEORY",
        "GREEDY_ALGORITHMS",
        "BINARY_SEARCH",
        "DATA_STRUCTURES",
        "STRING_MATCHING",
        "NUMBER_THEORY",
        "GEOMETRY",
        "COMBINATORICS",
        "BACKTRACKING",
    ]);
    const [selectedTopics, setSelectedTopics] = React.useState([]);

    
    const problems = useLoaderData()
    
    const handleTopicChange = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };
    const filteredProblemsByTopic = selectedTopics.length > 0
        ? problems.filter(problem => 
            selectedTopics.some(topic => 
                problem.topics?.includes(topic)
            )
          )
    : problems;    

    const problemElements = filteredProblemsByTopic.map(pr=>(
        <div key={pr.id} className="problem">
            <Link to={`/problems/${pr.id}`} className="problem-link" >
            <div>
                <span className="problem-info">
                    <h3>{pr.label}</h3>
                    <h3>{pr.name}</h3>
                </span>
                <div className="topics">{pr.topics.map((t,index)=><p key={index} className="topic">{t}</p>)}</div>
            </div>
            </Link>
        </div>)
    )
    
    return (
        <>
        <div className="content">
            
            <div className="filter-sidebar">
                <div className="topics-checkbox-container">
                {allTopics.map(topic => (
                    <div key={topic} className="topic-checkbox">
                    <input
                        type="checkbox"
                        id={`topic-${topic}`}
                        checked={selectedTopics.includes(topic)}
                        onChange={() => handleTopicChange(topic)}
                    />
                    <label htmlFor={`topic-${topic}`}>
                        {topic.replace(/_/g, ' ')}
                    </label>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="problems-container">
                        {problemElements}
            </div>
            </div>
        </>
    )
}