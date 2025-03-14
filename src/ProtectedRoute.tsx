import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import { useAtom } from 'jotai';
import { usernameAtom } from './atoms/usernameAtom';

const ProtectedRoute = () => {
	const { chatroomId } = useParams();
	const [username] = useAtom(usernameAtom);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [allowed, setAllowed] = useState(false);
	const { socket } = useWebSocket();

	useEffect(() => {
		const checkChatroom = () => {
			socket?.emit('doesChatroomExist', chatroomId);

			socket?.once('chatroomExists', (exists: boolean) => {
				if (exists) {
					setAllowed(true);
					// Call the joinChatroom event
					socket?.emit('joinChatroom', { chatroomId, username });
				} else {
					navigate('/'); // Redirect to home if chatroom doesn't exist
				}
				setLoading(false);
			});
		};

		checkChatroom();

		return () => {
			socket?.off('chatroomExists');
		};
	}, [chatroomId, navigate, socket, username]);

	if (loading) return <p>Loading...</p>;
	return allowed ? <Outlet /> : null;
};

export default ProtectedRoute;
