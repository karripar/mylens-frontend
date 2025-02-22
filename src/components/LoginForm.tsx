import { useForm } from "../hooks/formHooks";
import { Credentials } from "../types/localTypes";
import useUserContext from "../hooks/contextHooks";

interface LoginFormProps {
  toggleRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleRegister }) => {
  const initValues: Credentials = {email: '', password: ''};
  const { handleLogin } = useUserContext();

  const doSubmit = () => {
    try {
      handleLogin(inputs as Credentials);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(doSubmit, initValues);

  return (
    <div className="flex flex-col items-center justify-center min-h-1/2 bg-gray-900 my-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={inputs.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <button
          onClick={toggleRegister}
          className="w-full mt-4 text-blue-500 hover:underline text-sm"
        >
          Register instead?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

