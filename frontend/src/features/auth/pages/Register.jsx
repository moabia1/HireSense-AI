import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");


  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({ email, password, username });
    navigate("/");
  };

  if (loading) {
    return <main><h1>Loading...</h1></main>
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              type="text"
              id="username"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Register</button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  );
}

export default Register