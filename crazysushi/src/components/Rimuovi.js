import React from 'react';
import { Navigate } from 'react-router-dom';

const Rimuovi = () => {
  return <Navigate to="/dishes?mode=remove" replace />;
};

export default Rimuovi;