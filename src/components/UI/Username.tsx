import { useState } from 'react';
import styles from '../../styles/Username.module.css';
import Modal from './Modal';

interface UsernameProps {
	username: string;
	setUsername: (username: string) => void;
	isConnected: boolean;
}

const Username: React.FC<UsernameProps> = ({
	username,
	setUsername,
	isConnected,
}) => {
	const [editUsername, setEditUsername] = useState(false);
	const [usernameEdited, setUsernameEdited] = useState(username);

	const getConnectionStatus = () => {
		if (isConnected) {
			return '🟢 Connected as ' + username;
		} else if (!isConnected) {
			return '🔴 Not Connected';
		} else {
			return '🟡 Connecting...';
		}
	};

	if (!username) return null;

	return (
		<div className={styles.username}>
			<p>{getConnectionStatus()}</p>
			<span
				className="edit_username"
				onClick={() => setEditUsername(true)}
			>
				📝
			</span>
			{editUsername && (
				<Modal
					show={editUsername}
					onClose={() => setEditUsername(false)}
				>
					<>
						<input
							type="text"
							placeholder="Enter a username"
							value={usernameEdited}
							onChange={(e) => setUsernameEdited(e.target.value)}
							autoFocus
						/>
						<button
							onClick={() => {
								setEditUsername(false);
								setUsername(usernameEdited);
							}}
						>
							Okay!
						</button>
						<button onClick={() => setEditUsername(false)}>
							Cancel
						</button>
					</>
				</Modal>
			)}
		</div>
	);
};
export default Username;
