import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {};
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
            value={formData.username}
            onChange={handleOnChange}
            required
            pattern="^[a-zA-Z0-9_\-]{1,20}$"
            title="Username must be 1–20 characters and can only include letters, numbers, underscores (_), or hyphens (-)."
          />

          <label htmlForfor="signin-password">Password</label>
          <input
            type="password"
            id="signin-password"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            required
          />

          <button type="submit" className="form-btn">
            Log In
          </button>
          <p>
            No account?{' '}
            <a href="/signup.html" className="sign-link">
              Sign up here
            </a>
            .
          </p>
          <p id="error-message" className="error"></p>
        </div>
      </form>
    </main>
  );
}
