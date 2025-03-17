import axios from 'axios';
import { User } from '../WebSocketProvider';

const API_URL = 'http://192.168.1.237:3001';

export const uploadAvatar = async (
	clientId: string,
	file: File
): Promise<string | undefined> => {
	const formData = new FormData();
	formData.append('avatar', file);

	try {
		const response = await axios.patch(
			API_URL + '/user/upload-avatar?clientId=' + clientId,
			formData
		);

		if (!response.data) {
			throw new Error('File upload failed');
		}

		return response.data;
	} catch (error) {
		console.error('Error uploading file:', error);
	}
};

export const updateUsername = async (
	clientId: string,
	username: string
): Promise<void> => {
	try {
		const response = await axios.patch(
			API_URL + '/user/update-username?clientId=' + clientId,
			{
				username,
			}
		);

		if (!response.data) {
			throw new Error('Username update failed');
		}
	} catch (error) {
		console.error('Error updating username:', error);
	}
};

export const deleteAvatar = async (
	clientId: string
): Promise<string | undefined> => {
	try {
		const response = await axios.delete(
			`${API_URL}/user/delete-avatar?clientId=${clientId}`
		);

		if (!response.data.success) {
			throw new Error('Avatar deletion failed');
		}

		return response.data;
	} catch (error) {
		console.error('Error deleting avatar:', error);
	}
};

export const getUserInfo = async (
	clientId: string
): Promise<User | undefined> => {
	try {
		const response = await axios.get(
			`${API_URL}/user?clientId=${clientId}`
		);

		if (!response.data) {
			throw new Error('Failed to get user info');
		}
		return response.data;
	} catch (error) {
		console.error('Error getting user info:', error);
	}
};
