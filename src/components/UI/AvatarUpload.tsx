import React, { useRef, useState } from 'react';
import styles from '../../styles/AvatarUpload.module.css';
import { deleteAvatar, uploadAvatar } from '../../httpRequests/user';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAtom } from 'jotai';
import { User } from '../../WebSocketProvider';
import { userAtom } from '../../atoms/userAtom';

const MAX_FILE_SIZE = 1024 * 1024; // 1mb
const API_URL = 'http://192.168.1.237:3001';

interface AvatarUploadProps {
	clientId: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ clientId }) => {
	const [file, setFile] = useState<File | null>(null);
	const { socket } = useWebSocket();
	const [user, setUser] = useAtom<User | undefined>(userAtom);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			alert('No file selected');
			return;
		}
		// limit size to 1mb
		if (file.size > MAX_FILE_SIZE) {
			alert('File size must be less than 1mb');
			return;
		}

		const avatarUrl = await uploadAvatar(clientId, file);
		if (avatarUrl) {
			if (user) {
				setUser({ ...user, avatar: avatarUrl });
			}
			alert('Avatar uploaded successfully');
		} else {
			alert('Error uploading avatar');
		}
	};

	const handleDelete = async () => {
		if (!socket?.id) return;
		const response = await deleteAvatar(socket?.id);
		if (response) {
			alert('Avatar deleted successfully');
		} else {
			alert('Error deleting avatar');
		}
	};

	return (
		<div>
			<div className={styles.avatar_bubble}>
				{user?.avatar ? (
					<img
						className={styles.avatar}
						src={`${API_URL}${user.avatar}`}
						alt="avatar"
						onClick={() => fileInputRef.current?.click()}
					/>
				) : (
					<p onClick={() => fileInputRef.current?.click()}>
						{user?.username.charAt(0).toUpperCase()}
					</p>
				)}
			</div>
			<input
				className={styles.file_input}
				ref={fileInputRef}
				type="file"
				accept="image/png, image/jpeg, image/jpg"
				onChange={handleFileChange}
			/>
			<button className={styles.upload_button} onClick={handleUpload}>
				Upload Avatar
			</button>
			<button className={styles.delete_button} onClick={handleDelete}>
				Delete Avatar
			</button>
		</div>
	);
};

export default AvatarUpload;
