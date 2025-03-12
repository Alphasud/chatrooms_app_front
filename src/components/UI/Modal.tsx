import styles from '../../styles/Modal.module.css';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose }) => {
	if (!show) {
		return null;
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				{children}
			</div>
		</div>
	);
};
export default Modal;
