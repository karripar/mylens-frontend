import {Comment, Follow, MediaResponse, Tag} from 'hybrid-types/DBTypes';
import {
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/functions';
import {Credentials, RegisterCredentials} from '../types/localTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';

const useMedia = (token?: string, username?: string) => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    const getMedia = async () => {
      // fetch media items from the API. if token is provided -> fetch only media items that belong to the user
      try {
        // kaikki mediat ilman omistajan tietoja
        console.log(token);
        console.log(username);
        let url;
        if (typeof token === 'string' && token.length > 0) {
          url = `${import.meta.env.VITE_MEDIA_API}/media/bytoken`;
        } else if (username) {
          url = `${import.meta.env.VITE_MEDIA_API}/media/byusername/${username}`;
        } else {
          url = `${import.meta.env.VITE_MEDIA_API}/media`;
        }

        const options = {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        };
        const media = await fetchData<MediaItem[]>(url, options);
        // haetaan omistajat id:n perusteella
        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          media.map(async (item) => {
            const owner = await fetchData<UserWithNoPassword>(
              import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
              options,
            );

            const mediaItem: MediaItemWithOwner = {
              ...item,
              username: owner.username,
            };
            return mediaItem;
          }),
        );

        console.log(mediaWithOwner);

        setMediaArray(mediaWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postMedia = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const media: Omit<
      MediaItem,
      | 'media_id'
      | 'user_id'
      | 'thumbnail'
      | 'created_at'
      | 'screenshots'
      | 'coordinates_id'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      media_type: file.data.media_type,
      filesize: file.data.filesize,
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(media),
    };
    return await fetchData<MediaResponse>(
      import.meta.env.VITE_MEDIA_API + '/media',
      options,
    );
  };

  const getMediaByTagName = async (tag: string) => {
    try {
      const response = await fetchData<MediaItem[]>(
        import.meta.env.VITE_MEDIA_API + '/media/bytagname/' + tag,
      );
      const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
        response.map(async (item) => {
          const owner = await fetchData<UserWithNoPassword>(
            import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
          );

          const mediaItem: MediaItemWithOwner = {
            ...item,
            username: owner.username,
          };
          return mediaItem;
        }),
      );
      return mediaWithOwner;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {mediaArray, postMedia, getMediaByTagName};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      import.meta.env.VITE_UPLOAD_API + '/upload',
      options,
    );
  };

  return {postFile};
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      const response = await fetchData<LoginResponse>(
        import.meta.env.VITE_AUTH_API + '/auth/login',
        options,
      );

      if (!response.token) {
        throw new Error('Login failed');
      }

      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const getUser = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + '/users/token',
        options,
      );
      console.log(response);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_AUTH_API + '/users',
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUsernameAvailable = async (username: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        import.meta.env.VITE_AUTH_API + '/users/username/' + username,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getEmailAvailable = async (email: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        import.meta.env.VITE_AUTH_API + '/users/email/' + email,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUserByUserId = async (user_id: number) => {
    try {
      const response = await fetchData<UserWithNoPassword>(
        import.meta.env.VITE_AUTH_API + '/users/' + user_id,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const putUserBioAndUsername = async (
    info: {username: string; bio: string},
    token: string,
  ) => {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };

    try {
      const response = await fetchData<UserWithNoPassword>(
        import.meta.env.VITE_AUTH_API + '/users/profileinfo',
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    getUser,
    postRegister,
    getUsernameAvailable,
    getEmailAvailable,
    getUserByUserId,
    putUserBioAndUsername,
  };
};

const useComment = () => {
  const {getUserByUserId} = useUser();

  const postComment = async (
    comment_text: string,
    media_id: number,
    reference_comment_id: number | null,
    token: string,
  ) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({comment_text, media_id, reference_comment_id}),
      };
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/comments',
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getCommentsByMediaId = async (media_id: number) => {
    try {
      const response = await fetchData<Comment[]>(
        import.meta.env.VITE_MEDIA_API + '/comments/bymedia/' + media_id,
      );
      const commentsWithOwner = await Promise.all(
        response.map(async (comment) => {
          const owner = await getUserByUserId(comment.user_id);
          return {...comment, username: owner.username};
        }),
      );
      return commentsWithOwner;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postComment, getCommentsByMediaId};
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({media_id}),
      };
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/likes',
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const removeLike = (like_id: number, token: string) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      return fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/likes/' + like_id,
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getCountByMediaId = async (media_id: number) => {
    try {
      const response = await fetchData<Like[]>(
        import.meta.env.VITE_MEDIA_API + '/likes/bymedia/' + media_id,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUserLike = async (media_id: number, token: string) => {
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const response = await fetchData<Like>(
        import.meta.env.VITE_MEDIA_API + '/likes/bymedia/user/' + media_id,
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postLike, removeLike, getCountByMediaId, getUserLike};
};

const useTags = () => {
  const getTags = async () => {
    try {
      const response = await fetchData<Tag[]>(
        import.meta.env.VITE_MEDIA_API + '/tags',
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getTagsByMediaId = async (media_id: number) => {
    try {
      const response = await fetchData<Tag[]>(
        import.meta.env.VITE_MEDIA_API + '/tags/bymedia/' + media_id,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postTags = async (tags: string[], media_id: number, token: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags, media_id}),
      };
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/tags',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {getTags, getTagsByMediaId, postTags};
};

const useFollow = () => {
  const [followArray, setFollowArray] = useState<Follow[]>([]);

  const postFollow = async (user_id: number, token: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id}),
      };
      return await fetchData<Follow>(
        import.meta.env.VITE_MEDIA_API + '/follows',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const removeFollow = async (follow_id: number, token: string) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/follows/' + follow_id,
        options,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getFollowedUsers = async (token?: string, username?: string) => {
    let url;
    if (username) {
      url = `${import.meta.env.VITE_MEDIA_API}/follows/byusername/followed/${username}`;
    } else {
      url = `${import.meta.env.VITE_MEDIA_API}/follows/bytoken/followed`;
    }

    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token || '',
        },
      };
      const response = await fetchData<Follow[]>(url, options);
      setFollowArray(response);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getFollowers = async (token?: string, username?: string) => {
    let url;
    if (username) {
      url = `${import.meta.env.VITE_MEDIA_API}/follows/byusername/followers/${username}`;
    } else {
      url = `${import.meta.env.VITE_MEDIA_API}/follows/bytoken/followers`;
    }

    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token || '',
        },
      };
      const response = await fetchData<Follow[]>(url, options);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    followArray,
    postFollow,
    removeFollow,
    getFollowedUsers,
    getFollowers,
  };
};

export {
  useMedia,
  useFile,
  useAuthentication,
  useUser,
  useComment,
  useLike,
  useFollow,
  useTags,
};
