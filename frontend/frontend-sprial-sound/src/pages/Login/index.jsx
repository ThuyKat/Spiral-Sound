import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
export default function Login() {
  const [login] = useContext(AuthContext);
  const ref = useRef(0);
  //   const [formData, setFormData] = useState({
  //     username: '',
  //     password: '',
  //   });
  const [error, setError] = useState('');
  //   const handleOnChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };
  const handleSubmit = async (formData) => {
    ref.current.disabled = true;
    try {
      const res = await login(
        formData.get('username'),
        formData.get('password')
      );
      const data = await res.json();

      if (res.ok) {
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect. Please try again.');
    } finally {
      ref.current.disabled = false;
    }
  };
  return (
    <main className="sign-forms">
      <form
        className="sign-form"
        id="signin-form"
        autoComplete="off"
        action={handleSubmit}
      >
        <div className="form-inner">
          <h2>Welcome back!</h2>
          <label htmlFor="signin-username">Username</label>
          <input
            type="text"
            id="signin-username"
            name="username"
            // value={formData.username}
            // onChange={handleOnChange}
            required
            pattern="^[a-zA-Z0-9_\-]{1,20}$"
            title="Username must be 1–20 characters and can only include letters, numbers, underscores (_), or hyphens (-)."
          />

          <label htmlFor="signin-password">Password</label>
          <input
            type="password"
            id="signin-password"
            name="password"
            // value={formData.password}
            // onChange={handleOnChange}
            required
          />

          <button type="submit" className="form-btn" ref={ref}>
            Log In
          </button>
          <p>
            No account?{' '}
            <a href="/signup.html" className="sign-link">
              Sign up here
            </a>
            .
          </p>
          <p id="error-message" className="error">
            {error}
          </p>
        </div>
      </form>
    </main>
  );
}
