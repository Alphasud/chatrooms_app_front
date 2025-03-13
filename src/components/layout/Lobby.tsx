import { useAtom } from 'jotai';
import { usernameAtom } from '../../atoms/usernameAtom';
import styles from '../../styles/Lobby.module.css';

const Lobby: React.FC = () => {
	const [username] = useAtom(usernameAtom);

	return (
		<>
			<div className="lobby">
				<h2 className={styles.welcome_title}>Lobby 🌞</h2>
				<>
					<h2>Welcome to Chat app {username}!</h2>
				</>
			</div>
		</>
	);
};

export default Lobby;
