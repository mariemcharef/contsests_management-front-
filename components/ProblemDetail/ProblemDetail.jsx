import React from 'react'
import { useParams,useLoaderData}from "react-router-dom"
import "./ProblemDetail.css"
import { getproblem, gettestcases } from '../../src/api';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

export async function loader({ params }) {
    const problem= await getproblem(params.id);
    const testCases= await gettestcases(params.id)
    return ({problem,testCases})
}

function ProblemDetail() {
    const LoaderData=useLoaderData()
    const problem=LoaderData.problem
    const testCases=LoaderData.testCases

    const TestCasesElements=testCases.filter(t=>!(t.hidden)).map(t=>{
       return( <div key={t.id}>
            <h2>Example:</h2>
            <h3>input:</h3>
            <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    children={t.input}
            />
            <h3>output:</h3>
            <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    children={t.output}
            />
            {t.explanation && <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    children={"Notes:\n"+ t.explanation}
            />}
        </div>
        );
    });
  return (
    <div className="problem-detail"> 
        <>
        <div className='problem-detail'>
            <div className="problem-header">
                <h1 className="problem-title">{problem.label}-{problem.name}</h1>
                <div className="problem-meta">
                    <span>Time Limit: {problem.timeLimit}s</span>
                    <span>Memory Limit: {problem.memoryLimit}MB</span>
                </div>
            </div>
            <div className="problem-content">
                
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    children={problem.content}
                />    
                < h2>Input:</h2>
                <p>{problem.inputExplanation}</p>
                < h2>Output:</h2>
                <p>{problem.outputExplanation}</p>
            </div>
        </div>
        <div className="testCases">
            {TestCasesElements}
        </div>
        </>

  </div>
  )
}

export default ProblemDetail

