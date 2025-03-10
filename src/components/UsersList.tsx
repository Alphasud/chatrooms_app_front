import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../useWebSocket';

interface UserListProps {
	username: string | null;
}

const UsersList: React.FC<UserListProps> = ({ username }) => {
	const { serverUsersList, socket } = useWebSocket();
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

	return (
		<>
			<div style={{ position: 'absolute', top: '10px', right: '10px' }}>
				{serverUsersList.length || 'No'} user
				{serverUsersList.length > 1 ? 's' : ''} on server.
			</div>
			<div style={{ position: 'absolute', top: '50px', right: '10px' }}>
				{serverUsersList.map((user, index) => (
					<div key={index}>
						<span>{user.username}: </span>
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
						{!user.chatroomId && 'in lobby.'}
					</div>
				))}
			</div>
		</>
	);
};
export default UsersList;
