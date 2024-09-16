import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://127.0.0.1:5000';

export const useUserApi = () =>{
  const loginApi = (username:string,password:string) =>
  axios.post(`${API_URL}/login`,{username:username,password:password}).then((res)=>res.data)

  const signUpApi = (username: string, password: string, name: string) =>
  axios.post(`${API_URL}/register`, { username, password, name }).then((res) => res.data);

  return {loginApi,signUpApi}
}



export const useApi = () => {
  const { token } = useAuth();

  
 
  const getAuthHeader = () => {
    return { Authorization: `Bearer ${token}` };
  };

  const fetchThisWeekMovies = () =>
    axios.get(`${API_URL}/movies/this-week`, { headers: getAuthHeader() }).then((res) => res.data);

  const fetchUpcomingMovies = () =>
    axios.get(`${API_URL}/movies/upcoming`, { headers: getAuthHeader() }).then((res) => res.data);

  const bookMovie = (showId: number) =>
    axios.post(`${API_URL}/bookings`, { show_id: showId }, { headers: getAuthHeader() });

  const fetchBookings = () =>
    axios.get(`${API_URL}/my-bookings`, { headers: getAuthHeader() }).then((res) => res.data);

  const cancelBooking = (bookingId: number) =>
    axios.post(`${API_URL}/cancel-booking/${bookingId}`, {}, { headers: getAuthHeader() });

  return { fetchThisWeekMovies,fetchUpcomingMovies, bookMovie, fetchBookings, cancelBooking  };
};
