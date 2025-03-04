import React, { useEffect, useState } from 'react';
import { useAuthentication, useUser } from '../hooks/apiHooks';
import { UserWithProfilePicture } from 'hybrid-types/DBTypes';
import { Credentials } from '../types/localTypes';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from './UserContext';  // Import the context

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithProfilePicture | null>(null);
  const { postLogin } = useAuthentication();
  const { getUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handleAutoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (credentials: Credentials) => {
    try {
      const response = await postLogin(credentials);
      if (!response.user) {
        throw new Error('Login failed');
      }
      console.log('login successful');
      localStorage.setItem('token', response.token);
      const userResponse = await getUser(response.token);
      setUser({
        ...userResponse.user,
        profile_picture:
          (userResponse.user as UserWithProfilePicture).profile_picture || '',
      });
      navigate('/');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleAutoLogin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userResponse = await getUser(token);
      setUser({
        ...userResponse.user,
        profile_picture:
          (userResponse.user as UserWithProfilePicture).profile_picture || '',
      });

      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } catch (error) {
      console.log('Auto login failed, no user found');
      console.error((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, handleLogin, handleLogout, handleAutoLogin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
