
function SignUp() {
  return (
    <div className='signup-container'>
      <input type="textbox" name="email" placeholder="Enter your email"/>
      <input type="textbox" name="password" placeholder="Create a password"/>
      <button className='signup-btn'>Create Account</button>
    </div>
  );
}

export default SignUp;
