import { useWebSocket } from '../../hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { usernameAtom } from '../../atoms/usernameAtom';
import { useEffect, useState } from 'react';
import styles from '../../styles/Chat.module.css';
import ActiveChatCard from '../UI/ActiveChatCard';
import { Chatroom } from '../../WebSocketProvider';

const ActiveChatrooms = () => {
	const [username] = useAtom(usernameAtom);
	const [chatroomId, setChatroomId] = useState('');
	const { socket, chatroomsList } = useWebSocket();
	const navigate = useNavigate();
	const [chatroomsListFiltered, setChatroomsListFiltered] = useState(
		[] as Chatroom[]
	);

	useEffect(() => {
		socket?.emit('getChatroomsList');
	}, [socket]);

	// call chatrooms list every minute to keep it updated
	useEffect(() => {
		const intervalId = setInterval(() => {
			socket?.emit('getChatroomsList');
		}, 60000);

		return () => clearInterval(intervalId);
	}, [socket]);

	useEffect(() => {
		setChatroomsListFiltered(chatroomsList);
	}, [chatroomsList]);

	// Handle joining a chatroom
	const handleJoin = (chatroomId: string) => {
		if (username.trim() && chatroomId.trim()) {
			navigate(`/chatroom/${chatroomId}`);
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

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			setChatroomsListFiltered(chatroomsList);
			setChatroomId('');
			return;
		}
		setChatroomId(e.target.value);
		setChatroomsListFiltered(
			chatroomsList.filter((chatroom) =>
				chatroom.chatroomId.includes(e.target.value)
			)
		);
	};

	return (
		<>
			<div className="active_chatrooms">
				<h2 className={styles.welcome_title}>Active Chatrooms:</h2>
				<div className={styles.chatrooms}>
					<div className={styles.create_chatroom}>
						<input
							className={styles.input}
							type="text"
							placeholder="Search for a chatroom"
							value={chatroomId}
							onChange={(e) => handleSearch(e)}
						/>
						<button
							className={styles.button_create}
							onClick={handleCreate}
						>
							Create Chat
						</button>
					</div>
					{chatroomsListFiltered && (
						<div className={styles.chatrooms_list}>
							{chatroomsListFiltered.map((chatroom) => (
								<ActiveChatCard
									key={chatroom.chatroomId}
									chatroom={chatroom}
									handleJoin={handleJoin}
								/>
							))}
						</div>
					)}
					{!chatroomsListFiltered.length && (
						<div className={styles.no_match}>
							No matching chatrooms
						</div>
					)}
				</div>
			</div>
		</>
	);
};
export default ActiveChatrooms;
