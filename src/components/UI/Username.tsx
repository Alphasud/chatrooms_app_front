import { useState } from 'react';
import styles from '../../styles/Username.module.css';
import Modal from './Modal';
import animationStyle from '../../styles/Animation.module.css';
import AvatarUpload from './AvatarUpload';
import styleAvatar from '../../styles/AvatarUpload.module.css';

const API_URL = 'http://192.168.1.237:3001';

interface UsernameProps {
	username: string;
	setUsername: (username: string) => void;
	isConnected: boolean;
	clientId: string;
	avatar: string;
}

const Username: React.FC<UsernameProps> = ({
	username,
	setUsername,
	isConnected,
	clientId,
	avatar,
}) => {
	const [editUsername, setEditUsername] = useState(false);
	const [usernameEdited, setUsernameEdited] = useState(username);

	const getConnectionStatus = () => {
		if (isConnected) {
			return (
				<>
					{avatar ? (
						<div className={styleAvatar.avatar_bubble}>
							<img
								className={styleAvatar.avatar_pic}
								src={API_URL + avatar}
								alt="Avatar"
							/>
						</div>
					) : (
						<div
							className={`${styleAvatar.avatar_bubble} ${styleAvatar.background_color}`}
						>
							<p>{username.charAt(0)}</p>
						</div>
					)}
					<p>{username}</p>
				</>
			);
		} else if (!isConnected) {
			return <p>🔴 Not Connected</p>;
		} else {
			return <p>🟡 Connecting...</p>;
		}
	};

	if (!username) return null;

	return (
		<div className={`${styles.username}`}>
			{getConnectionStatus()}
			<span
				className={`${styles.edit_username} ${animationStyle.glow}`}
				onClick={() => setEditUsername(true)}
			>
				(edit)
			</span>
			{editUsername && (
				<Modal
					show={editUsername}
					onClose={() => setEditUsername(false)}
				>
					<AvatarUpload clientId={clientId} />
					<input
						className={styles.edit_input}
						type="text"
						placeholder="Enter a username"
						value={usernameEdited}
						onChange={(e) => setUsernameEdited(e.target.value)}
						autoFocus
					/>
					<div className={styles.buttons}>
						<button
							className={`${styles.button} ${styles.button__okay}`}
							onClick={() => {
								setEditUsername(false);
								setUsername(usernameEdited);
							}}
						>
							Okay!
						</button>
						<button
							className={`${styles.button} ${styles.button__cancel}`}
							onClick={() => setEditUsername(false)}
						>
							Cancel
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
};
export default Username;
