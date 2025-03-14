import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
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
			<div className={styles.header}>
				<h2 className={styles.title}>💬 {chatroomId}</h2>
				<button className={styles.button_leave} onClick={handleLeave}>
					❌
				</button>
			</div>
			<div className={styles.messages_container}>
				{messages.map((msg, index) => {
					const isLastInSequence =
						index === messages.length - 1 ||
						messages[index + 1].username !== msg.username;

					return (
						<div
							key={index}
							className={`${styles.message_wrapper} ${
								msg.username === username
									? styles.message_wrapper_you
									: msg.username === 'System'
									? styles.message_wrapper_system
									: styles.message_wrapper_other
							}`}
							style={{
								marginBottom: isLastInSequence
									? '1rem'
									: '0.15rem',
							}}
						>
							{/* Show avatar only if it's the last message in sequence */}
							{msg.username !== 'System' && isLastInSequence && (
								<div
									className={`${styles.message_avatar} ${
										msg.username === username
											? styles.message_avatar_you
											: styles.message_avatar_other
									}`}
								>
									{msg.username.charAt(0).toUpperCase()}
								</div>
							)}
							<div
								className={`${styles.message_bubble} ${
									msg.username === username
										? styles.message_bubble_you
										: msg.username === 'System'
										? styles.message_system
										: styles.message_bubble_other
								}`}
							>
								{msg.text}
								{msg.username !== 'System' && (
									<div className={styles.message_timestamp}>
										{msg.createdAt
											? new Date(
													msg.createdAt
											  ).toLocaleTimeString()
											: ''}
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>
			<div className={styles.controls_wrapper}>
				<div className={styles.controls}>
					<svg
						style={{ width: 'auto', height: '80%' }}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						width={24}
						height={24}
						strokeWidth={2}
					>
						{' '}
						<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>{' '}
						<path d="M4 16l16 0"></path>{' '}
						<path d="M4 12l3 -3c.928 -.893 2.072 -.893 3 0l4 4"></path>{' '}
						<path d="M13 12l2 -2c.928 -.893 2.072 -.893 3 0l2 2"></path>{' '}
						<path d="M14 7l.01 0"></path>{' '}
					</svg>
					<svg
						style={{ width: 'auto', height: '80%' }}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						width={24}
						height={24}
						strokeWidth={2}
					>
						{' '}
						<path d="M14 3v4a1 1 0 0 0 1 1h4"></path>{' '}
						<path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3"></path>{' '}
					</svg>
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
				<button
					className={styles.button_send}
					style={{ opacity: input.length > 0 ? '1' : '0' }}
					onClick={input.length > 0 ? handleSend : undefined}
				>
					<svg
						style={{ width: '100%', height: '100%' }}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						width={24}
						height={24}
						strokeWidth={2}
					>
						{' '}
						<path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z"></path>{' '}
						<path d="M6.5 12h14.5"></path>{' '}
					</svg>
				</button>
			</div>
		</div>
	);
};
export default Chat;
