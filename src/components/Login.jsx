import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../auth.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(email);
      const response = await axios.get(`http://localhost:5000/api/user/${email}`);
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      alert('Logged in successfully!');
      navigate('/workout')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='login-container'>
      <div className='box-container'>
        <h2>LOGIN</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className='error-message'>{error}</p>}
          <button className='login-btn' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
