import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Create this CSS file

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p className="not-found-message">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button">
            Return to Home
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default NotFound;