import { create } from 'zustand';

interface UserState {
	user: {
		id: string;
		email: string;
		name: string;
		img?: string | null;
		role?: string | null;
	} | null;
	setUser: (
		user: {
			id: string;
			email: string;
			name: string;
			img?: string | null;
			role?: string | null;
		} | null
	) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	isLoading: false,
}));
