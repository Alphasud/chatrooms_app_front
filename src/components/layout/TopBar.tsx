import { User } from '../../WebSocketProvider';
import ServerStatus from '../UI/ServerStatus';
import Username from '../UI/Username';

interface TopBarProps {
	user: User;
	handleChangeUsername: (username: string) => void;
	isConnected: boolean;
	serverUsersList: User[];
}

const TopBar: React.FC<TopBarProps> = ({
	user: { username, clientId, avatar },
	isConnected,
	handleChangeUsername,
	serverUsersList,
}) => {
	return (
		<div className="topbar">
			<Username
				avatar={avatar}
				username={username}
				clientId={clientId}
				setUsername={handleChangeUsername}
				isConnected={isConnected}
			/>
			<ServerStatus
				isConnected={isConnected}
				serverUsersList={serverUsersList}
			/>
		</div>
	);
};
export default TopBar;
