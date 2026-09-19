import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  Home,
} from "lucide-react";

function BookingSuccess() {
  const location = useLocation();

  // Supports both:
  // state={{ booking: data.booking }}
  // and
  // state={booking}
  const booking =
    location.state?.booking ||
    location.state ||
    null;

  // If the page is opened directly without booking data
  if (!booking) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon warning">
            !
          </div>

          <h1>Booking information not found</h1>

          <p>
            Please create a booking from the
            services page.
          </p>

          <Link
            to="/services"
            className="success-primary-button"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const service =
    booking.service || {};

  const customer =
    booking.customer || {};

  const serviceName =
    service.name ||
    "Selected Service";

  const category =
    service.category ||
    "Service";

  const price =
    Number(service.price || 0);

  const total =
    Number(booking.total || price);

  return (
    <div className="success-page">
      <header className="success-header">
        <Link
          to="/"
          className="success-brand"
        >
          <div className="success-logo">
            V
          </div>

          <div>
            <strong>Village</strong>

            <span>
              SERVICE HUB
            </span>
          </div>
        </Link>

        <Link
          to="/services"
          className="success-home-link"
        >
          Services
        </Link>
      </header>

      <main className="success-main">
        <div className="success-card">

          {/* SUCCESS ICON */}
          <div className="success-icon">
            <CheckCircle2
              size={54}
            />
          </div>

          <span className="success-eyebrow">
            BOOKING CONFIRMED
          </span>

          <h1>
            Your booking is confirmed!
          </h1>

          <p className="success-description">
            Your service request has been
            successfully placed. A
            professional will handle your
            booking shortly.
          </p>

          {/* BOOKING ID */}
          <div className="booking-id-box">
            <span>
              BOOKING ID
            </span>

            <strong>
              {booking.bookingId ||
                "VSH-BOOKING"}
            </strong>
          </div>

          {/* SERVICE */}
          <div className="success-service">

            {service.image ? (
              <img
                src={service.image}
                alt={serviceName}
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="success-service-placeholder">
                V
              </div>
            )}

            <div>
              <span>
                {category}
              </span>

              <h2>
                {serviceName}
              </h2>

              <strong>
                ₹{price}
              </strong>
            </div>
          </div>

          {/* DETAILS */}
          <div className="success-details">

            <div className="success-detail">
              <CalendarDays
                size={20}
              />

              <div>
                <span>
                  DATE
                </span>

                <strong>
                  {booking.selectedDate ||
                    "Not selected"}
                </strong>
              </div>
            </div>

            <div className="success-detail">
              <Clock
                size={20}
              />

              <div>
                <span>
                  TIME
                </span>

                <strong>
                  {booking.selectedTime ||
                    "Not selected"}
                </strong>
              </div>
            </div>

            <div className="success-detail">
              <MapPin
                size={20}
              />

              <div>
                <span>
                  SERVICE ADDRESS
                </span>

                <strong>
                  {booking.address ||
                    "Address not available"}
                </strong>
              </div>
            </div>

            {customer.name && (
              <div className="success-detail">
                <Home
                  size={20}
                />

                <div>
                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {customer.name}
                  </strong>
                </div>
              </div>
            )}

          </div>

          {/* TOTAL */}
          <div className="success-total">
            <span>
              Total amount
            </span>

            <strong>
              ₹{total}
            </strong>
          </div>

          {/* ACTIONS */}
          <div className="success-actions">

            <Link
              to="/bookings"
              className="success-primary-button"
            >
              View My Bookings
              <ArrowRight
                size={18}
              />
            </Link>

            <Link
              to="/services"
              className="success-secondary-button"
            >
              Book Another Service
            </Link>

          </div>

        </div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .success-page {
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

        .success-header {
          height: 74px;
          padding: 0 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,.96);
          border-bottom: 1px solid #e7e7e2;
        }

        .success-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #171717;
        }

        .success-logo {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: #171717;
          color: white;
          font-weight: 800;
          font-size: 18px;
        }

        .success-brand strong {
          display: block;
          font-size: 17px;
          line-height: 1;
        }

        .success-brand span {
          display: block;
          margin-top: 4px;
          color: #888;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .success-home-link {
          text-decoration: none;
          color: #555;
          font-size: 14px;
          font-weight: 600;
        }

        .success-main {
          min-height: calc(100vh - 74px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 55px 20px 70px;
        }

        .success-card {
          width: min(700px, 100%);
          background: white;
          border: 1px solid #e7e7e2;
          border-radius: 24px;
          padding: 42px;
          box-shadow:
            0 20px 55px rgba(0,0,0,.07);
        }

        .success-icon {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: grid;
          place-items: center;
          background: #eef8ef;
          color: #1d8a40;
        }

        .success-icon.warning {
          font-size: 42px;
          font-weight: 800;
          background: #fff4e6;
          color: #b96a00;
        }

        .success-eyebrow {
          display: block;
          text-align: center;
          color: #8f8f88;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .success-card h1 {
          margin: 9px 0 10px;
          text-align: center;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -.8px;
        }

        .success-description {
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
          color: #707070;
          line-height: 1.7;
          font-size: 15px;
        }

        .booking-id-box {
          margin-top: 28px;
          padding: 17px 20px;
          border-radius: 15px;
          background: #f7f7f5;
          border: 1px dashed #d7d7d1;
          text-align: center;
        }

        .booking-id-box span {
          display: block;
          font-size: 10px;
          color: #8c8c85;
          letter-spacing: 1.7px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .booking-id-box strong {
          font-size: 18px;
          letter-spacing: .5px;
        }

        .success-service {
          margin-top: 25px;
          padding: 18px;
          border: 1px solid #ecece7;
          border-radius: 17px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .success-service img,
        .success-service-placeholder {
          width: 86px;
          height: 70px;
          border-radius: 12px;
          object-fit: cover;
          background: #ecece7;
        }

        .success-service-placeholder {
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 24px;
        }

        .success-service > div:last-child {
          flex: 1;
        }

        .success-service span {
          font-size: 11px;
          color: #8a8a84;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        .success-service h2 {
          margin: 5px 0 6px;
          font-size: 20px;
        }

        .success-service strong {
          font-size: 15px;
        }

        .success-details {
          margin-top: 20px;
          border-top: 1px solid #ecece7;
          border-bottom: 1px solid #ecece7;
        }

        .success-detail {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 17px 3px;
          border-bottom: 1px solid #f0f0eb;
        }

        .success-detail:last-child {
          border-bottom: none;
        }

        .success-detail svg {
          margin-top: 2px;
          color: #555;
          flex-shrink: 0;
        }

        .success-detail span {
          display: block;
          color: #96968e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .success-detail strong {
          display: block;
          font-size: 14px;
          line-height: 1.5;
        }

        .success-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding: 18px 0;
        }

        .success-total span {
          color: #666;
          font-size: 15px;
        }

        .success-total strong {
          font-size: 26px;
        }

        .success-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .success-primary-button,
        .success-secondary-button {
          min-height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
        }

        .success-primary-button {
          flex: 1;
          background: #171717;
          color: white;
        }

        .success-secondary-button {
          flex: 1;
          border: 1px solid #dcdcd6;
          color: #222;
          background: white;
        }

        @media (max-width: 650px) {
          .success-card {
            padding: 28px 20px;
            border-radius: 19px;
          }

          .success-card h1 {
            font-size: 27px;
          }

          .success-actions {
            flex-direction: column;
          }

          .success-service img,
          .success-service-placeholder {
            width: 72px;
            height: 62px;
          }
        }
      `}</style>
    </div>
  );
}

export default BookingSuccess;