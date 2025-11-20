import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  allowedRoles?: number[];
  children: React.ReactElement | React.ReactElement[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [], children }) => {
  const location = useLocation();

  const raw = localStorage.getItem('user');
  if (!raw) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  let user: any = null;
  try {
    user = JSON.parse(raw);
  } catch (e) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_type_id)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
 
