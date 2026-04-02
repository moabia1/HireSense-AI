import React from 'react'
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

const Protected = () => {
  const { user,loading } = useAuth();

  if(loading){
    return <main><h1>Loading...</h1></main>
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
}

export default Protected