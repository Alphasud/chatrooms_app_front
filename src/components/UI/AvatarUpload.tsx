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
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			const preview = URL.createObjectURL(file);
			setPreviewUrl(preview);
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
		<div className={styles.avatar_upload}>
			<div className={styles.avatar_bubble}>
				{user?.avatar || file ? (
					<img
						className={styles.avatar_pic}
						src={previewUrl || `${API_URL}${user?.avatar}`}
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
			<button
				className={`${styles.avatar_buttons} ${styles.upload_button}`}
				onClick={handleUpload}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					width={24}
					height={24}
					strokeWidth={2}
				>
					{' '}
					<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>{' '}
					<path d="M9 12l2 2l4 -4"></path>{' '}
				</svg>
			</button>
			<button
				className={`${styles.avatar_buttons} ${styles.delete_button}`}
				onClick={handleDelete}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					width={24}
					height={24}
					strokeWidth={2}
				>
					{' '}
					<path d="M4 7h16"></path>{' '}
					<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>{' '}
					<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>{' '}
					<path d="M10 12l4 4m0 -4l-4 4"></path>{' '}
				</svg>
			</button>
		</div>
	);
};

export default AvatarUpload;
