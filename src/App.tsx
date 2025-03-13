import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/layout/Lobby';
import ProtectedRoute from './ProtectedRoute';
import Chat from './components/layout/Chat';
import MovingGradientBackground from './components/UI/MovingGradientBackground';
import TopBar from './components/layout/TopBar';
import { useWebSocket } from './useWebSocket';
import { useAtom } from 'jotai';
import { usernameAtom } from './atoms/usernameAtom';
import ActiveChatrooms from './components/layout/ActiveChatrooms';
import QRCode from './components/UI/QRCode';
import UsersList from './components/UI/UsersList';

function App() {
	const { isConnected, serverUsersList } = useWebSocket();
	const [username, setUsername] = useAtom(usernameAtom);
	const currentURL = window.location.href;

	const handleChangeUsername = (newUsername: string) => {
		localStorage.setItem('usernameChatApp', newUsername);
		setUsername(newUsername);
	};
	return (
		<Router>
			<main className="main_layout">
				<MovingGradientBackground />
				<TopBar
					username={username}
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
				<UsersList username={username} isConnected={isConnected} />
				<QRCode currentURL={currentURL} />
			</main>
		</Router>
	);
}

export default App;
