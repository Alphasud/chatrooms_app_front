import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketContext } from './WebSocketContext';

const SOCKET_URL = 'http://localhost:3002'; // Change if needed

export interface Message {
	chatroomId: string;
	username: string;
	text: string;
	createdAt?: Date;
	updatedAt?: Date;
	id?: string;
}

// WebSocket Provider component
interface WebSocketProviderProps {
	children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [welcomeMessage, setWelcomeMessage] = useState<string>('');
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [serverUsersList, setServerUsersList] = useState<
		[
			{
				username: string;
				chatroomId: string;
			}
		]
	>([{ username: '', chatroomId: '' }]);
	const [chatroomUsersList, setChatroomUsersList] = useState<
		[
			{
				username: string;
				chatroomId: string;
			}
		]
	>([{ username: '', chatroomId: '' }]);

	useEffect(() => {
		// Create the socket connection once when the provider mounts
		const newSocket = io(SOCKET_URL, { transports: ['websocket'] });

		newSocket.on('connect', () => {
			setIsConnected(true);
		});

		newSocket.on('welcome', (msg) => {
			setWelcomeMessage(msg);
		});

		newSocket.on(
			'usersList',
			(
				usr: [
					{
						username: string;
						chatroomId: string;
					}
				]
			) => {
				console.log('usersList', usr);
				setServerUsersList(usr); // Update the total users count
			}
		);

		newSocket.on(
			'chatroomsUsersList',
			(
				usr: [
					{
						username: string;
						chatroomId: string;
					}
				]
			) => {
				setChatroomUsersList(usr); // Update the total users count
			}
		);

		// Listen for "previousMessages" in case you want to load past messages when joining a chatroom
		newSocket.on('previousMessages', (messages: Message[]) => {
			setMessages(messages); // Overwrite the messages with the previous ones
		});

		newSocket.on('receiveMessage', (msg: Message) => {
			setMessages((prev) => [...prev, msg]);
		});

		newSocket.on('disconnect', () => {
			setIsConnected(false);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	const sendMessage = ({ chatroomId, username, text }: Message) => {
		if (socket) {
			socket.emit('sendMessage', {
				chatroomId,
				username,
				text,
				createdAt: new Date(),
			});
		}
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket,
				messages,
				welcomeMessage,
				isConnected,
				serverUsersList,
				chatroomUsersList,
				sendMessage,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};
