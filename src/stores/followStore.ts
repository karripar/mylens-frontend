import { create } from "zustand";

type FollowStore = {
  following: Set<number>;
  toggleFollow: (user_id: number) => void;
};

export const useFollowStore = create<FollowStore>((set) => ({
  following: new Set<number>(),
  toggleFollow: (user_id) =>
    set((state) => {
      const newFollowing = new Set(state.following);
      if (newFollowing.has(user_id)) {
        newFollowing.delete(user_id);
      } else {
        newFollowing.add(user_id);
      }
      return {following: newFollowing};
    }),
}));
