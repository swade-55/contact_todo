import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth); 

  if (auth.isLoading) {
    return <div>Loading...</div>;
  } else if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};



export default ProtectedRoute
