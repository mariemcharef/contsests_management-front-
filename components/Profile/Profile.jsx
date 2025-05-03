import React, { useState ,useEffect} from "react";
import "./profile.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import { p } from "framer-motion/client";
import {
  getParticipantByUser,
  deleteTeam,
  fetchTeamMembers,
  quitTeam,
  createTeam,
  addMembre,
  deleteMembre,
  deleteAccount,
  changePassword
} from "../../src/api";
import { useAuth } from "../../src/AuthContext";

export async function loader({ params }) {
  return await getParticipantByUser(params.name);
}

export default function Profile() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const participants = useLoaderData();
  const { setParticipant, participant, rating, name ,logout} = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [MembreName, setMembreName] = useState("");
  const [error, setError] = useState(null);
  const [errorTeam, setErrorTeam] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [successChagePassword, setSuccessChagePassword] = useState('');

  const handleActiveparticipant = (name) => {
    setParticipant(name);
  };

  const handleDeleteAccount = async(e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount(name);
        logout()
        navigate("/login")
      } catch (error) {
        setError(error.message);
        
      }
    }

  };
  const handleDeleteMembre=async(e,id,membre)=>{
    e.preventDefault();
    try{
      await deleteMembre(id,membre)
      const updatedMembers = await fetchTeamMembers(id);
      setTeamMembers(updatedMembers.map(u => u.name));
      setSuccess("Member deleted successfully!");
      setErrorTeam(null);
    }catch{
      setErrorTeam(error.message);
      setSuccess(null);
    }
  }
  const handleAddMembre =async (e,id) => {
    e.preventDefault();
    try{
      await addMembre(MembreName,id)
      const updatedMembers = await fetchTeamMembers(id);
      setTeamMembers(updatedMembers.map(u => u.name));
      setMembreName("");
      setErrorTeam(null);
    } catch (error) {
      setErrorTeam(error.message);
      setSuccess(null);
    }
    setMembreName("");
  };

  const handleCreateTeam =async (e) => {
    e.preventDefault();
    try{
      await createTeam(teamName,name)
      navigate(0)
    } catch (error) {
      setError(error.message);
      setSuccess(null)
    }
  };

  const handleQuitTeam = async (e, id, name) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to quit this team? This action cannot be undone."
      )
    ) {
      try {
        await quitTeam(id, name);
        setError(null)
        navigate(0);
      } catch (error) {
        setError(error.message);
        setSuccess(null)
      }
    }
  };
  const voir_team_membres = async (e, participant) => {
    e.preventDefault();
    setTeamMembers([]);
    setSelectedParticipant(participant);
    setShowMembersModal(true);
    const data = await fetchTeamMembers(participant.id);
    data.map((u) => {
      setTeamMembers((p) => [...p, u.name]);
    });
  };

  const handleDeleteTeam = async (e, id) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      try {
        await deleteTeam(id);
        setSuccess("Team deleted successfully!")
        setError(null)
        navigate(0);
      } catch (error) {
        setError(error.message);
        setSuccess(null)
      }
    }
  };
  
  const handlePasswordChange =async (e) => {
    e.preventDefault();
    if(newPassword!==confirmPassword){
      setError('Correct the password!')
      setSuccess(null)
    }
    else{
      try{
        await changePassword(currentPassword,newPassword)
        setSuccessChagePassword('Password changed successfully!')
        setError(null)
        setNewPassword('')
        setConfirmPassword('')
        setCurrentPassword('')
      }catch(error){
        setError(error.message)
        setSuccessChagePassword(null)
      }
    }
  };
  return (
    <div className="profile-container">
      <div className="profile-header">
        {rating > 0 && (
          <div className="rating-display">
            <span className="rating-icon">⭐</span>
            Rating: <span className="rating-value">{rating}</span>
          </div>
        )}
        {error && <p className='red'>{error}</p>}
        {success && <p className='green'>{success}</p>}
        <div className="role-selector">
          <h3 className="role-title-profile">Act as:</h3>
          <div className="roles-list">
            {participants.map((p) => (
              <div key={p.id}>
                <div className="role_action">
                  <button
                    className={`role ${p.name === participant ? "active" : ""}`}
                    onClick={() => handleActiveparticipant(p.name)}
                  >
                    {p.name}
                  </button>
                  {p.name !== name && (
                    <div className="action-buttons">
                      <button
                        onClick={(e) => handleDeleteTeam(e, p.id)}
                        className="delete-team-btn"
                      >
                        Delete Team
                      </button>
                      <button
                        onClick={(e) => handleQuitTeam(e, p.id, name)}
                        className="quit-btn"
                      >
                        Quit
                      </button>
                    </div>
                  )}
                </div>
                {p.name !== name && (
                  <p
                    onClick={(e) => voir_team_membres(e, p)}
                    className="voir_team_membres"
                  >
                    {" "}
                    voir team membres
                  </p>
                )}
                {showMembersModal && selectedParticipant === p && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <button
                        className="close-modal"
                        onClick={() => {
                          setShowMembersModal(false);
                          setMembreName("");
                          setErrorTeam(null)
                        }}
                      >
                        ×
                      </button>
                      <ul className="team-members-list">
                      {errorTeam && <p className='red'>{errorTeam}</p>}
                        {teamMembers.length > 0 ? (
                          teamMembers.map((member) => (
                            <>
                              <li key={member} className="team-member-item">
                                {member}
                                {member !== name && (
                                  <button className="delete-btn" onClick={(e)=>handleDeleteMembre(e,selectedParticipant.id,member)}>
                                    Delete Membre
                                  </button>
                                )}
                              </li>
                            </>
                          ))
                        ) : (
                          <p>No team members found</p>
                        )}
                      </ul>
                      <input
                        type="text"
                        className="form_membre"
                        value={MembreName}
                        onChange={(e) => {setMembreName(e.target.value)}}
                        placeholder="Membre name"
                        required
                      />
                      <button disabled={!MembreName} className="edit-btn" onClick={(e)=>handleAddMembre(e,selectedParticipant.id)}>
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="team-creation">
        <div className="form-group-profile">
          <input
            type="text"
            className="form_team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
          />
          <button
            className="create_team"
            onClick={handleCreateTeam}
            disabled={!teamName.trim()}
          >
            +
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Profile Settings</h2>

        <form onSubmit={handlePasswordChange} className="password-form">
          <h3 className="form-title">Change Password</h3>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {successChagePassword && <p className='green'>{successChagePassword}</p>}
          <button type="submit" disabled={!currentPassword} className="submit-button">
            Change Password
          </button>
        </form>
      </div>

      <div className="danger-zone">
        <h3 className="danger-title">Danger Zone</h3>
        <p className="danger-warning">
          Once you delete your account, there is no going back. All your data
          will be permanently removed.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="delete-button"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
