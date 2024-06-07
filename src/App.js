import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList/BookList';
import LoginForm from './components/LoginForm/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookDetailContainer from './components/BookDetails/BookDetailContainer';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);


  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.status === 200) {
        setLoggedIn(true);
        setUserData(response.data); // Set user data here
        setLoggedInUser(response.data); // Add this line to set the logged-in user
      } else {
        // Handle login failure
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login failure
    }
  };

  useEffect(() => {
    // Log the updated value of loggedInUser
    console.log("loggedInUser:", loggedInUser);

    // Extract and log the userId directly
    if (loggedInUser && loggedInUser.userId) {
      console.log("UserID:", loggedInUser.userId);
    }
  }, [loggedInUser]);


  const handleLogout = async () => {
    setLoggedIn(false);
    setUserData(null);
  };

  const handleSignup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', userData);
      if (response.status === 201) {
        setLoggedIn(true);
        setUserData(userData);
      } else {
        // Handle signup failure
      }
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle signup failure
    }
  };

  const handleGuestMode = async () => {
    setLoggedIn(false);
    setUserData(null);
    setGuestMode(true);
  };

  return (
    <Router>
      <div className="App">
        {loggedIn && (
          <div className='user-details'>
            <p>Welcome, {userData && userData.username}</p>
            <button className='button-style' onClick={handleLogout}>Logout</button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              loggedIn || guestMode ? (
                <BookList userData={userData} loggedIn={loggedIn} guestMode={guestMode} handleGuestMode={handleGuestMode} setLoggedIn={setLoggedIn} setGuestMode={setGuestMode} loggedInUser={loggedInUser} />
              ) : (
                <LoginForm onLogin={handleLogin} onSignup={handleSignup} onGuestMode={handleGuestMode} />
              )
            }
          />
          <Route path="/book/:title" element={<BookDetailContainer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
