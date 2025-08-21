import { useState } from "react";
import validator from "validator";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username: form.username,
        password: form.password,
      });
      if (res.status === 200) {
        toast.success("Login successful.");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        setError(res.data || "Login failed.");
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
      <h2 className="register-title">Login</h2>
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
        {error && <div className="register-error">{error}</div>}
        <button type="submit" className="register-btn">
          Login
        </button>
      </form>
      <div className="r-register-link">
        Don't have an account?{" "}
        <a href="/register" className="register-link">
          Register
        </a>
      </div>
    </div>
  );
}
