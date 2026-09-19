import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  ArrowRight,
  Home,
  Wrench,
  Droplets,
  Snowflake,
  Scissors,
  Car,
  Bug,
  Waves,
} from "lucide-react";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageMap = {
    "Home Cleaning":
      "https://cafefcdn.com/203337114487263232/2025/4/26/don-dep-nha-cua-tet-lap-ha-17454310336061110296198-1745569549627-17455695497051047585648-1745657101944-17456571026071608145028.png",
    Electrician:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=85",
    Plumbing:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85",
    "AC Repair":
      "https://appliancecareservice.in/assets/images/service-ac.png",
    "Salon at Home":
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
    "Car Washing":
      "https://images.unsplash.com/photo-1683647115932-b33455fe6a3e?auto=format&fit=crop&w=900&q=85",
    "Pest Control":
      "https://images.squarespace-cdn.com/content/v1/66a8f773cb11d561620c7fa2/897dab45-610e-415c-95b2-a3cf23c6c3fc/pest-inspections.jpg",
    "Water Tank Cleaning":
      "https://static.readdy.ai/image/c61c43d626627dd077148c0c867066d5/3dd2f5d595a386c624120fabaece0a7c.png",
  };

  const iconMap = {
    "Home Cleaning": Home,
    Electrician: Wrench,
    Plumbing: Droplets,
    "AC Repair": Snowflake,
    "Salon at Home": Scissors,
    "Car Washing": Car,
    "Pest Control": Bug,
    "Water Tank Cleaning": Waves,
  };

  const timeMap = {
    "Home Cleaning": "1-2 hrs",
    Electrician: "45-60 mins",
    Plumbing: "1 hr",
    "AC Repair": "1-2 hrs",
    "Salon at Home": "1 hr",
    "Car Washing": "45 mins",
    "Pest Control": "1-2 hrs",
    "Water Tank Cleaning": "2-4 hrs",
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://192.168.1.35:5000/api/services"
        );

        if (!response.ok) {
          throw new Error("Could not load services.");
        }

        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Services loading error:", err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [services]);

  const filteredServices = services.filter((service) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      service.name?.toLowerCase().includes(searchValue) ||
      service.category?.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const prepareService = (service) => ({
    ...service,
    image:
      imageMap[service.name] ||
      service.image ||
      imageMap["Home Cleaning"],
    time:
      service.time ||
      timeMap[service.name] ||
      "60 mins",
    rating: service.rating ?? 4.7,
    reviews: service.reviews ?? 0,
  });

  if (loading) {
    return (
      <div className="vsh-services-page">
        <div className="vsh-services-loading">Loading services...</div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="vsh-services-page">
      <style>{styles}</style>

      <header className="vsh-services-header">
        <Link to="/" className="vsh-brand">
          <div className="vsh-brand-mark">V</div>
          <div>
            <strong>Village</strong>
            <span>SERVICE HUB</span>
          </div>
        </Link>

        <Link to="/" className="vsh-home-link">
          Home
        </Link>
      </header>

      <main className="vsh-services-main">
        <div className="vsh-services-heading">
          <div>
            <div className="vsh-eyebrow">OUR SERVICES</div>
            <h1>Services for every home</h1>
            <p>
              Find trusted professionals for everyday services in your village.
            </p>
          </div>

          <div className="vsh-search-box">
            <Search size={19} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
            />
          </div>
        </div>

        <div className="vsh-category-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "vsh-category active"
                  : "vsh-category"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {error ? (
          <div className="vsh-error">
            <h3>{error}</h3>
            <p>Make sure the backend is running on port 5000.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="vsh-empty">
            <h2>No services found</h2>
            <p>Try another search or category.</p>
          </div>
        ) : (
          <div className="vsh-service-grid">
            {filteredServices.map((rawService) => {
              const service = prepareService(rawService);
              const Icon = iconMap[service.name] || Wrench;

              return (
                <article
                  className="vsh-service-card"
                  key={service._id || service.id || service.name}
                >
                  <div className="vsh-service-image">
                    <img
                      src={service.image}
                      alt={service.name}
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = "true";
                        e.currentTarget.src =
                          "https://appliancecareservice.in/assets/images/service-ac.png";
                      }}
                    />

                    <div className="vsh-service-category">
                      {service.category}
                    </div>

                    <div className="vsh-service-icon">
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="vsh-service-info">
                    <h2>{service.name}</h2>

                    <div className="vsh-rating">
                      <Star size={15} fill="currentColor" />
                      <strong>{service.rating}</strong>
                      <span>({service.reviews || 0})</span>
                    </div>

                    <div className="vsh-duration">
                      <Clock size={15} />
                      <span>{service.time}</span>
                    </div>

                    <div className="vsh-divider" />

                    <div className="vsh-card-bottom">
                      <div className="vsh-price-block">
                        <span>Starting from</span>
                        <strong>₹{Number(service.price || 0)}</strong>
                      </div>

                      <Link
                        to="/booking"
                        state={{ service }}
                        className="vsh-book-button"
                      >
                        Book Now
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = `
  .vsh-services-page {
    min-height: 100vh;
    background: #f7f7f5;
    color: #171717;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .vsh-services-header {
    height: 74px;
    padding: 0 6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,.95);
    border-bottom: 1px solid #e9e9e5;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .vsh-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    color: #171717;
    text-decoration: none;
  }

  .vsh-brand-mark {
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

  .vsh-brand strong,
  .vsh-brand span {
    display: block;
  }

  .vsh-brand strong {
    font-size: 17px;
    line-height: 1;
  }

  .vsh-brand span {
    margin-top: 4px;
    font-size: 9px;
    letter-spacing: 2px;
    color: #888;
  }

  .vsh-home-link {
    text-decoration: none;
    color: #555;
    font-size: 14px;
    font-weight: 600;
  }

  .vsh-services-main {
    width: min(1320px, 92%);
    margin: 0 auto;
    padding: 45px 0 70px;
  }

  .vsh-services-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 24px;
  }

  .vsh-eyebrow {
    font-size: 11px;
    letter-spacing: 2.4px;
    font-weight: 800;
    color: #9a9a93;
    margin-bottom: 10px;
  }

  .vsh-services-heading h1 {
    margin: 0;
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.08;
    letter-spacing: -1px;
  }

  .vsh-services-heading p {
    margin: 10px 0 0;
    color: #777;
    font-size: 15px;
  }

  .vsh-search-box {
    width: min(390px, 100%);
    height: 54px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 17px;
    background: #fff;
    border: 1px solid #e7e7e3;
    border-radius: 14px;
    box-shadow: 0 5px 18px rgba(0,0,0,.04);
    box-sizing: border-box;
  }

  .vsh-search-box svg {
    color: #8b8b85;
    flex: 0 0 auto;
  }

  .vsh-search-box input {
    width: 100%;
    border: 0;
    outline: none;
    font: inherit;
    color: #222;
    background: transparent;
  }

  .vsh-category-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }

  .vsh-category {
    border: 1px solid #deded9;
    background: #fff;
    color: #555;
    border-radius: 999px;
    padding: 9px 17px;
    font-size: 13px;
    cursor: pointer;
    transition: .2s ease;
  }

  .vsh-category:hover,
  .vsh-category.active {
    background: #171717;
    color: #fff;
    border-color: #171717;
  }

  .vsh-service-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  .vsh-service-card {
    background: #fff;
    border: 1px solid #e1e1dc;
    border-radius: 17px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,.035);
  }

  .vsh-service-image {
    position: relative;
    height: 185px;
    background: #efefeb;
    overflow: hidden;
  }

  .vsh-service-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .vsh-service-category {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255,255,255,.96);
    color: #202020;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 5px 12px rgba(0,0,0,.08);
  }

  .vsh-service-icon {
    position: absolute;
    left: 12px;
    bottom: 12px;
    width: 40px;
    height: 40px;
    border-radius: 11px;
    background: rgba(255,255,255,.98);
    display: grid;
    place-items: center;
    color: #171717;
    box-shadow: 0 7px 17px rgba(0,0,0,.1);
  }

  .vsh-service-info {
    padding: 18px 17px 16px;
  }

  .vsh-service-info h2 {
    margin: 0;
    min-height: 26px;
    font-size: 19px;
    line-height: 1.25;
    letter-spacing: -.2px;
  }

  .vsh-rating,
  .vsh-duration {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
  }

  .vsh-rating {
    margin-top: 11px;
    color: #f2ab00;
  }

  .vsh-rating strong {
    color: #303030;
    font-size: 12px;
  }

  .vsh-rating span {
    color: #8a8a84;
  }

  .vsh-duration {
    margin-top: 20px;
    color: #7b7b75;
  }

  .vsh-divider {
    height: 1px;
    margin: 13px 0 13px;
    background: #ecece8;
  }

  .vsh-card-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
  }

  .vsh-price-block span {
    display: block;
    color: #8c8c86;
    font-size: 10px;
    margin-bottom: 4px;
  }

  .vsh-price-block strong {
    display: block;
    color: #171717;
    font-size: 18px;
    line-height: 1;
  }

  .vsh-book-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 13px;
    border-radius: 9px;
    background: #171717;
    color: #fff;
    text-decoration: none;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
    transition: transform .18s ease, background .18s ease;
  }

  .vsh-book-button:hover {
    transform: translateY(-1px);
    background: #2b2b2b;
  }

  .vsh-services-loading,
  .vsh-empty,
  .vsh-error {
    min-height: 60vh;
    display: grid;
    place-items: center;
    align-content: center;
    text-align: center;
    padding: 40px;
  }

  .vsh-error button {
    margin-top: 10px;
    padding: 10px 16px;
    border: 0;
    border-radius: 9px;
    background: #171717;
    color: #fff;
    cursor: pointer;
  }

  @media (max-width: 1050px) {
    .vsh-service-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .vsh-services-header {
      padding: 0 4%;
    }

    .vsh-services-main {
      width: 92%;
      padding-top: 30px;
    }

    .vsh-services-heading {
      align-items: stretch;
      flex-direction: column;
    }

    .vsh-search-box {
      width: 100%;
    }

    .vsh-service-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .vsh-service-image {
      height: 165px;
    }
  }

  @media (max-width: 480px) {
    .vsh-service-grid {
      grid-template-columns: 1fr;
    }

    .vsh-service-image {
      height: 205px;
    }
  }
`;

export default Services;
