import { Chatroom } from '../../WebSocketProvider';
import styles from '../../styles/Chat.module.css';

interface ActiveChatCardProps {
	chatroom: Chatroom;
	handleJoin: (chatroomId: string) => void;
}

const getLastTimeActive = (lastActiveAt: Date | string): string => {
	const lastActive = new Date(lastActiveAt); // Ensure it's a Date object
	const now = new Date(); // Current time in local timezone

	const diff = now.getTime() - lastActive.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30); // More accurate than dividing weeks by 4
	const years = Math.floor(days / 365); // More accurate than months / 12

	if (years >= 1) return `${years} year${years > 1 ? 's' : ''} ago`;
	if (months >= 1) return `${months} month${months > 1 ? 's' : ''} ago`;
	if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`;
	if (hours >= 1) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
	if (minutes >= 1) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;

	return 'Just now';
};

const ActiveChatCard: React.FC<ActiveChatCardProps> = ({
	chatroom,
	handleJoin,
}) => {
	return (
		<div
			key={chatroom.chatroomId}
			className={styles.chatroom_element}
			onClick={() => {
				handleJoin(chatroom.chatroomId);
			}}
		>
			<div className={styles.chatroom_id}>{chatroom.chatroomId}</div>
			<div className={styles.last_active}>
				<div>{chatroom.users.length} users</div>
				<div>Active: {getLastTimeActive(chatroom.lastActiveAt)}</div>
			</div>
		</div>
	);
};
export default ActiveChatCard;
