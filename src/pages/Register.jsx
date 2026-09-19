import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    e
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert(
        "Please enter your name."
      );
      return;
    }

    if (!email.trim()) {
      alert(
        "Please enter your email."
      );
      return;
    }

    if (!phone.trim()) {
      alert(
        "Please enter your phone number."
      );
      return;
    }

    if (!password) {
      alert(
        "Please enter a password."
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "http://192.168.1.35:5000/api/users/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: name.trim(),
              email:
                email
                  .trim()
                  .toLowerCase(),
              phone:
                phone.trim(),
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not create account."
        );
      }

      // Remove old browser login data
      localStorage.removeItem(
        "vshUser"
      );

      localStorage.removeItem(
        "vshToken"
      );

      localStorage.removeItem(
        "vshLoggedIn"
      );

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        error.message ||
          "Could not create account."
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
            Your village,
            <br />
            your services.
          </h1>

          <span>
            Book trusted professionals
            for cleaning, repairs,
            beauty and home care.
          </span>

        </div>

      </div>

      {/* RIGHT */}
      <div className="auth-right">

        <div className="auth-box">

          <div className="auth-heading">

            <p>
              GET STARTED
            </p>

            <h2>
              Create your account
            </h2>

            <span>
              Join Village Service Hub
              today.
            </span>

          </div>

          <form
            onSubmit={
              handleRegister
            }
          >

            {/* NAME */}
            <div className="auth-field">

              <label>
                Full name
              </label>

              <div className="auth-input">

                <User size={18} />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

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

            {/* PHONE */}
            <div className="auth-field">

              <label>
                Phone number
              </label>

              <div className="auth-input">

                <Phone size={18} />

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
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
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-switch">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;