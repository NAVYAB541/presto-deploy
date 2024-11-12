import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backendConfig from '../../backend.config.json';

const BACKEND_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

const Logout = ({ token, setToken }) => {
  const navigate = useNavigate();
  const logout = () => {
    axios.post(`${BACKEND_BASE_URL}/admin/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }
    )
      .then(() => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/')
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }

  return (
    <button
      onClick={logout}
      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
    >
      Logout
      <svg
        className="h-4 w-4 ml-2 text-white"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
        <path d="M7 12h14l-3 -3m0 6l3 -3" />
      </svg>
    </button>
  );
}

export default Logout;