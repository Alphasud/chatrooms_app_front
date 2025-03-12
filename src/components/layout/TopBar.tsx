import { User } from '../../WebSocketProvider';
import ServerStatus from '../UI/ServerStatus';
import Username from '../UI/Username';

interface TopBarProps {
	username: string;
	handleChangeUsername: (username: string) => void;
	isConnected: boolean;
	serverUsersList: User[];
}

const TopBar: React.FC<TopBarProps> = ({
	username,
	isConnected,
	handleChangeUsername,
	serverUsersList,
}) => {
	return (
		<div className="topbar">
			<Username
				username={username}
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
