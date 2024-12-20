import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignUp.module.css";
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = "Email is required.";
    if (!data.password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8000/login", {
          email: data.email,
          password: data.password,
        });
        if (response.data.success) {
          // Save token, role, and profile data in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role); // Store user role
          localStorage.setItem('userName', response.data.userName); // Store username
          localStorage.setItem('userId', response.data.userId); // Store user ID
          localStorage.setItem('userEmail', response.data.userEmail); // Store email
          localStorage.setItem('userPhone', response.data.userPhone); // Store phone number
          localStorage.setItem('userClubs', JSON.stringify(response.data.userClubs)); // Store clubs
          localStorage.setItem('userEvents', JSON.stringify(response.data.userEvents)); // Store events
          localStorage.setItem('userResources', JSON.stringify(response.data.userResources)); // Store shared resources

          // Redirect based on role
          if (response.data.role === 'Member') {
            navigate('/dashboard');
          } else if (response.data.role === 'Admin') {
            navigate('/admin-dashboard');
          } else {
            setErrors('Invalid user role.');
          }
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "An error occurred during login."
        );
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={changeHandler}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={changeHandler}
        />
        {errors.password && <span className={styles.error}>{errors.password}</span>}

        <button type="submit">Log In</button>

        <div className={styles.links}>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link to="/forgot-password" className={styles.link}>
              Reset it here
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
