import { useAtom } from 'jotai';
import { usernameAtom } from '../../atoms/usernameAtom';

const Home: React.FC = () => {
	const [username] = useAtom(usernameAtom);

	return (
		<>
			<div className="lobby">
				<>
					<h2>Welcome to Chat app {username}!</h2>
				</>
			</div>
		</>
	);
};

export default Home;
