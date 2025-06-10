import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const onLogout = async () => {
    navigate('/logout');
  };

  return (
    <header>
      <nav>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
} 