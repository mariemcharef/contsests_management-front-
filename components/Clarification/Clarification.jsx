import React, { useState,useEffect } from 'react';
import "./Clarification.css";
import{getClarifications,addClarificationRequest,getCreator,answerClarification}from"../../src/api"
import{requireAuth} from "../../src/utils"
import { useLoaderData, useParams } from 'react-router-dom';
import { useAuth } from "../../src/AuthContext";


export async function loader({ request,params }) {
  await requireAuth(request)
  const data= await getClarifications(params.id);
  console.log(data)
  return data
}


function Clarification() {
  const clarifications=useLoaderData()
  const [newRequest, setNewRequest] = useState('');
  const {id}=useParams()
  const [activeTab, setActiveTab] = useState('requests');
  const [error,setError]=useState('')
  const [success,setSuccess]=useState(false)
  const {name} = useAuth();
  const [creator,setCreator]=useState('')
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(()=>{
    const fetchCreator = async () => {
      try {
        const name = await getCreator(id);
        setCreator(name.name);
      } catch (err) {
        setError(err.message);
      } 
    };
    fetchCreator(); 
  },[id])

  const handleSubmitRequest =async  (e) => {
    e.preventDefault();
    if (!newRequest.trim()) return;
      try{
      const newReq = {
        problemid:id,
        question: newRequest,
      };
      await addClarificationRequest(newReq)
      setNewRequest('')
      setSuccess(true)
    }catch(error){
      setError(error.message);
      setSuccess(null)
    }
  };

  const handleSubmitResponse =async (e) => {
    e.preventDefault()
    const Cid=selectedRequest.id
    if (!answerText.trim() || !selectedRequest) return;
    try{
      const Resp = {
        id: Cid,
        answer: answerText,
      };
      await answerClarification(Resp)
    }catch(error){
      setError(error.message)
    }
    setAnswerText('');
    setSelectedRequest(null);
  };

  const ClarResponsed=clarifications.filter(c=>c.answer)
  return (
    <div className="clarification-container">
      <div className="clarification-header">
        <h1>Clarifications</h1>
        <p>Ask questions or view answers about the competition</p>
      </div>
      <div className="clarification-tabs">
        <div 
          className={`tab-button active`}
        >
          Requests ({clarifications.filter(clar=>clar.question && clar.question.trim()!=='').length})
        </div>
        
      </div>   
      <div className="clarification-content">
       

          <div className="requests-section">
            {creator!==name &&<div className="new-request-form">
              <h3>Submit a New Question</h3>
              {error && <p className='red'>{error}</p>}
              {success && <p className='green'>Question added with success!</p>}
              <form onSubmit={handleSubmitRequest}>
                <textarea
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  placeholder="Type your question here..."
                  required
                />
                <button type="submit" disabled={!newRequest.trim()} className="submit-button">Submit Question</button>
              </form>
            </div>}

            <h2>Participants Questions</h2>
            <div className="request-list">
              { clarifications.length > 0 ? (
                clarifications.map(request => (
                  <div key={request.id} className={`request-item`}>
                    <div className="request-header">
                      <span className="user">{request.participant.name}:</span>
                    </div>
                    <div className="question">{request.question}</div>
                    {request.answer && (
                      <div className="response-preview">
                        <strong>Response:</strong> 
                        <p>{request.answer}</p>
                      </div>
                    )}
                    {creator===name &&<button 
                      className="answer-button"
                      onClick={() => {
                        setSelectedRequest(request)
                        setAnswerText(request.answer || '')
                      }}
                    >
                      {request.answer ? 'Update Answer' : 'Answer This'}
                    </button>}
                  </div>
                ))
              ) : (
                <p>No clarification requests yet.</p>
              )}
            </div>
          
          </div>
        
      </div>
      
      {selectedRequest && (
        <div className="response-modal">
          <div className="modal-content">
            <h3>Answer the Question</h3>
            <div className="original-question">
              <strong>Question:</strong> {selectedRequest.question}
            </div>
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer here..."
                required
              />
              <div className="modal-buttons">
                <button disabled={!answerText.trim()} type="submit" className="submit-button1">
                  {selectedRequest.answer ? 'Update Answer' : 'Submit Answer'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setSelectedRequest(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clarification;