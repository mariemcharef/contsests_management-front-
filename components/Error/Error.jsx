import React from 'react'
import './Error.css'
import { useRouteError } from 'react-router-dom'
function Error() {
    const error = useRouteError()
    console.log(error)
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h1 className="error-message">Error: {error.message}</h1>
      <per>{error.status}-{error.statusText}</per>
      <button 
        className="error-action"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  )
}

export default Error