import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "./Logininputs";
import { useContext, useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../context/UserContext";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const { email, password } = user;
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required"),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/user/userLogin",
        user
      );
      login(res.data);

      navigate("/employee");
    } catch (error) {
      setLoading(false);

      setError(error.response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <Formik
          enableReinitialize
          initialValues={{
            email,
            password,
          }}
          validationSchema={loginValidation}
          onSubmit={() => {
            loginSubmit();
          }}
        >
          {(formik) => (
            <Form>
              <LoginInput
                type="text"
                name="email"
                placeholder="Email address"
                onChange={handleLoginChange}
                className="login-input"
              />

              <LoginInput
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleLoginChange}
                className="login-input"
                bottom
              />

              <button type="submit" className="blue-btn">
                Log In
              </button>
            </Form>
          )}
        </Formik>
        {loading && (
          <div className="loader">
            <DotLoader color="black" loading={loading} size={20} />
          </div>
        )}
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
