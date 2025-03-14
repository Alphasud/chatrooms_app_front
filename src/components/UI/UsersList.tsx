import { useNavigate } from 'react-router-dom';
import styles from '../../styles/UsersList.module.css';
import animationStyle from '../../styles/Animation.module.css';
import { useAtom } from 'jotai';
import { displayUsersListAtom } from '../../atoms/userslistAtom';
import { useEffect, useState } from 'react';
import { User } from '../../WebSocketProvider';

interface UserListProps {
	username: string | null;
	isConnected: boolean;
	serverUsersList: User[];
}

const UsersList: React.FC<UserListProps> = ({
	username,
	isConnected,
	serverUsersList,
}) => {
	const [displayUsersList] = useAtom(displayUsersListAtom);
	const [currentColorIndex, setCurrentColorIndex] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentColorIndex((prevIndex) => (prevIndex + 1) % 10);
		}, 100);

		return () => clearInterval(intervalId);
	}, []);

	const isUserCurrentInChatroom = (chatroomId: string): boolean => {
		if (!chatroomId) return false;
		const user = serverUsersList.find((user) => user.username === username);
		return user?.chatroomId === chatroomId;
	};

	// Handle joining a chatroom
	const handleJoinChatroom = (chatroomId: string, username: string) => {
		if (isUserCurrentInChatroom(chatroomId)) return;
		if (username.trim() && chatroomId.trim()) {
			navigate(`/chatroom/${chatroomId}`);
		}
	};

	return (
		<div className="users_list">
			{isConnected && (
				<div
					className={styles.list_container}
					style={{ display: displayUsersList ? 'flex' : 'none' }}
				>
					<div className={styles.list_title}>Online right now:</div>
					<div className={styles.list}>
						{serverUsersList.map((user, index) => {
							return (
								<div
									className={styles.list_element}
									key={index}
								>
									<span
										className={`${styles.list_username} ${animationStyle.glow}`}
									>
										{user.username}
									</span>
									<svg
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
										<path d="M17 14h4v-4"></path>{' '}
										<path d="M3 12c.887 1.284 2.48 2.033 4 2c1.52 .033 3.113 -.716 4 -2s2.48 -2.033 4 -2c1.52 -.033 3 1 4 2l2 2"></path>{' '}
									</svg>
									{user.chatroomId && (
										<span
											className={styles.chatroom_link}
											style={{
												backgroundColor:
													user.colorScheme[
														currentColorIndex
													],
												cursor: isUserCurrentInChatroom(
													user.chatroomId
												)
													? 'default'
													: 'pointer',
											}}
											onClick={() =>
												handleJoinChatroom(
													user.chatroomId,
													username || ''
												)
											}
										>
											in {user.chatroomId}{' '}
										</span>
									)}
									{!user.chatroomId && (
										<span className={styles.lobby}>
											in lobby.
										</span>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
export default UsersList;
