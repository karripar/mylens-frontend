import { useState } from "react";

const useForm = (
  callback: (event?: React.SyntheticEvent) => Promise<void> | void, // Callback can now return a promise
  initState: Record<string, string>
) => {
  const [inputs, setInputs] = useState(initState);

  // Handle form submission and call the callback function
  const handleSubmit = async (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    await callback(event); // Wait for the async callback to complete
  };

  // Handle input changes and update the state, using the input name as the key
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((inputs) => ({ ...inputs, [event.target.name]: event.target.value }));
  };


  return {
    handleSubmit,
    handleInputChange,
    inputs,
    setInputs,
  };
};

export { useForm };
