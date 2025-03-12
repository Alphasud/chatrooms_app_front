import { Chatroom } from '../../WebSocketProvider';
import styles from '../../styles/Chat.module.css';

interface ActiveChatCardProps {
	chatroom: Chatroom;
	handleJoin: (chatroomId: string) => void;
}

const getLastTimeActive = (lastActiveAt: Date) => {
	const diff = new Date().getTime() - new Date(lastActiveAt).getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(weeks / 4);
	const years = Math.floor(months / 12);
	if (years) {
		return `${years} year${years > 1 ? 's' : ''} ago`;
	} else if (months) {
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else if (weeks) {
		return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	} else if (days) {
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (hours) {
		return `${hours} hr${hours > 1 ? 's' : ''} ago`;
	} else if (minutes) {
		return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
	} else {
		return 'Just now';
	}
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
			{chatroom.chatroomId} ({chatroom.users.length})
			<span className={styles.last_active}>
				Active: {getLastTimeActive(chatroom.lastActiveAt)}
			</span>
		</div>
	);
};
export default ActiveChatCard;
