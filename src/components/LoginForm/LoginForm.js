import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';

import './LoginForm.css';
import LoginLogoImg from "../../images/library-logo.png";

function LoginForm({ onLogin, onSignup, onGuestMode }) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { // Use axios.post instead of fetch
      username: loginUsername,
      password: loginPassword
    });

      if (response.status === 200) {
        onLogin(loginUsername, loginPassword);
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/register', { // Use axios.post instead of fetch
        username: signupUsername,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword
      });

      if (response.status === 201) {
        const userData = response.data;
        onSignup(userData.username);
      } else {
        alert('Error signing up. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  const handleGuestMode = () => {
    console.log("Guest Mode clicked");
    onGuestMode();
  };

  return (
    <div className='login-form'>
      <div className='login-form-container'>
        <div className='row m-0'>
          <div className='loginpage-logo col-12'>
            <img src={LoginLogoImg} alt='logo' className='logo' />
          </div>
          <div className="loginForm col-12 col-md-6">
            <h3 className='form-heading text-uppercase'>Login Form</h3>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="loginFormUsername">
                <Form.Label className='text-uppercase'>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="loginFormPassword">
                <Form.Label className='text-uppercase'>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </Form.Group>
              <Button className="mt-3 button-style" variant="primary" type="submit">
                Login
              </Button>
            </Form>
            <h4 className='mt-3 text-white'>Dont have account? Explore as Guest</h4>
            <Button className="mt-3 button-style" variant="primary" onClick={handleGuestMode}>Guest Mode</Button>
          </div>
          <div className="signupForm col-12 col-md-6">
            <h3 className='form-heading text-uppercase'>Sign Up Form</h3>
            <Form onSubmit={handleSignup}>
              <Form.Group controlId="signupFormUsername">
                <Form.Label className='text-uppercase'>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="signupFormEmail">
                <Form.Label className='text-uppercase'>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="signupFormPhone">
                <Form.Label className='text-uppercase'>Phone number</Form.Label>
                <Form.Control type="text" placeholder="Enter phone number" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="signupFormPassword">
                <Form.Label className='text-uppercase'>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </Form.Group>
              <Button className="button-style mt-3" variant="primary" type="submit">
                Sign Up
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
