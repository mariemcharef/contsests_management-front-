import { createContext,useContext,useState,useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { loginUser as login } from '../src/api'

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [token,setToken]=useState(localStorage.getItem('token'))
    const [name,setName]=useState(null)
    const [rating,setRating] = useState(null);
    const [participant, setParticipant] = useState(() => {
        const savedParticipant = localStorage.getItem('participant');
        return savedParticipant ? JSON.parse(savedParticipant) : name;
      });
    useEffect(()=>{
        if(token) {
            const decoded=jwtDecode(token);
            setUser(decoded);
            const currentTime=Date.now()/1000;
            if(decoded.exp<currentTime){
                logout();
            }
            
        }
    },[token]) 

    useEffect(() => {
        if (user?.sub) {
            const fetchUsername = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8087/api/v1/users/username?email=${user.sub}`, 
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }
                    );
                    const data = await response.json();
                    setName(data.name);
                    setRating(data.rating)
                    
                    setParticipant(data.name);
                } catch (error) {
                    console.error("Failed to fetch username:", error);
                    setName(null);
                }
            };
            fetchUsername();

        }
    }, [user?.sub, token]);

    useEffect(() => {
        participant 
            ? localStorage.setItem('participant', JSON.stringify(participant))
            : localStorage.removeItem('participant');
    }, [participant]);


    const logout=()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('participant')
        setUser(null)
        setToken(null) 
        setName(null)
        setParticipant(null)    
    }
  
    const value ={
        user,
        token,
        login,
        logout,    
        name,
        participant,
        setParticipant,
        rating
      };
    
    return (
        <AuthContext.Provider  value={value}>
            { children }
        </AuthContext.Provider>
    )
}


export const useAuth=()=>{
    return useContext(AuthContext)
}
