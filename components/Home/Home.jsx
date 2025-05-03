import React from "react"
import { getAnnouncements } from '../../src/api';
import { useLoaderData } from "react-router-dom";
import "./Home.css"
export async function loader(){
    const data = await getAnnouncements()
     return data
}
export default function Home(){
    
    const ann=useLoaderData()
    const announcements = ann.sort((a, b) => {
        return new Date(b.createdDate)-new Date(a.createdDate);
    });
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    function handleregistration(){
        
    }


    return (
        <div className="home-announcements">
          <header className="announcements-header">
            <h1>Latest Competitions</h1>
            <p>Stay updated with upcoming coding challenges</p>
          </header>
    
          <div className="announcements-grid">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="card-header">
                    <h2> Announcement</h2>
                    <span className="post-date">
                      Posted: {formatDate(announcement.createdDate)}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <p>{announcement.content}</p>
                    
                  </div>
    
                  <div className="card-footer">
                    <button onClick={handleregistration} className="register-btn">Register Now</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No announcements available at the moment
              </div>
            )}
          </div>
        </div>
      );
    };
   
