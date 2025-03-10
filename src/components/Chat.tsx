import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Username from './Username';
import { useWebSocket } from '../useWebSocket';
import UsersList from './UsersList';
import QRCode from './QRCode';

const Chat: React.FC = () => {
	const { socket, messages, sendMessage, welcomeMessage } = useWebSocket();
	const [input, setInput] = useState('');
	const { chatroomId } = useParams();
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const currentURL = window.location.href;

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Use effect to scroll to the bottom whenever messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		// get username from local storage
		const usernameStored = localStorage.getItem('usernameChatApp');
		if (!usernameStored) {
			// if no username, redirect to home
			navigate('/');
		} else {
			setUsername(usernameStored);
		}
	}, [navigate]);

	const handleSend = () => {
		if (input.trim() && chatroomId) {
			sendMessage({ chatroomId, username: username, text: input });
			setInput('');
		}
	};

	const handleLeave = () => {
		socket?.emit(
			'leaveChatroom',
			{ chatroomId, username },
			(response: { error?: string }) => {
				if (response?.error) {
					alert(response.error);
				} else {
					navigate('/');
				}
			}
		);
	};

	return (
		<>
			<Username
				username={username}
				setUsername={setUsername}
				isConnected={true}
			/>
			<UsersList username={username} />
			<div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
				<h2>💬 Chatroom {chatroomId}</h2>
				<button onClick={handleLeave}>Leave ❌</button>
				<div
					style={{
						border: '1px solid black',
						height: '200px',
						overflowY: 'auto',
						padding: '10px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{welcomeMessage && <div>{welcomeMessage}</div>}

					{messages.length === 0 && <div>No messages yet</div>}
					{messages.map((msg, index) => (
						<div
							key={index}
							style={{
								alignSelf:
									msg.username === username
										? 'flex-end'
										: 'flex-start',
							}}
						>
							<strong>
								{msg.username === username
									? 'You'
									: msg.username}
								:{' '}
							</strong>
							{msg.text}
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					style={{ width: '80%' }}
				/>
				<button onClick={handleSend}>Send</button>
			</div>
			<QRCode currentURL={currentURL} />
		</>
	);
};
export default Chat;
