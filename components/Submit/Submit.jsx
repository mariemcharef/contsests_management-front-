import React,{useRef} from 'react'
import './Submit.css'
import {Form ,redirect,useLoaderData,useNavigation,useParams,useActionData} from "react-router-dom" 
import { submitSolution,getproblem } from '../../src/api'
import { requireAuth } from '../../src/utils'
import Editor from '@monaco-editor/react';

export async function action({request,params}){
    const formData=await request.formData()
    const code = formData.get("code")
    const languageId = formData.get("languageId")
    
    if (!code ) {
      throw new Error("Code is required")
    }
    if( !languageId){
      throw new Error("Language is required")
    }
  const submission = {
    languageId: parseInt(languageId), 
    code: code,
    problemId: params.id
  };
    await submitSolution(submission);
    return redirect(`/problems/${params.id}/status`);
}

export async function loader({request,params}) {
  await requireAuth(request)
  const data=await getproblem(params.id)
  return data.name
} 

export default  function Submit() {
  const {id}=useParams()
  const problemName=useLoaderData()
  const [code,setCode]=React.useState("")
  const navigation=useNavigation()
  const [error,setError]=React.useState(null) 
  const mycode = useRef(null);
  const actionData = useActionData()
  const [formData,setFormData]= React.useState({
    languageId:52,
    code:code,
    problemId:id
  })
  function handleEditorDidMount(editor) {
    mycode.current = editor;

  }
  function handleSetCode(){
    setCode(mycode.current.getValue())

  }

  return (
    <>
    <h2 className="submitSolution">Submit Solution:</h2>
    <div className="submit-container">
      
      <Form method="post" className="submit-form">
        <div className="form-group">
          <h4 htmlFor="problemCode">Problem: {problemName}</h4>
          {error && <p className='red'>{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select id="languageId" name="languageId" required defaultValue="52">
            <option value="52">
              GNU G++20 13.2 (64 bit, winlibs)
            </option>
            <option value="71">Python 3.10</option>
            <option value="62">Java 17</option>
            <option value="50">GNU GCC C11 5.1.0</option>
          </select>
        <div className="form-group">
          <label>Source code:</label>
          <input type="hidden" name="code" value={code} />
          <Editor
            height="30vh"
            defaultLanguage="javascript"
            defaultValue="//write you code here"
            className="code-input"
            onChange={handleSetCode}
            onMount={handleEditorDidMount}
          />
        </div>
        </div>
        {/* <div className="form-group">
          <label htmlFor="sourceFile" className="file-upload-label">
            <span className="file-upload-button">Choisir un fichier</span>
            <input
              id="sourceFile"
              name="sourceFile"
              type="file"
              className="file-input"
            />
          </label> 
        </div> 
         */}
        <button disabled={navigation.state === "submitting" } className="submit-button">
            {navigation.state === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </Form>   
      </div>
    </>
  );
}


