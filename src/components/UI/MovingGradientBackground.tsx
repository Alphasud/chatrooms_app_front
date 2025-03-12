import { useEffect, useRef } from 'react';

const MovingGradientBackground = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);
	const progress = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		function draw() {
			if (!ctx || !canvas) return;

			// Update animation progress (this controls the speed of the gradient movement)
			progress.current += 0.0002; // Smaller value = slower movement

			// Clear the canvas for each frame
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Create a full-width gradient that moves based on progress
			const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

			// Modify the hue dynamically to create the moving effect
			const baseHue1 = (progress.current * 100) % 360;
			const baseHue2 = (progress.current * 120) % 360;

			// Add color stops for the gradient, using dynamic hues
			gradient.addColorStop(0, `hsl(${baseHue1}, 80%, 60%)`);
			gradient.addColorStop(1, `hsl(${baseHue2}, 80%, 60%)`);

			// Fill the canvas with the gradient
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Continue the animation
			animationRef.current = requestAnimationFrame(draw);
		}

		draw();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return <canvas ref={canvasRef} className="gradient-background" />;
};

export default MovingGradientBackground;
