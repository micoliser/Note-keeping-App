import { useState } from "react";
import validator from "validator";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (
      !validator.isAlphanumeric(form.username) ||
      !validator.isLength(form.username, { min: 3 })
    ) {
      return "Username must be at least 3 characters and alphanumeric.";
    }
    if (!validator.isLength(form.password, { min: 6 })) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          username: form.username,
          password: form.password,
        }
      );
      if (res.status === 201) {
        toast.success("Registration successful, proceed to login");
        navigate("/login");
      } else {
        setError(res.data || "Registration failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="register-input"
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          className="register-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          className="register-input"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {error && <div className="register-error">{error}</div>}
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
      <div className="r-register-link">
        Already have an account?{" "}
        <a href="/login" className="register-link">
          Login
        </a>
      </div>
    </div>
  );
}
