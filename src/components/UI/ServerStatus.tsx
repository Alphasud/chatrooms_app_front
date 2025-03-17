import { useAtom } from 'jotai';
import { displayUsersListAtom } from '../../atoms/userslistAtom';
import styles from '../../styles/ServerStatus.module.css';
import { User } from '../../WebSocketProvider';
import animationStyle from '../../styles/Animation.module.css';

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
		return <span className={styles.server_down}>🔴 S3RV3R is down.</span>;
	}

	const userCount = serverUsersList.length;
	const userText = userCount < 2 ? '1' : `${userCount}`;
	const userWord = userCount < 2 ? 'user' : 'users';

	return (
		<div className={styles.server_status}>
			<span>🟢 {userText} connected</span>
			<span
				onClick={() => setDisplayUsersList(!displayUsersList)}
				className={`${styles.server_users} ${animationStyle.glow}`}
			>
				{userWord}
			</span>
		</div>
	);
};
export default ServerStatus;
