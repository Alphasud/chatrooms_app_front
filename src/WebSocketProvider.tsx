import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketContext } from './WebSocketContext';
import { useAtom } from 'jotai';
import { usernameAtom } from './atoms/usernameAtom';

const SOCKET_URL = 'http://localhost:3002';

export interface Message {
	chatroomId: string;
	username: string;
	text: string;
	createdAt?: Date;
	updatedAt?: Date;
	id?: string;
}

export interface Chatroom {
	chatroomId: string;
	users: string[];
	lastActiveAt: Date;
}

export interface User {
	username: string;
	chatroomId: string;
}

// WebSocket Provider component
interface WebSocketProviderProps {
	children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const socketRef = useRef<Socket | null>(null);
	const [username, setUsername] = useAtom(usernameAtom);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [serverUsersList, setServerUsersList] = useState<User[]>([]);
	const [chatroomUsersList, setChatroomUsersList] = useState<User[]>([]);
	const [chatroomsList, setChatroomsList] = useState<Chatroom[]>([]);

	useEffect(() => {
		const newSocket = io(SOCKET_URL, { transports: ['websocket'] });
		socketRef.current = newSocket; // Store in ref

		const handleConnected = () => {
			setIsConnected(true);
			if (!username) {
				const generatedUsername =
					newSocket.id?.substring(2, 15) ||
					Math.random().toString(36).substring(2, 15);
				setUsername(generatedUsername);
				localStorage.setItem('usernameChatApp', generatedUsername);
			}
		};

		// Register event listeners
		newSocket.on('connected', handleConnected);
		newSocket.on('usersList', setServerUsersList);
		newSocket.on('chatroomsUsersList', setChatroomUsersList);
		newSocket.on('chatroomsList', setChatroomsList);
		newSocket.on('previousMessages', setMessages);
		newSocket.on('receiveMessage', (msg: Message) => {
			setMessages((prev) => [...prev, msg]);
		});
		newSocket.on('disconnect', () => setIsConnected(false));

		return () => {
			newSocket.off('connected', handleConnected);
			newSocket.off('usersList', setServerUsersList);
			newSocket.off('chatroomsUsersList', setChatroomUsersList);
			newSocket.off('chatroomsList', setChatroomsList);
			newSocket.off('previousMessages', setMessages);
			newSocket.off('receiveMessage');
			newSocket.off('disconnect');
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (username && socketRef.current) {
			socketRef.current.emit('updateUsernameInUsersList', {
				newUsername: username,
			});
		}
	}, [username]);

	const sendMessage = ({ chatroomId, username, text }: Message) => {
		socketRef.current?.emit('sendMessage', {
			chatroomId,
			username,
			text,
			createdAt: new Date(),
		});
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket: socketRef.current,
				messages,
				isConnected,
				serverUsersList,
				chatroomUsersList,
				sendMessage,
				chatroomsList,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};
