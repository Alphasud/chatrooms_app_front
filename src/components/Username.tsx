import { useState } from 'react';

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
			return '✅ Connected as ' + username;
		} else if (!isConnected) {
			return '❌ Not Connected';
		} else {
			return '🟡 Connecting...';
		}
	};

	if (!username) return null;

	return (
		<div style={{ position: 'absolute', top: '10px', left: '10px' }}>
			<p style={{ margin: 0 }}>{getConnectionStatus()}</p>
			<p style={{ margin: 0 }}>
				<button onClick={() => setEditUsername(!editUsername)}>
					{editUsername ? 'Cancel' : 'Edit'}
				</button>
			</p>
			{editUsername && (
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
				</>
			)}
		</div>
	);
};
export default Username;
