import ProtectedRoute from "./ProtectedRoute";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import ProfessionalLogin from "./pages/ProfessionalLogin";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Star,
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Fan,
  Droplets,
} from "lucide-react";

const services = [
  {
    name: "Home Cleaning",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Plumbing",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Electrical",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Painting",
    icon: Paintbrush,
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Carpentry",
    icon: Hammer,
   image:
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "AC & Appliance",
    icon: Fan,
    image:
  "https://appliancecareservice.in/assets/images/service-ac.png",
  },
];

const popularServices = [
  {
    title: "Full Home Cleaning",
    price: "₹799",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bathroom Cleaning",
    price: "₹399",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Electrician Visit",
    price: "₹149",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Plumbing Service",
    price: "₹199",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
  },
];

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handlePopularBooking = async (serviceName) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/services"
    );

    if (!response.ok) {
      throw new Error("Could not load services.");
    }

    const servicesFromDatabase = await response.json();

    const service = servicesFromDatabase.find(
      (item) => item.name === serviceName
    );

    if (!service) {
      alert("This service is currently unavailable.");
      return;
    }

    navigate("/booking", {
      state: {
        service: {
          ...service,
          time:
            service.time ||
            (service.name === "Home Cleaning"
              ? "1-2 hrs"
              : service.name === "Electrician"
              ? "45-60 mins"
              : service.name === "Plumbing"
              ? "1 hr"
              : "60 mins"),
        },
      },
    });
  } catch (error) {
    console.error("Popular service booking error:", error);
    alert("Could not connect to the server.");
  }
};

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-mark">V</div>
          <div>
            <div className="logo-name">Village</div>
            <div className="logo-subtitle">SERVICE HUB</div>
          </div>
        </div>

        <div className="location">
          <MapPin size={19} />
          <div>
            <span className="location-label">Location</span>
            <strong>Palghar, Maharashtra</strong>
          </div>
          <ChevronDown size={17} />
        </div>

        <nav className="nav">
  <Link to="/">Home</Link>
  <Link to="/services">Services</Link>
  <a href="/#how">How it works</a>
  <a href="/#professionals">Professionals</a>
</nav>

        <Link to="/login" className="login-btn">
         Login
        </Link>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            Trusted local professionals
          </div>

          <h1>
            Your village.
            <br />
            <span>Our services.</span>
          </h1>

          <p className="hero-text">
            Book trusted professionals for cleaning, repairs, beauty,
            maintenance and more — right at your doorstep.
          </p>

          <div className="search-box">
            <Search size={22} />
            <input
              type="text"
              placeholder="What service do you need today?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>Search</button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            <button>Cleaning</button>
            <button>Plumber</button>
            <button>Electrician</button>
            <button>AC Repair</button>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85"
              alt="Professional home service"
            />

            <div className="floating-card">
              <div className="floating-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong>Verified Professionals</strong>
                <span>Background checked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div>
          <ShieldCheck size={24} />
          <div>
            <strong>Verified Professionals</strong>
            <span>Trusted local experts</span>
          </div>
        </div>

        <div>
          <Clock3 size={24} />
          <div>
            <strong>On-Time Service</strong>
            <span>We respect your time</span>
          </div>
        </div>

        <div>
          <Star size={24} />
          <div>
            <strong>Quality Assured</strong>
            <span>Rated by your community</span>
          </div>
        </div>

        <div>
          <Wrench size={24} />
          <div>
            <strong>Fair Pricing</strong>
            <span>Clear prices, no surprises</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT WE OFFER</span>
            <h2>Services for every home</h2>
          </div>
          <Link to="/services" className="view-all">
  View all <ArrowRight size={17} />
</Link>
        </div>

        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div className="service-card" key={service.name}>
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                  <div className="service-icon">
                    <Icon size={20} />
                  </div>
                </div>

                <div className="service-info">
                  <h3>{service.name}</h3>
                  <span>
                    Explore services <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OFFER */}
      <section className="offer-section">
        <div className="offer-content">
          <span className="eyebrow">WELCOME OFFER</span>
          <h2>Get ₹150 OFF your first booking</h2>
          <p>
            Discover reliable services from professionals in your local
            community.
          </p>
          <button className="offer-btn">
            Book your first service <ArrowRight size={18} />
          </button>
        </div>

        <div className="offer-decoration">
          <div className="offer-circle">₹150</div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MOST BOOKED</span>
            <h2>Popular services near you</h2>
          </div>
        </div>

        <div className="popular-grid">
          {popularServices.map((service) => (
            <div className="popular-card" key={service.title}>
              <img src={service.image} alt={service.title} />

              <div className="popular-info">
                <h3>{service.title}</h3>

                <div className="rating">
                  <Star size={15} fill="currentColor" />
                  {service.rating}
                </div>

                <div className="price-row">
  <strong>Starts at {service.price}</strong>

  <button
    type="button"
    onClick={() => {
      let serviceName = "";

      if (service.title === "Full Home Cleaning") {
        serviceName = "Home Cleaning";
      } else if (service.title === "Bathroom Cleaning") {
        serviceName = "Home Cleaning";
      } else if (service.title === "Electrician Visit") {
        serviceName = "Electrician";
      } else if (service.title === "Plumbing Service") {
        serviceName = "Plumbing";
      }

      handlePopularBooking(serviceName);
    }}
  >
    <ArrowRight size={17} />
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-heading centered">
          <div>
            <span className="eyebrow">SIMPLE & EASY</span>
            <h2>How Village Service Hub works</h2>
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Choose a service</h3>
            <p>Find the service you need from our wide range of categories.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Select a professional</h3>
            <p>Compare ratings, pricing and available professionals.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Book a convenient time</h3>
            <p>Choose a date and time that works for you.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">04</div>
            <h3>Relax, we handle it</h3>
            <p>Your professional arrives and gets the job done.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="professionals">
        <div>
          <span className="eyebrow">JOIN OUR COMMUNITY</span>
          <h2>Are you a skilled professional?</h2>
          <p>
            Grow your business by connecting with customers in your local
            area.
          </p>
        </div>

        <Link to="/professional-login" className="professional-cta-button">
           Become a professional
           <ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark">V</div>
              <div>
                <div className="logo-name">Village</div>
                <div className="logo-subtitle">SERVICE HUB</div>
              </div>
            </div>

            <p>
              Bringing trusted local services closer to every home.
            </p>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <a href="#services">Home Cleaning</a>
            <a href="#services">Plumbing</a>
            <a href="#services">Electrical</a>
            <a href="#services">Painting</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#how">About Us</a>
            <a href="#how">How it Works</a>
            <a href="#professionals">Professionals</a>
            <a href="#professionals">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <a href="#support">Help Center</a>
            <a href="#support">Safety</a>
            <a href="#support">Terms</a>
            <a href="#support">Privacy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Village Service Hub. All rights reserved.</span>
          <span>Made for local communities ❤️</span>
        </div>
      </footer>
    </div>
    );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PUBLIC SERVICES */}
        <Route
          path="/services"
          element={<Services />}
        />

        {/* CUSTOMER - PROTECTED */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute type="customer">
              <Booking />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC SUCCESS PAGE */}
        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />

        {/* PROFESSIONAL LOGIN */}
        <Route
          path="/professional-login"
          element={<ProfessionalLogin />}
        />

        {/* PROFESSIONAL DASHBOARD - PROTECTED */}
        <Route
          path="/professional"
          element={
            <ProtectedRoute type="professional">
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD - PROTECTED */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute type="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* CUSTOMER REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* CUSTOMER ACCOUNT - PROTECTED */}
        <Route
          path="/account"
          element={
            <ProtectedRoute type="customer">
              <Account />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER BOOKINGS - PROTECTED */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute type="customer">
              <MyBookings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
export default App;