import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

function ProfessionalLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        "/api/professionals/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
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
            "Professional login failed."
        );
        return;
      }

      localStorage.setItem(
        "vshProfessionalToken",
        data.token
      );

      localStorage.setItem(
        "vshProfessional",
        JSON.stringify(
          data.professional
        )
      );

      alert(
        "Professional login successful!"
      );

      navigate("/professional");

    } catch (error) {
      console.error(
        "Professional login error:",
        error
      );

      alert(
        "Could not connect to the server. Make sure the backend is running."
      );
    }
  };

  return (
    <div className="professional-login-page">

      <div className="professional-login-left">

        <Link
          to="/"
          className="professional-back"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="professional-login-brand">

          <div className="professional-icon">
            <ShieldCheck size={32} />
          </div>

          <p>
            VILLAGE SERVICE HUB
          </p>

          <h1>
            Grow your local
            <br />
            service business.
          </h1>

          <span>
            Connect with customers in your
            village, manage bookings and
            grow your earnings.
          </span>

        </div>

      </div>


      <div className="professional-login-right">

        <div className="professional-login-box">

          <div className="professional-heading">

            <p>
              PROFESSIONAL PORTAL
            </p>

            <h2>
              Professional Login
            </h2>

            <span>
              Sign in to manage your service
              bookings.
            </span>

          </div>


          <form onSubmit={handleLogin}>

            <div className="professional-field">

              <label>
                Email address
              </label>

              <div className="professional-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="professional@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="professional-field">

              <label>
                Password
              </label>

              <div className="professional-input">

                <Lock size={18} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              className="professional-login-button"
            >
              Login to Dashboard
            </button>

          </form>


          <div className="professional-demo">

            <strong>
              Demo professional account
            </strong>

            <span>
              Email: electrician@vsh.com
            </span>

            <span>
              Password: 123456
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfessionalLogin;