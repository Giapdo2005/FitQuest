import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom'; 

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully');
      navigate('/workout')
    } catch (error) {
      setError(error.message);
      alert(error);
    }
  }
  return (
    <div className='signup-container'>
      <form onSubmit={handleSignUp}>
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
  );
}

export default SignUp;
