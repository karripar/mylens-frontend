import {
  UserWithProfilePicture,
  UserWithUnhashedPassword,
} from 'hybrid-types/DBTypes';

type Credentials = Pick<UserWithUnhashedPassword, 'email' | 'password'>;

type RegisterCredentials = Pick<
  UserWithUnhashedPassword,
  'email' | 'password' | 'username'
>;

type AuthContextType = {
  user: UserWithProfilePicture | null;
  handleLogin: (credentials: Credentials) => Promise<void>;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type {Credentials, RegisterCredentials, AuthContextType};
