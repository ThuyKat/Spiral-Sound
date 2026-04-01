import { useState, useRef } from 'react';
// import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './login.module.css';
import { useLoginMutation } from '../../domain/mutations/useLoginMutation';
export default function Login() {
  // const { login } = useContext(AuthContext);
  const ref = useRef(0);
  const navigate = useNavigate();
  //   const [formData, setFormData] = useState({
  //     username: '',
  //     password: '',
  //   });
  const [error, setError] = useState('');
  //   const handleOnChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };
  const { mutate: login } = useLoginMutation({
    onSuccess: () => {
      navigate('/');
      ref.current.disabled = false;
    },
    onError: (error) => {
      if (error.message.startsWith('401')) {
        setError('Wrong username or password.');
      } else {
        setError('Unable to connect. Please try again.');
      }
      ref.current.disabled = true;
    },
  });
  const handleSubmit = async (formData) => {
    ref.current.disabled = true;
    setError('');
    login({
      username: formData.get('username'),
      password: formData.get('password'),
    });
    // try {
    //   const res = await login(
    //     formData.get('username'),
    //     formData.get('password')
    //   );
    //   if (res.ok) {
    //     navigate('/');
    //   } else {
    //     setError('Login failed. Please try again.');
    //   }
    // } catch {
    //   setError('Unable to connect. Please try again.');
    // } finally {
    //   ref.current.disabled = false;
    // }
  };
  return (
    <main className={styles['sign-forms']}>
      <form
        className="sign-form"
        id="signin-form"
        autoComplete="off"
        action={handleSubmit}
      >
        <div className={styles['form-inner']}>
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

          <button type="submit" className={styles['form-btn']} ref={ref}>
            Log In
          </button>
          <p>
            No account?{' '}
            <Link to="/signup" className={styles['sign-link']}>
              Sign up here
            </Link>
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
