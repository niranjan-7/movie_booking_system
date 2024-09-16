import React from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Home: React.FC = () => {
  const { logout } = useAuth();

  return (
    <HomeContainer>
      <h1>Welcome to the Movie Booking System</h1>
      {/* <button onClick={logout}>Logout</button> */}
      
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  h1 {
    font-size: 2rem;
  }
  button {
    padding: 10px 20px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    cursor: pointer;
  }
`;
