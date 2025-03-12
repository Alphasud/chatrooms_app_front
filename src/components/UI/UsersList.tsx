import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../useWebSocket';
import styles from '../../styles/UsersList.module.css';
import { useAtom } from 'jotai';
import { displayUsersListAtom } from '../../atoms/userslistAtom';

interface UserListProps {
	username: string | null;
	isConnected: boolean;
}

const UsersList: React.FC<UserListProps> = ({ username, isConnected }) => {
	const { serverUsersList, socket } = useWebSocket();
	const [displayUsersList] = useAtom(displayUsersListAtom);
	const navigate = useNavigate();

	const isUserCurrentInChatroom = (chatroomId: string): boolean => {
		if (!chatroomId) return false;
		const user = serverUsersList.find((user) => user.username === username);
		return user?.chatroomId === chatroomId;
	};

	// Handle joining a chatroom
	const handleJoinChatroom = (chatroomId: string, username: string) => {
		if (!socket || isUserCurrentInChatroom(chatroomId)) return;
		if (username.trim() && chatroomId.trim()) {
			navigate(`/chatroom/${chatroomId}`);
		}
	};

	return (
		<div className="users_list">
			{isConnected && (
				<div
					className={styles.list}
					style={{ display: displayUsersList ? 'flex' : 'none' }}
				>
					{serverUsersList.map((user, index) => (
						<div key={index}>
							<span>{user.username} → </span>
							{user.chatroomId && (
								<span
									style={{
										color: 'blue',
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
									in {user.chatroomId}.
								</span>
							)}
							{!user.chatroomId && (
								<span className={styles.lobby}>in lobby.</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
export default UsersList;
