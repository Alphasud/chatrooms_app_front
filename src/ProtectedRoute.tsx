import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useWebSocket } from './useWebSocket';

const ProtectedRoute = () => {
	const { chatroomId } = useParams();
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
	}, [chatroomId, navigate, socket]);

	if (loading) return <p>Loading...</p>;
	return allowed ? <Outlet /> : null;
};

export default ProtectedRoute;
