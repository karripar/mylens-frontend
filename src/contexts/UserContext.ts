import {createContext} from 'react';
import {AuthContextType} from '../types/localTypes';

const UserContext = createContext<AuthContextType | null>(null);

export default UserContext;
