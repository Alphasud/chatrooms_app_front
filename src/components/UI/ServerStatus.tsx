import { useAtom } from 'jotai';
import { displayUsersListAtom } from '../../atoms/userslistAtom';
import styles from '../../styles/ServerStatus.module.css';
import { User } from '../../WebSocketProvider';

interface ServerStatusProps {
	isConnected: boolean;
	serverUsersList: User[];
}

const ServerStatus: React.FC<ServerStatusProps> = ({
	isConnected,
	serverUsersList,
}) => {
	const [displayUsersList, setDisplayUsersList] =
		useAtom(displayUsersListAtom);

	if (!isConnected) {
		return <span>🔴 Server is down.</span>;
	}

	const userCount = serverUsersList.length;
	const userText = userCount < 2 ? 'one' : `${userCount}`;
	const userWord = userCount < 2 ? 'user' : 'users';

	return (
		<span>
			🟢 Server is on with {userText}{' '}
			<span
				onClick={() => setDisplayUsersList(!displayUsersList)}
				className={styles.server_status}
			>
				{userWord}
			</span>
		</span>
	);
};
export default ServerStatus;
