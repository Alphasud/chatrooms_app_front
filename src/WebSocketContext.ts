import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { Chatroom, Message, User } from './WebSocketProvider';

interface WebSocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	messages: Message[];
	serverUsersList: User[];
	chatroomUsersList: User[];
	sendMessage: (message: Message) => void;
	chatroomsList: Chatroom[];
}

// Create the WebSocket context with a default value
export const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);
