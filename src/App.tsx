import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import Lobby from './components/layout/Lobby';
import ProtectedRoute from './ProtectedRoute';
import Chat from './components/layout/Chat';
import MovingGradientBackground from './components/UI/MovingGradientBackground';
import TopBar from './components/layout/TopBar';
import { useWebSocket } from './hooks/useWebSocket';
import { useAtom } from 'jotai';
import { usernameAtom } from './atoms/usernameAtom';
import { userAtom } from './atoms/userAtom';
import ActiveChatrooms from './components/layout/ActiveChatrooms';
import QRCode from './components/UI/QRCode';
import UsersList from './components/UI/UsersList';
import ServerDown from './components/layout/ServerDown';
import { useEffect } from 'react';
import { getUserInfo, updateUsername } from './httpRequests/user';
import { User } from './WebSocketProvider';

function App() {
	const { isConnected, serverUsersList, socket } = useWebSocket();
	const [username, setUsername] = useAtom(usernameAtom);
	const [user, setUser] = useAtom<User | undefined>(userAtom);
	const currentURL = window.location.href;

	const handleChangeUsername = async (newUsername: string) => {
		if (newUsername && socket?.id) {
			setUsername(newUsername);
			localStorage.setItem('usernameChatApp', newUsername);
		}
	};

	useEffect(() => {
		const fetchUpdateUsername = async () => {
			if (isConnected && socket?.id && username) {
				await updateUsername(socket?.id, username);
			}
		};
		const fetchUserInfo = async () => {
			if (isConnected && socket?.id) {
				const user = await getUserInfo(socket?.id);
				if (user) {
					setUser(user);
				}
			}
		};
		if (username) {
			fetchUpdateUsername();
		}
		fetchUserInfo();
	}, [isConnected, socket?.id, username]);

	return (
		<Router>
			<main className="main_layout">
				<MovingGradientBackground />
				{isConnected ? (
					<>
						<TopBar
							user={
								user || {
									username: '',
									chatroomId: '',
									colorScheme: [],
									bubbleColor: '',
									avatar: '',
									clientId: '',
								}
							}
							isConnected={isConnected}
							handleChangeUsername={handleChangeUsername}
							serverUsersList={serverUsersList}
						/>
						<ActiveChatrooms />
						<Routes>
							<Route path="/" element={<Lobby />} />
							<Route
								path="/chatroom/:chatroomId"
								element={<ProtectedRoute />}
							>
								<Route index element={<Chat />} />
							</Route>
						</Routes>
						<UsersList
							username={username}
							serverUsersList={serverUsersList}
							isConnected={isConnected}
						/>
						<QRCode currentURL={currentURL} />
					</>
				) : (
					<Routes>
						<Route path="/" element={<ServerDown />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				)}
			</main>
		</Router>
	);
}

export default App;
