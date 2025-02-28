import React, {createContext, useEffect, useState} from "react";
import { UserWithNoPassword } from "hybrid-types/DBTypes";
import { useAuthentication, useUser } from "../hooks/apiHooks";
import { AuthContextType, Credentials } from "../types/localTypes";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const {postLogin} = useAuthentication();
  const {getUser} = useUser();
  const navigate = useNavigate();

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
      setUser(userResponse.user);
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

const location = useLocation();

const handleAutoLogin = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const userResponse = await getUser(token);
    setUser(userResponse.user);
    const origin = location.state.from.pathname || '/';
    navigate(origin);
  } catch (error) {
    console.log('Auto login failed, no user found');
    console.error((error as Error).message);
  }
};

return (
  <UserContext.Provider
    value={{user, handleLogin, handleLogout, handleAutoLogin}}
  >
    {children}
  </UserContext.Provider>
);
}

export {UserProvider, UserContext};
