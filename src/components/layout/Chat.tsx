import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../useWebSocket';
import styles from '../../styles/Chat.module.css';

const Chat: React.FC = () => {
	const { socket, messages, sendMessage } = useWebSocket();
	const [input, setInput] = useState('');
	const { chatroomId } = useParams();
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
		<div className="chatroom">
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
				<div>Welcome</div>

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
							{msg.username === username ? 'You' : msg.username}:{' '}
						</strong>
						{msg.text}
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<input
				className={styles.input}
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				style={{ width: '80%' }}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleSend();
					}
				}}
			/>
			<button onClick={handleSend}>Send</button>
		</div>
	);
};
export default Chat;
