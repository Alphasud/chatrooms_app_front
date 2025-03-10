import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { Message } from './WebSocketProvider';

interface WebSocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	messages: Message[];
	welcomeMessage: string;
	serverUsersList: [
		{
			username: string;
			chatroomId: string;
		}
	];
	chatroomUsersList: [
		{
			username: string;
			chatroomId: string;
		}
	];
	sendMessage: (message: Message) => void;
}

// Create the WebSocket context with a default value
export const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);
