import {ChangeEvent, useRef, useState} from 'react';
import {useForm} from '../hooks/formHooks';
import {useFile, useMedia, useTags} from '../hooks/apiHooks';
import useUserContext from '../hooks/contextHooks';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<string>('');

  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const {postTags} = useTags();
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
      const mediaResponse = await postMedia(fileResponse, inputs, token);

      const mediaId = mediaResponse.media_id;
      const tagList = tags.split(',').map((tag) => tag.trim());
      await postTags(tagList, mediaId, token);

      setUploadResult('Upload successful');
      setFile(null);
      setTags('');
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

  const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

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
              <form className="space-y-6 rounded-xl bg-white p-8 shadow-xl">
                {/* File Upload Section */}
                <label
                  htmlFor="file"
                  className="relative flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center text-gray-600 transition duration-200 hover:border-amber-500 hover:bg-gray-50"
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
                        className="mb-3 h-12 w-12 text-amber-500 transition duration-200 hover:scale-105"
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
                      <span className="text-sm font-semibold tracking-wide">
                        Click or Drag to Upload
                      </span>
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
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                    name="title"
                    type="text"
                    id="title"
                    onChange={handleInputChange}
                    value={inputs.title}
                    placeholder="Enter a title..."
                  />
                </div>

                {/* Description Input */}
                <div className="relative">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    className="mt-1 h-32 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                    name="description"
                    id="description"
                    onChange={handleInputChange}
                    value={inputs.description}
                    placeholder="Write a description..."
                  ></textarea>
                </div>

                {/* Tags Input */}
                <div className="relative">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tags (comma separated)
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                    name="tags"
                    type="text"
                    id="tags"
                    onChange={handleTagsChange}
                    value={tags}
                    placeholder="Enter tags (comma separated)"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    className={`flex-1 rounded-lg px-5 py-3 font-medium text-white transition duration-200 ${
                      file &&
                      inputs.title.length > 3 &&
                      inputs.description.length > 0
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-lg'
                        : 'cursor-not-allowed bg-gray-400'
                    }`}
                    onClick={handleSubmit}
                    type="submit"
                    disabled={
                      !file ||
                      inputs.title.length <= 3 ||
                      inputs.description.length === 0
                    }
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg bg-gray-200 px-5 py-3 font-medium text-gray-700 transition duration-200 hover:bg-gray-300 hover:shadow-md"
                  >
                    Reset
                  </button>
                </div>

                {/* Upload Result */}
                {uploadResult && (
                  <p className="mt-4 text-center text-sm font-medium text-gray-600">
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
              <h1 className="mb-6 text-center text-4xl font-bold text-gray-200">
                Please log in to upload media
              </h1>
              <div className="flex justify-center">
                <p className="text-center text-lg text-gray-300">
                  To upload your content, please log in to your account. <br />
                  New here? <span className="text-amber-400">Sign up</span>{' '}
                  today!
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  className="px-6 py-3 text-lg font-semibold text-white transition-all transform bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                  onClick={() => {
                    window.location.href = '/user';
                  }}
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
