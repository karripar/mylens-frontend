import { useEffect, useState } from 'react';
import { useTags } from './apiHooks';

export const useMediaTags = (mediaId: number) => {
  const { getTagsByMediaId } = useTags();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (mediaId) {
      getTagsByMediaId(mediaId).then((tags) => {
        setTags(tags.map((tag) => tag.tag_name));
      });
    }
  }, [mediaId]);

  return tags;
};
