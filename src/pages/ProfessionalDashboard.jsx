import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CheckCircle2,
  Clock,
  IndianRupee,
  LogOut,
  MapPin,
  Phone,
  User,
  X,
  Check,
  Menu,
  BriefcaseBusiness,
} from "lucide-react";

function ProfessionalDashboard() {
  const navigate = useNavigate();

  const [professional, setProfessional] =
    useState(null);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);


  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "vshProfessionalToken"
        );

      const savedProfessional =
        JSON.parse(
          localStorage.getItem(
            "vshProfessional"
          ) || "null"
        );

      if (
        !token ||
        !savedProfessional
      ) {
        navigate(
          "/professional-login"
        );
        return;
      }

      setProfessional(
        savedProfessional
      );


      const response = await fetch(
        "http://192.168.1.35:5000/api/professionals/bookings",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            "vshProfessionalToken"
          );

          localStorage.removeItem(
            "vshProfessional"
          );

          navigate(
            "/professional-login"
          );

          return;
        }

        throw new Error(
          data.message ||
            "Could not load bookings."
        );
      }


      setBookings(
        data.bookings || []
      );

    } catch (err) {

      console.error(
        "Professional bookings error:",
        err
      );

      setError(
        "Could not load bookings. Make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadBookings();

    const handleFocus =
      () => {
        loadBookings();
      };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);


  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Pending"
    );


  const acceptedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Accepted"
    );


  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Completed"
    );


  const earnings =
    completedBookings.reduce(
      (total, booking) =>
        total +
        Number(
          booking.total || 0
        ),
      0
    );


  const updateBooking =
    async (
      bookingId,
      status
    ) => {

      const token =
        localStorage.getItem(
          "vshProfessionalToken"
        );

      if (!token) {
        navigate(
          "/professional-login"
        );
        return;
      }


      try {

        const response =
          await fetch(
            `http://192.168.1.35:5000/api/professionals/bookings/${bookingId}/status`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status,
              }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          alert(
            data.message ||
              "Could not update booking."
          );

          return;
        }


        await loadBookings();

      } catch (error) {

        console.error(
          "Update booking error:",
          error
        );

        alert(
          "Could not connect to the server."
        );
      }
    };


  const handleLogout =
    () => {

      localStorage.removeItem(
        "vshProfessionalToken"
      );

      localStorage.removeItem(
        "vshProfessional"
      );

      navigate("/");

    };


  const renderBooking =
    (booking) => {

      const service =
        booking.service || {};

      const customer =
        booking.customer || {};


      return (
        <div
          className="provider-request-card"
          key={booking.bookingId}
        >

          <div className="provider-request-top">

            <div className="provider-request-service">

              {service.image ? (
                <img
                  src={service.image}
                  alt={
                    service.name ||
                    "Service"
                  }
                />
              ) : (
                <div
                  style={{
                    width: "75px",
                    height: "65px",
                    background:
                      "#eeeeeb",
                    borderRadius:
                      "7px",
                  }}
                />
              )}

              <div>

                <small>
                  {service.category ||
                    "Service"}
                </small>

                <h3>
                  {service.name ||
                    "Service Booking"}
                </h3>

                <span>
                  Booking ID:{" "}
                  {booking.bookingId}
                </span>

              </div>

            </div>


            <div
              className={
                `provider-status ${(
                  booking.status ||
                  "Pending"
                ).toLowerCase()}`
              }
            >
              {booking.status}
            </div>

          </div>


          <div className="provider-request-details">

            <div>

              <CalendarDays
                size={17}
              />

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {booking.selectedDate}
                </strong>

              </div>

            </div>


            <div>

              <Clock size={17} />

              <div>

                <small>
                  Time
                </small>

                <strong>
                  {booking.selectedTime}
                </strong>

              </div>

            </div>


            <div>

              <User size={17} />

              <div>

                <small>
                  Customer
                </small>

                <strong>
                  {customer.name ||
                    booking.name ||
                    "Customer"}
                </strong>

              </div>

            </div>


            <div>

              <Phone size={17} />

              <div>

                <small>
                  Phone
                </small>

                <strong>
                  {customer.phone ||
                    booking.phone ||
                    "Not available"}
                </strong>

              </div>

            </div>


            <div className="provider-address">

              <MapPin size={17} />

              <div>

                <small>
                  Address
                </small>

                <strong>
                  {booking.address}
                </strong>

              </div>

            </div>

          </div>


          <div className="provider-request-bottom">

            <strong>
              ₹{booking.total || 0}
            </strong>


            {booking.status ===
              "Pending" && (

              <div className="provider-request-actions">

                <button
                  className="reject-request"
                  onClick={() =>
                    updateBooking(
                      booking.bookingId,
                      "Rejected"
                    )
                  }
                >
                  <X size={16} />
                  Reject
                </button>


                <button
                  className="accept-request"
                  onClick={() =>
                    updateBooking(
                      booking.bookingId,
                      "Accepted"
                    )
                  }
                >
                  <Check size={16} />
                  Accept
                </button>

              </div>
            )}


            {booking.status ===
              "Accepted" && (

              <button
                className="complete-request"
                onClick={() =>
                  updateBooking(
                    booking.bookingId,
                    "Completed"
                  )
                }
              >
                <CheckCircle2
                  size={16}
                />
                Mark Completed
              </button>

            )}

          </div>

        </div>
      );
    };


  if (loading && !professional) {
    return (
      <div className="provider-empty">
        <Clock size={40} />
        <h3>
          Loading professional dashboard...
        </h3>
      </div>
    );
  }


  return (
    <div className="professional-dashboard">


      {/* SIDEBAR */}

      <aside
        className={
          mobileMenu
            ? "professional-sidebar open"
            : "professional-sidebar"
        }
      >

        <div className="professional-sidebar-logo">

          <div className="sidebar-logo-icon">

            <BriefcaseBusiness
              size={20}
            />

          </div>

          <div>

            <strong>
              Village Service
            </strong>

            <span>
              Professional
            </span>

          </div>

        </div>


        <nav>

          <button
            className={
              activeTab ===
              "dashboard"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => {
              setActiveTab(
                "dashboard"
              );

              setMobileMenu(
                false
              );
            }}
          >
            <LayoutDashboard
              size={18}
            />
            Dashboard
          </button>


          <button
            className={
              activeTab ===
              "requests"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => {
              setActiveTab(
                "requests"
              );

              setMobileMenu(
                false
              );
            }}
          >
            <CalendarDays size={18} />

            Booking Requests

            {pendingBookings.length >
              0 && (
              <span className="sidebar-badge">
                {
                  pendingBookings.length
                }
              </span>
            )}

          </button>


          <button
            className={
              activeTab ===
              "jobs"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => {
              setActiveTab(
                "jobs"
              );

              setMobileMenu(
                false
              );
            }}
          >
            <CheckCircle2
              size={18}
            />

            My Jobs

          </button>

        </nav>


        <div className="sidebar-bottom">

          <button
            onClick={handleLogout}
            style={{
              background:
                "transparent",
              border: "none",
              color: "#888",
              display: "flex",
              alignItems:
                "center",
              gap: "8px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="professional-main">


        <header className="professional-topbar">

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            <Menu size={21} />
          </button>


          <div>

            <span>
              PROFESSIONAL DASHBOARD
            </span>

            <h1>
              Welcome,{" "}
              {professional?.name ||
                "Professional"}
            </h1>

          </div>


          <button
            className="dashboard-logout"
            onClick={
              handleLogout
            }
          >
            <LogOut size={17} />
            Logout
          </button>

        </header>


        {error && (
          <div
            style={{
              margin:
                "20px 35px 0",
              padding: "15px",
              background:
                "#fff0f0",
              color: "#a33",
              borderRadius:
                "8px",
            }}
          >
            {error}
          </div>
        )}


        {/* DASHBOARD */}

        {activeTab ===
          "dashboard" && (

          <>

            <section className="provider-stats">

              <div className="provider-stat-card">

                <div className="provider-stat-icon">
                  <CalendarDays size={21} />
                </div>

                <span>
                  Pending Requests
                </span>

                <strong>
                  {pendingBookings.length}
                </strong>

              </div>


              <div className="provider-stat-card">

                <div className="provider-stat-icon">
                  <Clock size={21} />
                </div>

                <span>
                  Accepted Jobs
                </span>

                <strong>
                  {acceptedBookings.length}
                </strong>

              </div>


              <div className="provider-stat-card">

                <div className="provider-stat-icon">
                  <CheckCircle2
                    size={21}
                  />
                </div>

                <span>
                  Completed
                </span>

                <strong>
                  {completedBookings.length}
                </strong>

              </div>


              <div className="provider-stat-card">

                <div className="provider-stat-icon">
                  <IndianRupee
                    size={21}
                  />
                </div>

                <span>
                  Total Earnings
                </span>

                <strong>
                  ₹{earnings}
                </strong>

              </div>

            </section>


            <section className="provider-dashboard-section">

              <div className="provider-section-heading">

                <div>

                  <p>
                    NEW REQUESTS
                  </p>

                  <h2>
                    Booking requests
                  </h2>

                </div>


                <button
                  onClick={() =>
                    setActiveTab(
                      "requests"
                    )
                  }
                >
                  View all
                </button>

              </div>


              {pendingBookings.length ===
              0 ? (

                <div className="provider-empty">

                  <CheckCircle2
                    size={40}
                  />

                  <h3>
                    No new requests
                  </h3>

                  <p>
                    New customer bookings
                    will appear here.
                  </p>

                </div>

              ) : (

                <div className="provider-request-list">

                  {pendingBookings
                    .slice(0, 3)
                    .map(
                      renderBooking
                    )}

                </div>

              )}

            </section>

          </>
        )}


        {/* REQUESTS */}

        {activeTab ===
          "requests" && (

          <section className="provider-page-section">

            <div className="provider-section-heading">

              <div>

                <p>
                  BOOKINGS
                </p>

                <h2>
                  All booking requests
                </h2>

              </div>

            </div>


            {bookings.length ===
            0 ? (

              <div className="provider-empty">

                <CalendarDays
                  size={40}
                />

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Customer requests will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="provider-request-list">

                {bookings.map(
                  renderBooking
                )}

              </div>

            )}

          </section>
        )}


        {/* COMPLETED JOBS */}

        {activeTab ===
          "jobs" && (

          <section className="provider-page-section">

            <div className="provider-section-heading">

              <div>

                <p>
                  WORK HISTORY
                </p>

                <h2>
                  My completed jobs
                </h2>

              </div>

            </div>


            {completedBookings.length ===
            0 ? (

              <div className="provider-empty">

                <CheckCircle2
                  size={40}
                />

                <h3>
                  No completed jobs
                </h3>

                <p>
                  Completed services will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="provider-request-list">

                {completedBookings.map(
                  renderBooking
                )}

              </div>

            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default ProfessionalDashboard;