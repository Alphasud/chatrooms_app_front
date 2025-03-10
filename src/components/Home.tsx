import { useEffect, useState } from 'react';
import { useWebSocket } from '../useWebSocket';
import Username from './Username';
import { useNavigate } from 'react-router-dom';
import UsersList from './UsersList';
import QRCode from './QRCode';

const Home: React.FC = () => {
	const [username, setUsername] = useState('');
	const [chatroomId, setChatroomId] = useState('');
	const { socket, welcomeMessage, isConnected } = useWebSocket();
	const navigate = useNavigate();
	const currentURL = window.location.href;

	useEffect(() => {
		const savedUsername = localStorage.getItem('usernameChatApp');
		if (savedUsername) {
			setUsername(savedUsername);
		} else {
			setUsername(Math.random().toString(36).substring(2, 15));
			localStorage.setItem('usernameChatApp', username);
		}
		socket?.emit('updateUsernameInUsersList', {
			newUsername: username,
		});
	}, [username, socket]);

	const handleChangeUsername = (newUsername: string) => {
		localStorage.setItem('usernameChatApp', newUsername);
		setUsername(newUsername);
		socket?.emit('updateUsernameInUsersList', {
			newUsername: newUsername,
		});
	};

	// Handle joining a chatroom
	const handleJoin = () => {
		if (username.trim() && chatroomId.trim()) {
			socket?.emit(
				'joinChatroom',
				{ chatroomId, username },
				(response: { error?: string }) => {
					if (response?.error) {
						alert(response.error);
					} else {
						navigate(`/chatroom/${chatroomId}`);
					}
				}
			);
		}
	};

	// Handle creating a chatroom
	const handleCreate = () => {
		if (username.trim() && chatroomId.trim()) {
			socket?.emit(
				'createChatroom',
				{ chatroomId, username },
				(response: { error?: string }) => {
					if (response?.error) {
						alert(response.error);
					} else {
						navigate(`/chatroom/${chatroomId}`);
					}
				}
			);
		} else {
			alert('Please enter chatroom ID before creating a chatroom.');
		}
	};

	return (
		<>
			<Username
				username={username}
				setUsername={handleChangeUsername}
				isConnected={isConnected}
			/>
			<UsersList username={username} />
			<div style={{ textAlign: 'center', padding: '20px' }}>
				<>
					<h2>{welcomeMessage}</h2>
					<input
						type="text"
						placeholder="Enter a chatroom ID"
						value={chatroomId}
						onChange={(e) => setChatroomId(e.target.value)}
					/>
					<br />
					<br />
					<button
						onClick={handleJoin}
						style={{ marginRight: '10px' }}
					>
						Join Chat
					</button>
					<button onClick={handleCreate}>Create Chat</button>
				</>
			</div>
			<QRCode currentURL={currentURL} />
		</>
	);
};

export default Home;
