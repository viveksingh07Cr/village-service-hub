import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Lock,
  Mail,
} from "lucide-react";

function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      alert(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      alert(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "http://localhost:5000/api/users/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      // Save JWT
      localStorage.setItem(
        "vshToken",
        data.token
      );

      // Save authenticated user
      localStorage.setItem(
        "vshUser",
        JSON.stringify(
          data.user
        )
      );

      localStorage.setItem(
        "vshLoggedIn",
        "true"
      );

      alert(
        "Login successful!"
      );

      navigate("/account");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        error.message ||
          "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT */}
      <div className="auth-left">

        <Link
          to="/"
          className="auth-back"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="auth-brand">

          <p>
            VILLAGE SERVICE HUB
          </p>

          <h1>
            Quality services,
            <br />
            right at your doorstep.
          </h1>

          <span>
            Connect with trusted
            local professionals
            for your everyday needs.
          </span>

        </div>

      </div>

      {/* RIGHT */}
      <div className="auth-right">

        <div className="auth-box">

          <div className="auth-heading">

            <p>
              WELCOME BACK
            </p>

            <h2>
              Login to your account
            </h2>

            <span>
              Access your bookings
              and account details.
            </span>

          </div>

          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div className="auth-field">

              <label>
                Email address
              </label>

              <div className="auth-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="auth-field">

              <label>
                Password
              </label>

              <div className="auth-input">

                <Lock size={18} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* LOGIN */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <div className="auth-switch">

            Don't have an account?

            <Link to="/register">
              Create account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;