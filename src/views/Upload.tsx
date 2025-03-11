import { ChangeEvent, useRef, useState, KeyboardEvent } from 'react';
import { useForm } from '../hooks/formHooks';
import { useFile, useMedia, useTags } from '../hooks/apiHooks';
import useUserContext from '../hooks/contextHooks';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<string>('');

  const { postFile } = useFile();
  const { postMedia } = useMedia();
  const { postTags } = useTags();
  const initValues = { title: '', description: '' };

  const { user } = useUserContext();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const doUpload = async () => {
    setUploading(true);
    console.log(inputs);

    try {
      const token = localStorage.getItem('token');
      if (!file || !token) {
        throw new Error('File or token missing');
      }

      if (!file.type.includes('image') && !file.type.includes('video')) {
        setUploadResult('Invalid file type. Please upload an image or video.');
        return;
      }
      const fileResponse = await postFile(file, token);
      const mediaResponse = await postMedia(fileResponse, inputs, token);

      const mediaId = mediaResponse.media_id;

      if (tags.length > 0) {
        await postTags(tags, mediaId, token);
      }

      setUploadResult('Upload successful');
      setFile(null);
      setTags([]);
      setInputs(initValues);
    } catch (error) {
      console.error((error as Error).message);
      setUploadResult((error as Error).message);
    } finally {
      setUploading(false);
      setFile(null);
      setTags([]);
      setInputs(initValues);
    }
  };

  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const { handleSubmit, handleInputChange, inputs, setInputs } = useForm(
    doUpload,
    initValues,
  );

  const handleTagsChange = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.currentTarget;
      addTag(input.value);
      input.value = '';
    }
  };

  return (
    <>
      {user ? (
        <>
          <div className="flex h-3/4 p-5 items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-stone-950/80 p-6 shadow-2xl backdrop-blur-md ring-1 mb-10 ring-stone-700">
              <h1 className="mb-4 text-center text-3xl font-semibold text-white">
                Upload Media
              </h1>
              <form className="space-y-6 rounded-xl bg-white p-8 shadow-xl">
                <label
                  htmlFor="file"
                  className="relative flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center text-gray-600 transition duration-200 hover:border-amber-500 hover:bg-gray-50"
                >
                  {file ? (
                    file.type.includes('video') ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className="absolute inset-0 h-full w-full rounded-xl object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        className="absolute inset-0 h-full w-full rounded-xl object-cover"
                        alt="Preview"
                      />
                    )
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
                <div className="relative">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
                <div className="relative">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                <div className="relative">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                    name="tags"
                    type="text"
                    id="tags"
                    onKeyDown={handleTagsChange}
                    placeholder="Enter tags (press Enter to add)"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 h-4 w-4 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition duration-200"
                >
                  Reset
                </button>

                <p className="mt-2 text-center text-sm text-gray-600">{uploadResult}</p>

              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-3/4 items-center justify-center">
          <h1 className="text-3xl font-semibold text-white">Please log in to upload media</h1>
        </div>
      )}
    </>
  );
}

export default Upload;