import {ChangeEvent, useRef, useState} from 'react';
import {useForm} from '../hooks/formHooks';
import {useFile, useMedia} from '../hooks/apiHooks';
import useUserContext from '../hooks/contextHooks';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<string>('');

  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const initValues = {title: '', description: ''};

  const {user} = useUserContext();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  const doUpload = async () => {
    setUploading(true);
    console.log(inputs);
    try {
      const token = localStorage.getItem('token');
      if (!file || !token) {
        throw new Error('File or token missing');
      }
      const fileResponse = await postFile(file, token);
      await postMedia(fileResponse, inputs, token);
      setUploadResult('Upload successful');
      setFile(null);
      setInputs(initValues);
    } catch (error) {
      console.error((error as Error).message);
      setUploadResult((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doUpload,
    initValues,
  );

  return (
  <>
      {user ? (
    <>
  <div className="flex h-3/4 p-5 items-center justify-center">
    <div className="w-full max-w-md rounded-2xl bg-stone-950/80 p-6 shadow-2xl backdrop-blur-md ring-1 ring-stone-700">
      {/* Header */}
      <h1 className="mb-4 text-center text-3xl font-semibold text-white">
        Upload Media
      </h1>

      {/* Upload Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* File Upload Section */}
        <label
          htmlFor="file"
          className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-700 bg-stone-900 p-4 text-center text-gray-400 transition hover:border-amber-500 hover:bg-stone-800"
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              className="absolute inset-0 h-full w-full rounded-xl object-cover"
              alt="Preview"
            />

            ) : (
          <>
              <svg
                className="mb-2 h-10 w-10 text-amber-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M12 3v12m-3-3 3 3 3-3"
                ></path>
              </svg>
              <span className="text-sm font-medium">Click or Drag to Upload</span>
              <input
                type="file"
                id="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                ref={fileRef}
                className="absolute inset-0 h-full w-full opacity-0"
              />
            </>
          )}
        </label>

        {/* Title Input */}
        <div className="relative">
          <input
            className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-3 text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
            value={inputs.title}
            placeholder="Title"
          />
        </div>

        {/* Description Input */}
        <div className="relative">
          <textarea
            className="h-28 w-full resize-none rounded-lg border border-stone-700 bg-stone-800 px-4 py-3 text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
            name="description"
            id="description"
            onChange={handleInputChange}
            value={inputs.description}
            placeholder="Write a description..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            className={`flex-1 rounded-lg px-5 py-3 font-medium text-white transition ${
              file && inputs.title.length > 3 && inputs.description.length > 0
                ? "bg-amber-600 hover:bg-amber-700"
                : "cursor-not-allowed bg-gray-500"
            }`}
            type="submit"
            disabled={
              !file || inputs.title.length <= 3 || inputs.description.length === 0
            }
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="flex-1 rounded-lg bg-stone-700 px-5 py-3 font-medium text-white transition hover:bg-stone-600"
          >
            Reset
          </button>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <p className="mt-3 text-center text-sm font-medium text-gray-300">
            {uploadResult}
          </p>
        )}
      </form>
    </div>
  </div>
  </>
) : (
  <>
  <div className="flex h-3/4 my-10 items-center justify-center ">
    <div className="w-full max-w-lg rounded-2xl p-8 shadow-xl backdrop-blur-md">
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
        Please log in to upload media
      </h1>
      <div className="flex justify-center">
        <p className="text-center text-lg text-gray-500">
          To upload your content, please log in to your account. <br />
          New here? <span className="text-amber-400">Sign up</span> today!
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="px-6 py-3 text-lg font-semibold text-white transition-all transform bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
          onClick={() => {
            window.location.href = '/user';
          }
          }
        >
          Log In
        </button>
      </div>
    </div>
  </div>
</>
)}
</>
  );
};

export default Upload;
