import '../index.css'

function Login() {
  return (
    <div className='login-container'>
      <input type="textbox" name="email" placeholder="Enter your email"/>
      <input type="textbox" name="password" placeholder="Enter your password"/>
      <button className='login-btn'>Login</button>
    </div>
  )
}

export default Login;