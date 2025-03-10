import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeProps {
	// Define your props here
	currentURL: string;
}

const QRCode: React.FC<QRCodeProps> = ({ currentURL }) => {
	const [showQRCode, setShowQRCode] = useState(false);
	const handleButtonClick = () => {
		setShowQRCode(!showQRCode);
	};
	return (
		<>
			<button
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					zIndex: 3,
				}}
				onClick={handleButtonClick}
			>
				{showQRCode ? 'Hide QR Code' : 'Show QR Code'}
			</button>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					height: '100vh',
					width: '100vw',
					backgroundColor: '#242424',
					display: showQRCode ? 'block' : 'none',
				}}
			>
				{currentURL && (
					<QRCodeSVG
						style={{
							height: '25%',
							width: '25%',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
						value={currentURL}
					/>
				)}
			</div>
		</>
	);
};
export default QRCode;
