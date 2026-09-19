import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  LogOut,
  ChevronRight,
} from "lucide-react";

function Account() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("vshUser") || "null"
  );

  const bookings = JSON.parse(
    localStorage.getItem("vshBookings") || "[]"
  );

  const handleLogout = () => {
    localStorage.removeItem("vshLoggedIn");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="account-login-required">

        <h2>Please login first</h2>

        <Link to="/login">
          Login to your account
        </Link>

      </div>
    );
  }

  return (
    <div className="account-page">

      {/* HEADER */}

      <header className="account-header">

        <div className="account-header-inner">

          <Link to="/" className="account-logo">
            <ArrowLeft size={19} />
            Village Service Hub
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <main className="account-container">

        <section className="account-welcome">

          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p>MY ACCOUNT</p>

            <h1>
              Hello, {user.name.split(" ")[0]} 👋
            </h1>

            <span>
              Manage your profile and bookings.
            </span>
          </div>

        </section>

        {/* PROFILE */}

        <section className="account-card">

          <div className="account-card-heading">

            <div>
              <p>PERSONAL INFORMATION</p>
              <h2>Profile details</h2>
            </div>

          </div>

          <div className="profile-details">

            <div className="profile-detail">
              <User size={19} />

              <div>
                <small>Name</small>
                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Mail size={19} />

              <div>
                <small>Email</small>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Phone size={19} />

              <div>
                <small>Phone</small>
                <strong>{user.phone}</strong>
              </div>
            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="account-card">

          <div className="account-card-heading">

            <div>
              <p>QUICK ACCESS</p>
              <h2>Manage your account</h2>
            </div>

          </div>

          <div className="account-actions">

            <Link to="/bookings" className="account-action">

              <div className="account-action-icon">
                <CalendarDays size={21} />
              </div>

              <div>
                <strong>My Bookings</strong>

                <span>
                  {bookings.length} booking
                  {bookings.length !== 1 ? "s" : ""}
                </span>
              </div>

              <ChevronRight size={18} />

            </Link>

            <div className="account-action">

              <div className="account-action-icon">
                <MapPin size={21} />
              </div>

              <div>
                <strong>Saved Address</strong>

                <span>
                  Manage your service location
                </span>
              </div>

              <ChevronRight size={18} />

            </div>

          </div>

        </section>

        {/* BOOK NOW */}

        <section className="account-cta">

          <div>

            <p>NEED A SERVICE?</p>

            <h2>
              Find a professional near you.
            </h2>

            <span>
              Browse our available services and
              book in just a few clicks.
            </span>

          </div>

          <Link to="/services">
            Explore Services
            <ChevronRight size={18} />
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Account;