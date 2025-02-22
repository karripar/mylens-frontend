import {useEffect, useRef} from 'react';
import useUserContext from '../hooks/contextHooks';
import {useForm} from '../hooks/formHooks';
import {useCommentStore} from '../stores/likeStore';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useComment} from '../hooks/apiHooks';
import {formatDate} from '../lib/functions';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {user} = useUserContext();
  const {comments, setComments} = useCommentStore();
  const {postComment, getCommentsByMediaId} = useComment();

  const initValues = {
    comment_text: '',
  };

  // Handle comment submission for the media item with null reference_comment_id (top-level comment)
  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await postComment(inputs.comment_text, item.media_id, null, token);
    } catch (error) {
      console.error(error);
    }
    if (inputRef.current) inputRef.current.value = '';
    setInputs(initValues);
  };

  // Handle reply to a comment by comment_id
  const doReply = async (comment_id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await postComment(inputs.comment_text, item.media_id, comment_id, token);
    } catch (error) {
      console.error(error);
    }
    if (inputRef.current) inputRef.current.value = '';
    setInputs(initValues);
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doComment,
    initValues,
  );

  const getComments = async () => {
    try {
      const response = await getCommentsByMediaId(item.media_id);
      if (!response) return;

      setComments(response);
    } catch (error) {
      setComments([]);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
    // eslint-disable-next-line
  }, [item.media_id]);

  return (
    <>
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-2 w-full mt-5"
        >
          <input
            ref={inputRef}
            type="text"
            name="comment_text"
            placeholder="Write a comment..."
            className="w-full bg-stone-800 text-amber-100 p-3 rounded-lg"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="w-full bg-amber-500 text-stone-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300"
          >
            Comment
          </button>
        </form>
      ) : (
        <p className="text-gray text-center mt-5">Please log in to comment</p>
      )}
      {comments.length > 0 && (
        <div className="w-full mt-5 space-y-1">
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="flex flex-col items-start gap-3 w-full p-4 rounded-xl bg-gray-900 shadow-md"
            >
              <p className="text-white font-medium text-lg">
                {comment.username}
              </p>
              <p className="text-gray-300 opacity-80">{comment.comment_text}</p>
              {user && (
                <button
                  onClick={() => doReply(comment.comment_id as number)}
                  className="bg-amber-500 text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-amber-600 transition-all duration-300 ease-in-out"
                >
                  Reply
                </button>
              )}
              <div className="flex justify-between w-full">
                <p className="text-gray-500">
                  {comment.created_at
                    ? formatDate(comment.created_at.toString(), 'fi-FI')
                    : 'Unknown date'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;
