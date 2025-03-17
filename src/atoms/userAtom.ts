import { atom } from 'jotai';
import { User } from '../WebSocketProvider';

export const userAtom = atom<User | undefined>({
	username: '',
	chatroomId: '',
	colorScheme: [],
	bubbleColor: '',
	avatar: '',
	clientId: '',
});
