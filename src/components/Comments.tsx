import {useEffect, useRef, useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import {useForm} from '../hooks/formHooks';
import {useCommentStore} from '../stores/likeStore';
import {
  CommentWithUsernameAndReplies,
  MediaItemWithOwner,
} from 'hybrid-types/DBTypes';
import {useComment} from '../hooks/apiHooks';
import {formatDate} from '../lib/functions';
import {CommentWithReplies, CommentWithUsername} from 'hybrid-types/DBTypes';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {user} = useUserContext();
  const {comments, setComments} = useCommentStore();
  const {postComment, getCommentsByMediaId} = useComment();
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  const initValues = {
    comment_text: '',
  };

  // Handle comment submission for the media item with null reference_comment_id (top-level comment)
  const doComment = async () => {
    if (!item || !inputs.comment_text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await postComment(inputs.comment_text, item.media_id, null, token);

      const response = await getCommentsByMediaId(item.media_id);
      if (response) {
        setComments(groupComments(response));
      }
    } catch (error) {
      console.error(error);
    }

    if (inputRef.current) inputRef.current.value = '';
    setInputs(initValues);
  };

  // Handle reply to a comment by comment_id
  const handleReply = async () => {
    if (!item || !replyToCommentId || inputs.comment_text.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await postComment(inputs.comment_text, item.media_id, replyToCommentId, token);

      const response = await getCommentsByMediaId(item.media_id);
      if (!response) return;

      setComments(groupComments(response));

    } catch (error) {
      console.error(error);
    }

    if (inputRef.current) inputRef.current.value = '';
    setInputs(initValues);
    setReplyToCommentId(null);
  };


  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(
    doComment,
    initValues,
  );

  const getComments = async () => {
    try {
      const response = await getCommentsByMediaId(item.media_id);
      if (!response) return;

      setComments(groupComments(response));
    } catch (error) {
      setComments([]);
      console.error((error as Error).message);
    }
  };

  const groupComments = (
    comments: CommentWithUsername[] = [],
  ): CommentWithUsernameAndReplies[] => {
    const commentMap: Record<
      number,
      CommentWithUsername & {replies: CommentWithUsername[]}
    > = {};
    const rootComments: CommentWithUsernameAndReplies[] = [];

    comments.forEach((comment) => {
      // Ensure replies is initialized as an empty array
      commentMap[comment.comment_id] = {...comment, replies: []};
    });

    comments.forEach((comment) => {
      if (comment.reference_comment_id) {
        // Push replies to the correct parent comment's 'replies' array
        commentMap[comment.reference_comment_id]?.replies.push(
          commentMap[comment.comment_id],
        );
      } else {
        // Add root comments (top-level comments)
        rootComments.push(commentMap[comment.comment_id]);
      }
    });

    return rootComments;
  };

  const renderComments = (comments: CommentWithUsernameAndReplies[]) => {
    return comments.map((comment) => (
      <div
        key={comment.comment_id}
        className="flex flex-col items-start gap-3 w-full p-4 rounded-xl bg-gray-900 shadow-md"
      >
        <p className="text-white font-medium text-lg">{comment.username}</p>
        <p className="text-gray-300 opacity-80">{comment.comment_text}</p>

        {user && (
          <button
            onClick={() => setReplyToCommentId(comment.comment_id)} // Set the replyToCommentId to show the reply input field
            className="bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-amber-600 transition-all duration-300 ease-in-out"
          >
            Reply
          </button>
        )}

        {/* Show input field for replying if this is the comment being replied to */}
        {replyToCommentId === comment.comment_id && (
          <form
            onSubmit={handleReply} // Call the handleReply function to post the reply
            className="flex flex-col items-center justify-center gap-2 w-full mt-5"
          >
            <input
              ref={inputRef}
              type="text"
              name="comment_text"
              placeholder="Write a reply..."
              className="w-full bg-stone-800 text-amber-100 p-3 rounded-lg"
              onChange={handleInputChange}
            />
            <button
              disabled={!inputs.comment_text.trim()}
              type="submit"
              className="w-full bg-amber-500 text-stone-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300"
            >
              Reply
            </button>
          </form>
        )}

        <div className="flex justify-between w-full">
          <p className="text-gray-500">
            {comment.created_at
              ? formatDate(comment.created_at.toString(), 'fi-FI')
              : 'Unknown date'}
          </p>
        </div>

        {/* Render replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-6 border-l-2 border-gray-700 mt-3">
            {renderComments(comment.replies as CommentWithUsernameAndReplies[])}
          </div>
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (item) {
      getComments();
    }
    // eslint-disable-next-line
  }, [item?.media_id]);

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
            className="w-full bg-gray-300 text-stone-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300"
          >
            Comment
          </button>
        </form>
      ) : (
        <p className="text-gray text-center mt-5">Please log in to comment</p>
      )}
      {comments.length > 0 && (
        <div className="flex flex-col items-center gap-4 mt-5 w-full">
          {renderComments(comments as CommentWithReplies[])}

        </div>
      )}
    </>
  );
};

export default Comments;
