import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock3,
  PackageCheck,
} from "lucide-react";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // SERVICE IMAGE FALLBACK MAP
  // =====================================================
  // Keeps booking images consistent with the Services page.
  const imageMap = {
    "Home Cleaning":
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85",

    Electrician:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=85",

    Plumbing:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85",

    "AC Repair":
      "https://images.unsplash.com/photo-1631545806609-3e5c5b8b9e3f?auto=format&fit=crop&w=900&q=85",

    "Salon at Home":
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",

    "Car Washing":
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=85",

    "Pest Control":
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",

    "Water Tank Cleaning":
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=900&q=85",
  };

  // =====================================================
  // LOAD CUSTOMER BOOKINGS
  // =====================================================
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const savedUser = JSON.parse(
          localStorage.getItem(
            "vshUser"
          ) || "null"
        );

        const token =
          localStorage.getItem(
            "vshToken"
          );

        // User must be logged in
        if (
          !savedUser ||
          !savedUser.id ||
          !token
        ) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            `http://192.168.1.35:5000/api/bookings/customer/${savedUser.id}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch bookings."
          );
        }

        setBookings(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "My bookings error:",
          err
        );

        setError(
          err.message ||
            "Could not load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  // =====================================================
  // STATUS ICON
  // =====================================================
  const getStatusIcon = (
    status
  ) => {
    switch (status) {
      case "Accepted":
        return (
          <CheckCircle2
            size={16}
          />
        );

      case "Rejected":
        return (
          <XCircle
            size={16}
          />
        );

      case "Completed":
        return (
          <PackageCheck
            size={16}
          />
        );

      case "Cancelled":
        return (
          <XCircle
            size={16}
          />
        );

      default:
        return (
          <Clock3
            size={16}
          />
        );
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================
  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "Accepted":
        return "booking-status accepted";

      case "Rejected":
        return "booking-status rejected";

      case "Completed":
        return "booking-status completed";

      case "Cancelled":
        return "booking-status cancelled";

      default:
        return "booking-status pending";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="my-bookings-page">
        <header className="bookings-header">
          <div className="bookings-header-inner">
            <Link
              to="/"
              className="bookings-brand"
            >
              <div className="bookings-logo">
                V
              </div>

              <div>
                <strong>
                  Village
                </strong>

                <span>
                  SERVICE HUB
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="bookings-main">
          <div className="bookings-loading">
            <div className="loading-spinner" />

            <h2>
              Loading your bookings...
            </h2>

            <p>
              Please wait a moment.
            </p>
          </div>
        </main>

        <style>{styles}</style>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <div className="my-bookings-page">
        <header className="bookings-header">
          <div className="bookings-header-inner">

            <Link
              to="/"
              className="bookings-brand"
            >
              <div className="bookings-logo">
                V
              </div>

              <div>
                <strong>
                  Village
                </strong>

                <span>
                  SERVICE HUB
                </span>
              </div>
            </Link>

            <Link
              to="/services"
              className="bookings-services-link"
            >
              Services
            </Link>

          </div>
        </header>

        <main className="bookings-main">
          <div className="bookings-empty">

            <div className="empty-icon">
              !
            </div>

            <h2>
              Could not load bookings
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>
        </main>

        <style>{styles}</style>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================
  return (
    <div className="my-bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}
      <header className="bookings-header">
        <div className="bookings-header-inner">

          <Link
            to="/"
            className="bookings-brand"
          >
            <div className="bookings-logo">
              V
            </div>

            <div>
              <strong>
                Village
              </strong>

              <span>
                SERVICE HUB
              </span>
            </div>
          </Link>

          <Link
            to="/services"
            className="bookings-services-link"
          >
            Browse Services
          </Link>

        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}
      <main className="bookings-main">

        <div className="bookings-heading">

          <Link
            to="/account"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Back to Account
          </Link>

          <span className="eyebrow">
            MY ACCOUNT
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            View and track your service
            bookings.
          </p>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}
        {bookings.length === 0 ? (
          <div className="bookings-empty">

            <div className="empty-icon">
              <CalendarDays
                size={32}
              />
            </div>

            <h2>
              No bookings yet
            </h2>

            <p>
              You haven't booked a
              service yet.
            </p>

            <Link
              to="/services"
              className="primary-button"
            >
              Explore Services
            </Link>

          </div>
        ) : (

          <div className="bookings-list">

            {bookings.map(
              (booking) => {

                const service =
                  booking.service ||
                  {};

                // Use the known correct image first.
                // If no mapping exists, use MongoDB image.
                const serviceImage =
                  imageMap[
                    service.name
                  ] ||
                  service.image ||
                  null;

                return (
                  <article
                    key={
                      booking._id ||
                      booking.bookingId
                    }
                    className="booking-card"
                  >

                    {/* ===================================
                        SERVICE IMAGE
                    =================================== */}
                    <div className="booking-image-wrap">

                      {serviceImage ? (

                        <img
                          src={
                            serviceImage
                          }
                          alt={
                            service.name ||
                            "Service"
                          }
                          onError={(e) => {

                            const fallback =
                              imageMap[
                                "Home Cleaning"
                              ];

                            // Try fallback once
                            if (
                              e.currentTarget.src !==
                              fallback
                            ) {
                              e.currentTarget.src =
                                fallback;
                            } else {

                              // If even fallback
                              // fails, show placeholder
                              e.currentTarget.style.display =
                                "none";

                              const parent =
                                e.currentTarget
                                  .parentElement;

                              if (
                                parent &&
                                !parent.querySelector(
                                  ".image-error-placeholder"
                                )
                              ) {
                                const placeholder =
                                  document.createElement(
                                    "div"
                                  );

                                placeholder.className =
                                  "image-error-placeholder";

                                placeholder.innerText =
                                  "V";

                                parent.appendChild(
                                  placeholder
                                );
                              }
                            }
                          }}
                        />

                      ) : (

                        <div className="booking-image-placeholder">
                          V
                        </div>

                      )}

                    </div>

                    {/* ===================================
                        CONTENT
                    =================================== */}
                    <div className="booking-card-content">

                      <div className="booking-card-top">

                        <div>

                          <span className="booking-category">
                            {service.category ||
                              "Service"}
                          </span>

                          <h2>
                            {service.name ||
                              "Service Booking"}
                          </h2>

                        </div>

                        <span
                          className={getStatusClass(
                            booking.status
                          )}
                        >

                          {getStatusIcon(
                            booking.status
                          )}

                          {booking.status ||
                            "Pending"}

                        </span>

                      </div>

                      {/* =================================
                          BOOKING ID
                      ================================= */}
                      <div className="booking-reference">

                        <span>
                          BOOKING ID
                        </span>

                        <strong>
                          {booking.bookingId ||
                            "N/A"}
                        </strong>

                      </div>

                      {/* =================================
                          DETAILS
                      ================================= */}
                      <div className="booking-details">

                        <div className="booking-detail">

                          <CalendarDays
                            size={17}
                          />

                          <div>

                            <span>
                              DATE
                            </span>

                            <strong>
                              {booking.selectedDate ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                        <div className="booking-detail">

                          <Clock
                            size={17}
                          />

                          <div>

                            <span>
                              TIME
                            </span>

                            <strong>
                              {booking.selectedTime ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                        <div className="booking-detail">

                          <MapPin
                            size={17}
                          />

                          <div>

                            <span>
                              ADDRESS
                            </span>

                            <strong>
                              {booking.address ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* =================================
                          TOTAL
                      ================================= */}
                      <div className="booking-card-bottom">

                        <div className="booking-price">

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {Number(
                              booking.total ||
                                service.price ||
                                0
                            )}
                          </strong>

                        </div>

                        <div className="booking-created">

                          {booking.createdAt
                            ? new Date(
                                booking.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )
                            : ""}

                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </main>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .my-bookings-page {
    min-height: 100vh;
    background: #f7f7f5;
    color: #171717;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .bookings-header {
    height: 74px;
    background: rgba(255, 255, 255, .96);
    border-bottom: 1px solid #e7e7e2;
  }

  .bookings-header-inner {
    width: min(1200px, 92%);
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bookings-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    color: #171717;
  }

  .bookings-logo {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    background: #171717;
    color: white;
    font-size: 18px;
    font-weight: 800;
  }

  .bookings-brand strong {
    display: block;
    font-size: 17px;
    line-height: 1;
  }

  .bookings-brand span {
    display: block;
    margin-top: 4px;
    color: #888;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .bookings-services-link {
    color: #333;
    text-decoration: none;
    font-size: 14px;
    font-weight: 650;
  }

  .bookings-main {
    width: min(1000px, 92%);
    margin: 0 auto;
    padding: 46px 0 70px;
  }

  .bookings-heading {
    margin-bottom: 28px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    text-decoration: none;
    color: #666;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 25px;
  }

  .eyebrow {
    display: block;
    font-size: 10px;
    letter-spacing: 2px;
    font-weight: 800;
    color: #96968f;
    margin-bottom: 8px;
  }

  .bookings-heading h1 {
    margin: 0;
    font-size: 38px;
    letter-spacing: -.8px;
  }

  .bookings-heading p {
    margin: 8px 0 0;
    color: #747474;
    font-size: 15px;
  }

  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }

  .booking-card {
    background: white;
    border: 1px solid #e5e5e0;
    border-radius: 19px;
    overflow: hidden;
    display: flex;
    box-shadow:
      0 8px 28px rgba(0, 0, 0, .035);
  }

  .booking-image-wrap {
    width: 225px;
    min-height: 230px;
    flex-shrink: 0;
    background: #ededeb;
    overflow: hidden;
  }

  .booking-image-wrap img {
    width: 100%;
    height: 100%;
    min-height: 230px;
    object-fit: cover;
    display: block;
  }

  .booking-image-placeholder,
  .image-error-placeholder {
    width: 100%;
    height: 100%;
    min-height: 230px;
    display: grid;
    place-items: center;
    font-size: 36px;
    font-weight: 800;
    color: #888;
  }

  .booking-card-content {
    padding: 24px;
    flex: 1;
    min-width: 0;
  }

  .booking-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
  }

  .booking-category {
    font-size: 10px;
    color: #8c8c85;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
  }

  .booking-card-top h2 {
    margin: 5px 0 0;
    font-size: 22px;
  }

  .booking-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 8px 11px;
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
  }

  .booking-status.pending {
    background: #fff4df;
    color: #9b6400;
  }

  .booking-status.accepted {
    background: #eaf7ed;
    color: #24783a;
  }

  .booking-status.rejected,
  .booking-status.cancelled {
    background: #fdeaea;
    color: #a73737;
  }

  .booking-status.completed {
    background: #eaf0ff;
    color: #315ca5;
  }

  .booking-reference {
    margin-top: 18px;
    padding: 12px 14px;
    border-radius: 11px;
    background: #f7f7f5;
  }

  .booking-reference span {
    display: block;
    font-size: 9px;
    letter-spacing: 1.3px;
    color: #999;
    font-weight: 800;
    margin-bottom: 3px;
  }

  .booking-reference strong {
    font-size: 14px;
  }

  .booking-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    padding: 19px 0;
    border-bottom: 1px solid #ecece7;
  }

  .booking-detail {
    display: flex;
    gap: 9px;
    align-items: flex-start;
  }

  .booking-detail svg {
    color: #666;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .booking-detail span {
    display: block;
    font-size: 9px;
    letter-spacing: 1px;
    font-weight: 800;
    color: #999;
    margin-bottom: 4px;
  }

  .booking-detail strong {
    display: block;
    font-size: 12px;
    line-height: 1.5;
  }

  .booking-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
  }

  .booking-price span {
    display: block;
    color: #999;
    font-size: 10px;
    margin-bottom: 3px;
  }

  .booking-price strong {
    font-size: 23px;
  }

  .booking-created {
    color: #999;
    font-size: 11px;
  }

  .bookings-empty,
  .bookings-loading {
    background: white;
    border: 1px solid #e6e6e1;
    border-radius: 20px;
    padding: 55px 25px;
    text-align: center;
  }

  .bookings-empty h2,
  .bookings-loading h2 {
    margin: 16px 0 7px;
    font-size: 23px;
  }

  .bookings-empty p,
  .bookings-loading p {
    margin: 0;
    color: #777;
    font-size: 14px;
  }

  .empty-icon {
    width: 70px;
    height: 70px;
    margin: 0 auto;
    border-radius: 50%;
    background: #f1f1ed;
    display: grid;
    place-items: center;
    color: #555;
    font-size: 32px;
    font-weight: 800;
  }

  .primary-button {
    margin-top: 22px;
    min-height: 47px;
    padding: 0 20px;
    border-radius: 11px;
    background: #171717;
    color: white;
    text-decoration: none;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .loading-spinner {
    width: 38px;
    height: 38px;
    border: 4px solid #e5e5e0;
    border-top-color: #171717;
    border-radius: 50%;
    margin: 0 auto;
    animation: spin .8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 800px) {
    .booking-card {
      flex-direction: column;
    }

    .booking-image-wrap,
    .booking-image-wrap img,
    .booking-image-placeholder,
    .image-error-placeholder {
      width: 100%;
      height: 210px;
      min-height: 210px;
    }

    .booking-details {
      grid-template-columns: 1fr;
      gap: 13px;
    }
  }

  @media (max-width: 550px) {
    .bookings-main {
      padding-top: 30px;
    }

    .bookings-heading h1 {
      font-size: 30px;
    }

    .booking-card-content {
      padding: 19px;
    }

    .booking-card-top {
      flex-direction: column;
    }

    .booking-status {
      align-self: flex-start;
    }
  }
`;

export default MyBookings;