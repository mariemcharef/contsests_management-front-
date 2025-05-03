import { redirect } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';

export async function requireAuth(request) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      const url = new URL(request.url);
      const from = url.pathname + url.search;
      throw redirect(`/login?message=Please log in first&redirectTo=${encodeURIComponent(from)}`);
    }
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        throw redirect('/login?message=Session expired. Please log in again');
      }
      return null; // Return null if authenticated
    } catch (error) {
      throw redirect('/login?message=Invalid session. Please log in again');
    }
  }