import React from 'react';
import AuthForm from '../components/AuthForm';
import styled from 'styled-components';

const Signup: React.FC = () => {
  return (
    <Container>
      <h1>Signup</h1>
      <AuthForm isSignup />
    </Container>
  );
};

export default Signup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
