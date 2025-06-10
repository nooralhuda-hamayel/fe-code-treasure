import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export default function Header() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
} 