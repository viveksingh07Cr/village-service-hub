import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  Shield,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoAdmin = {
    name: "Village Service Admin",
    email: "admin@vsh.com",
    password: "admin123",
  };

  if (!localStorage.getItem("vshAdmin")) {
    localStorage.setItem(
      "vshAdmin",
      JSON.stringify(demoAdmin)
    );
  }

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert(
      "Please enter your email and password."
    );
    return;
  }

  try {
    const response = await fetch(
      "http://192.168.1.35:5000/api/admin/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
          "Admin login failed."
      );
      return;
    }

    localStorage.setItem(
      "vshAdminToken",
      data.token
    );

    localStorage.setItem(
      "vshAdmin",
      JSON.stringify(data.admin)
    );

    localStorage.setItem(
      "vshAdminLoggedIn",
      "true"
    );

    alert(
      "Admin login successful!"
    );

    navigate("/admin");
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    alert(
      "Could not connect to the server."
    );
  }
};

  return (
    <div className="admin-login-page">

      <div className="admin-login-left">

        <Link to="/" className="admin-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <Shield size={30} />
          </div>

          <p>VILLAGE SERVICE HUB</p>

          <h1>
            Manage your
            <br />
            service platform.
          </h1>

          <span>
            Monitor customers, professionals,
            bookings, services and platform activity
            from one place.
          </span>

        </div>

      </div>

      <div className="admin-login-right">

        <div className="admin-login-box">

          <div className="admin-heading">

            <p>ADMIN PORTAL</p>

            <h2>Administrator Login</h2>

            <span>
              Sign in to access the control panel.
            </span>

          </div>

          <form onSubmit={handleLogin}>

            <div className="admin-field">

              <label>Email address</label>

              <div className="admin-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="admin@vsh.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="admin-field">

              <label>Password</label>

              <div className="admin-input">

                <Lock size={18} />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            <button
              className="admin-login-button"
              type="submit"
            >
              Login to Admin Panel
            </button>

          </form>

          <div className="admin-demo">

            <strong>College project demo</strong>

            <span>
              Email: admin@vsh.com
            </span>

            <span>
              Password: admin123
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
