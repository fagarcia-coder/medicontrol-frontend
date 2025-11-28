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

  // Ensure user is active (user_status_id === 1 expected to mean 'activo')
  if (user?.user_status_id !== undefined && Number(user.user_status_id) !== 1) {
    // Clear local auth and redirect to login with reason (2=inactive,3=blocked)
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    const reason = Number(user.user_status_id) === 2 ? 'inactive' : 'blocked';
    return <Navigate to="/login" replace state={{ from: location, reason }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_type_id)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
 
