import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const service = location.state?.service;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [dates, setDates] = useState([]);

  const times = [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
    "6:00 PM",
    "7:30 PM",
  ];

  useEffect(() => {
    const generatedDates = Array.from(
      { length: 5 },
      (_, index) => {
        const date = new Date();

        date.setDate(date.getDate() + index);

        const dayName = date.toLocaleDateString("en-IN", {
          weekday: "long",
        });

        const formattedDate = date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });

        return {
          day:
            index === 0
              ? "Today"
              : index === 1
              ? "Tomorrow"
              : dayName,
          date: formattedDate,
        };
      }
    );

    setDates(generatedDates);
  }, []);

  if (!service) {
    return (
      <div className="booking-error">
        <h2>Service not found</h2>
        <p>Please select a service before booking.</p>
        <Link to="/services">Browse Services</Link>
      </div>
    );
  }

  const servicePrice = Number(service.price || 0);
  const platformFee = 20;
  const taxes = Math.round(servicePrice * 0.05);
  const total = servicePrice + platformFee + taxes;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedTime ||
      !address.trim() ||
      !name.trim() ||
      !phone.trim()
    ) {
      alert("Please fill in all booking details.");
      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("vshUser") || "null"
    );

    const token = localStorage.getItem("vshToken");

    if (!savedUser?.id || !token) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    const serviceId = service._id || service.id;

    if (!serviceId) {
      alert("This service is missing its database ID.");
      navigate("/services");
      return;
    }

    try {
      const response = await fetch(
        "/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId,

            service: {
              name: service.name,
              category: service.category,
              price: service.price,
              image: service.image,
              rating: service.rating,
              reviews: service.reviews,
              time: service.time,
            },

            selectedDate,
            selectedTime,
            address: address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Booking failed."
        );
      }

      navigate("/booking-success", {
        state: {
          booking: data.booking,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error.message ||
          "Something went wrong while creating the booking."
      );
    }
  };

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div className="booking-header-inner">
          <Link
            to="/services"
            className="booking-back"
          >
            <ArrowLeft size={20} />
            Back to Services
          </Link>

          <strong>Village Service Hub</strong>
        </div>
      </header>

      <main className="booking-container">
        <section className="booking-left">
          <div className="booking-breadcrumb">
            Services
            <span>/</span>
            {service.name}
          </div>

          <div className="booking-service-card">
            <img
              src={service.image}
              alt={service.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="booking-service-info">
              <span className="booking-category">
                {service.category}
              </span>

              <h1>{service.name}</h1>

              <div className="booking-rating">
                <Star
                  size={17}
                  fill="currentColor"
                />

                <strong>
                  {service.rating ?? 4.7}
                </strong>

                <span>
                  ({service.reviews ?? 0} reviews)
                </span>
              </div>

              <p>
                Professional and reliable service from
                trusted local service providers.
              </p>

              <div className="booking-service-meta">
                <span>
                  <Clock size={17} />
                  {service.time || "60 mins"}
                </span>

                <span>
                  <ShieldCheck size={17} />
                  Verified Professional
                </span>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <div className="booking-title">
              <CalendarDays size={22} />

              <div>
                <h2>Select date</h2>
                <p>Choose a convenient date</p>
              </div>
            </div>

            <div className="date-grid">
              {dates.map((item) => (
                <button
                  key={item.date}
                  className={
                    selectedDate === item.date
                      ? "date-option selected"
                      : "date-option"
                  }
                  onClick={() =>
                    setSelectedDate(item.date)
                  }
                  type="button"
                >
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="booking-section">
            <div className="booking-title">
              <Clock size={22} />

              <div>
                <h2>Select time</h2>
                <p>Choose your preferred time</p>
              </div>
            </div>

            <div className="time-grid">
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={
                    selectedTime === time
                      ? "time-option selected"
                      : "time-option"
                  }
                  onClick={() =>
                    setSelectedTime(time)
                  }
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="booking-section">
            <div className="booking-title">
              <MapPin size={22} />

              <div>
                <h2>Your details</h2>
                <p>
                  Where should the professional visit?
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Your name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Phone number</label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-field">
              <label>Service address</label>

              <textarea
                rows="4"
                placeholder="House number, village, landmark..."
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <aside className="booking-summary">
          <h2>Booking summary</h2>

          <div className="summary-service">
            <img
              src={service.image}
              alt={service.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div>
              <strong>{service.name}</strong>
              <span>{service.category}</span>
            </div>
          </div>

          <div className="summary-line">
            <span>Service price</span>
            <strong>₹{servicePrice}</strong>
          </div>

          <div className="summary-line">
            <span>Platform fee</span>
            <strong>₹{platformFee}</strong>
          </div>

          <div className="summary-line">
            <span>Taxes</span>
            <strong>₹{taxes}</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            type="button"
            className="confirm-booking"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>

          <div className="secure-booking">
            <ShieldCheck size={18} />

            <span>
              Your booking is secure and your
              information is protected.
            </span>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Booking;
