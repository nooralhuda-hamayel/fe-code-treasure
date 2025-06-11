import { useNavigate } from 'react-router-dom';
import { useUser } from '../../shared';

export default function Header() {
  const navigate = useNavigate();
    const {user} = useUser();

  const onLogout = async () => {
    navigate('/logout');
  };

  return (
    <header>
      Welcome {user?.name}
      <nav>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
} 