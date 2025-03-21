import {useEffect, useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import {useForm} from '../hooks/formHooks';
import {RegisterCredentials} from '../types/localTypes';
import useUserContext from '../hooks/contextHooks';
import {Eye, EyeClosed} from 'lucide-react';

interface RegisterFormProps {
  toggleRegister: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({toggleRegister}) => {
  const {postRegister, getUsernameAvailable, getEmailAvailable} = useUser();
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const initValues: RegisterCredentials = {
    username: '',
    email: '',
    password: '',
  };
  const {handleLogin} = useUserContext();

  const doRegister = async () => {
    try {
      const response = await postRegister(inputs as RegisterCredentials);
      if (!response) {
        throw new Error('Registration failed');
      }
      setMessage({
        text: 'Registration successful, you may log in!',
        type: 'success',
      });
      console.log('Registration successful');

      const loginInputs = {email: inputs.email, password: inputs.password};

      await handleLogin(loginInputs);
    } catch (error) {
      console.error((error as Error).message);
      setMessage({text: (error as Error).message, type: 'error'});
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doRegister,
    initValues,
  );

  useEffect(() => {
    const main = async () => {
      try {
        if (inputs.username.length > 2) {
          const response = await getUsernameAvailable(inputs.username);
          setUsernameAvailable(response.available ?? true);
        } else {
          setUsernameAvailable(true);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.username]);

  useEffect(() => {
    const main = async () => {
      try {
        if (inputs.email.length > 2) {
          const response = await getEmailAvailable(inputs.email);
          setEmailAvailable(response.available ?? true);
        } else {
          setEmailAvailable(true);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.email]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-1/2 bg-gray-900 p-4 my-20">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Register
          </h2>
          {message && (
            <p
              className={`text-${message.type === 'success' ? 'green' : 'red'}-500 text-center`}
            >
              {message.text}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="justify-start text-start">
              <label htmlFor="username" className="text-gray-800 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={inputs.username}
                onChange={handleInputChange}
                autoComplete="off"
                required
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  usernameAvailable ? 'border-green-500' : 'border-red-500'
                }`}
              />
            </div>
            <div className="justify-start text-start">
              <label htmlFor="email" className="text-gray-800 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                value={inputs.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  emailAvailable ? 'border-green-500' : 'border-red-500'
                }`}
              />
            </div>
            <div className="justify-start text-start relative">
              <label htmlFor="password" className="text-gray-800 text-sm">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleInputChange}
                autoComplete="off"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Show password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </form>
          <button
            onClick={toggleRegister}
            className="w-full mt-4 text-blue-500 hover:underline text-sm"
          >
            Login instead?
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
