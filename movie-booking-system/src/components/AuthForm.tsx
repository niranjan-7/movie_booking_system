import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  isSignup?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(username, password, name); 
        alert('Signup successful!'); 
      } else {
        await login(username, password); 
        alert('Login successful!');
      }
      window.location.href = '/'; 
    } catch (error) {
      alert('Login/Signup failed!');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {isSignup && (
        <InputWrapper>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </InputWrapper>
      )}
      <InputWrapper>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </InputWrapper>
      <InputWrapper>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </InputWrapper>
      <Button type="submit">{isSignup ? 'Sign Up' : 'Login'}</Button>
    </Form>
  );
};

export default AuthForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin: auto;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
