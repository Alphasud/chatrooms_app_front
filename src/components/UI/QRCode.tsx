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
		<div className="qrcode">
			<button onClick={handleButtonClick}>
				{showQRCode ? 'Hide QR Code' : 'Show QR Code'}
			</button>
			{currentURL && (
				<QRCodeSVG
					style={{
						display: showQRCode ? 'block' : 'none',
						height: '30%',
						width: '30%',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
					}}
					value={currentURL}
				/>
			)}
		</div>
	);
};
export default QRCode;
