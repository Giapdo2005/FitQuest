import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../auth.css'

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await axios.post('http://localhost:5000/api/register', { email, full_name: fullName });
      
      alert('Account created successfully');
      navigate('/workout')
    } catch (error) {
      setError(error.message);
      alert(error);
    }
  }
  return (
    <div className='signup-container'>
      <div className='inside-container'>
        <h2>SIGN UP</h2>
        <form onSubmit={handleSignUp}>
          <input
            type='text'
            name='fullName'
            placeholder='Enter your full name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className='error-message'>{error}</p>}
          <button className='signup-btn' type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
