import { useNavigate } from 'react-router-dom';
import '../index.css'

function Auth() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className='title'>
        Welcome to FitQuest
      </div>
      <div>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
      <div className='or'>
        Or
      </div>
      <div>
        <button onClick={() => navigate('/signup')}>Create an Account</button>
      </div>
    </div>
  )
}

export default Auth;