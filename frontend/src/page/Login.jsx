import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setTokenFn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = () => {
    axios.post('http://localhost:5005/admin/auth/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        setTokenFn(response.data.token);
        navigate('/dashboard')
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }
  return (
    <>
      <h2>Login </h2>
      Email:
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)} /> <br />
      Password:
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.target.value)} /> <br />
      <button onClick={login}>Login</button>
    </>
  )
}

export default Login
