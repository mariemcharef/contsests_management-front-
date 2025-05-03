export async function getproblems(){
    const res= await fetch("http://localhost:8087/api/v1/public/problems/old")
    if(!res.ok){
        throw {
            message:"fail to fetch problems",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}
export async function getParticipantByUser(name){
    const token=localStorage.getItem("token")
    const res= await fetch(`http://localhost:8087/api/v1/participants/getParticipantsByUser/${name}`,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }})
    if(!res.ok){
        throw {
            message:"fail to fetch problems",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    
    return data
}

export async function getcompetitions(){
    const res= await fetch("http://localhost:8087/api/v1/public/competitions",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        }}
    )
    if(!res.ok){
        throw {
            message:"fail to fetch competitions",
            statusText: res.message,
            status: res.status
        }
    } 
    const data = await res.json()
    return data
}
export async function getAnnouncements(){
    const res= await fetch("http://localhost:8087/api/v1/public/announcements/all",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        }}
    )
    if(!res.ok){
        throw {
            message:"fail to fetch competitions",
            statusText: res.message,
            status: res.status
        }
    } 
    const data = await res.json()
    return data
}

export async function getproblemsbycompetition(id){
    const token=localStorage.getItem("token")
    const res= await fetch(`http://localhost:8087/api/v1/problems/competition/${id}`,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }})
    if(!res.ok){
        throw {
            message:"fail to fetch competitions",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}
export async function getproblem(id){
    const res= await fetch(`http://localhost:8087/api/v1/public/problems/${id}/problem`)
    if(!res.ok){
        throw {
            message:"fail to fetch problem",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}

//by competition (review)
export async function getsubmissions(){
    const res= await fetch("http://localhost:8087/api/v1/public/submissions/all")
    if(!res.ok){
        throw {
            message:"fail to fetch submissions",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}

export async function getsubmissionsById(){
  let participant=localStorage.getItem('participant')
  if (participant.startsWith('"') && participant.endsWith('"')) {
    participant = participant.slice(1, -1);
  }
    const token=localStorage.getItem("token")
    const res= await fetch(`http://localhost:8087/api/v1/submissions/ByParticipant/${participant}`,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }})
    if(!res.ok){
        throw {
            message:"fail to fetch submissions",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}

export async function getCompetitionStatus(id){
    const res =await fetch(`http://localhost:8087/api/v1/public/competitions/${id}`)
    if(!res.ok){
        throw {
            message:"fail to fetch submissions",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    const competition=data
    const now = new Date();
    const start = new Date(competition.startTime);
    const end = new Date(competition.endTime);

    if (now < start) return 'Not Started';
    if (now >= start && now <= end) return 'Running';
    return 'Completed';
    
}


export async function submitSolution(data) {
  let participant=localStorage.getItem('participant')
  if (participant.startsWith('"') && participant.endsWith('"')) {
    participant = participant.slice(1, -1);
  }
  
  
    const token =localStorage.getItem('token')
   
    const response = await fetch(`http://localhost:8087/api/v1/submissions/${data.problemId}/${participant}/add`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          languageId:data.languageId,
          code:data.code,
        })
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
      const responseData = await response.json();
      return getResult(responseData.id);

}

async function getResult(id) {
    const token=localStorage.getItem("token")

    await new Promise(resolve => setTimeout(resolve, 20000));
    await fetch(`http://localhost:8087/api/v1/submissions/result/${id}`,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }})

}

export async function loginUser(creds) {
    try {
        const res = await fetch("http://localhost:8087/api/v1/auth/authenticate", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creds)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setTimeout(() => {
            console.log("14");
            window.location.reload();
            
        }, 200);
        return data;
        
    } catch (error) {
        console.error("Request Failed:", error.message);
      throw error; 
    }
}

  
  export async function signUpUser(creds) {
    try {
      const res = await fetch("http://localhost:8087/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data=await res.json();
  
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        console.log("14");
        window.location.reload();
        
    }, 200);
      return data;
  
    } catch (error) {
      console.error("Request Failed:", error.message);
      throw error;
    }
  }

export async function gettestcases(problemId){
    const res= await fetch(`http://localhost:8087/api/v1/public/testCases/${problemId}/all`)
    if(!res.ok){
        throw {
            message:"fail to fetch testCases",
            statusText: res.message,
            status: res.status
        }
    }
    const data = await res.json()
    return data
}

export async function deleteTeam(id) {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8087/api/v1/participants/${id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete team');
        }
        
}

export async function fetchTeamMembers(id){
    const token=localStorage.getItem('token')
    const res = await fetch(`http://localhost:8087/api/v1/participants/membres/${id}`,{
        method: 'Get',
        headers:{
           "Authorization": `Bearer ${token}`,
            'Content-type':'application/json'
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to voir team membres');
    }
    const data = await res.json()
    return data
}
export async function quitTeam(id,name) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8087/api/v1/participants/delete-user/${name}/${id}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to quit team');
    }
    
}
export async function createTeam(teamName,username) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8087/api/v1/participants?userName=${username}`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name:teamName}),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create team');
    }
    return await res.json(); 
} 
export async function addMembre(user_name,participant_id){
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8087/api/v1/participants/addUserToParticipants/${user_name}/${participant_id}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to add membre to team');
    }
}
export async function deleteMembre(id,name){
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8087/api/v1/participants/delete-user/${name}/${id}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to add membre to team');
    }
}
export async function deleteAccount(){
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8087/api/v1/users/delete`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete this account');
    }
}
export async function changePassword(currPassword,nouvPassword){
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8087/api/v1/users/changePassword`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPassword:currPassword,
      newPassword:nouvPassword
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to change password!');
  }
}
export async function getClarifications(id) {
  const token=localStorage.getItem("token")
  const res = await fetch (`http://localhost:8087/api/v1/clarifications/by_problem/${id}`,{
    method:"GET",
    headers:{
      "Authorization": `Bearer ${token}`,
    }})
    if(!res.ok){
      const error= await res.json();
      throw new(error.message || "Failed to get clarifications")
    }
    return await res.json()
}
export async function addClarificationRequest(req) {
  const token=localStorage.getItem('token')
  let participant=localStorage.getItem('participant')
  if (participant.startsWith('"') && participant.endsWith('"')) {
    participant = participant.slice(1, -1);
  }
  const res=await fetch (`http://localhost:8087/api/v1/clarifications/${req.problemid}/${participant}/add`,{
    method:"POST",
    headers:{
      "Authorization": `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question:req.question
    })
  })
  if(!res.ok){
    const error= await res.json();
    throw new(error.message || "Failed to create clarifications")
  }
  
}
export async function getCreator(id){
  const token=localStorage.getItem('token')
  const res = await fetch (`http://localhost:8087/api/v1/clarifications/${id}/whoWillReceive`,{
    method:"GET",
    headers:{
      "Authorization": `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })
  if(!res.ok){
    const error= await res.json();
    throw new(error.message || "Failed to create clarifications")
  }
  return await res.json();
}
export async function answerClarification(req){
  const token = localStorage.getItem('token')
  const res= await fetch (`http://localhost:8087/api/v1/clarifications/${req.id}/answer`,{
    method:"PATCH",
    headers:{
      "Authorization":`Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer:req.answer
    })
  })
  if(!res.ok){
    const error= await res.json();
    throw new(error.message || "Failed to create clarifications")
  }

}