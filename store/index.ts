import { create } from "zustand";

type Store = {
  loading: boolean;
  setLoading: () => void;
};

export const useStore = create<Store>()((set) => ({
  loading: false,
  setLoading: () =>
    set((state) => ({ loading: (state.loading = !state.loading) })),
}));
