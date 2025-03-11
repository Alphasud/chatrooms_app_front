import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProtectedRoute from './ProtectedRoute';
import Chat from './components/Chat';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/chatroom/:chatroomId"
					element={<ProtectedRoute />}
				>
					<Route index element={<Chat />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
