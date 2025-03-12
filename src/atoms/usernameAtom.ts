import { atom } from 'jotai';

export const usernameAtom = atom<string>(
	localStorage.getItem('usernameChatApp') || ''
);
