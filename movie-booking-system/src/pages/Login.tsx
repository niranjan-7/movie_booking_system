import React from 'react';
import AuthForm from '../components/AuthForm';
import styled from 'styled-components';

const Login: React.FC = () => {
  return (
    <Container>
      <h1>Login</h1>
      <AuthForm />
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
