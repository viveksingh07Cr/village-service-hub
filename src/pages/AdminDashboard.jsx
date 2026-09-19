import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  CalendarDays,
  Wrench,
  IndianRupee,
  LogOut,
  Menu,
  CheckCircle2,
  Clock3,
  Trash2,
  Plus,
  X,
  Shield,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddService, setShowAddService] =
    useState(false);

  const [newServiceName, setNewServiceName] =
    useState("");

  const [newServiceCategory, setNewServiceCategory] =
    useState("Cleaning");

  const [newServicePrice, setNewServicePrice] =
    useState("");

  const [newServiceDescription, setNewServiceDescription] =
    useState("");

  const [newServiceImage, setNewServiceImage] =
    useState("");


  // =========================================
  // GET DATA FROM BACKEND
  // =========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "vshAdminToken"
        );

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(
            "vshAdminToken"
          );

          localStorage.removeItem(
            "vshAdmin"
          );

          navigate("/admin-login");
          return;
        }

        throw new Error(
          data.message ||
            "Could not load admin dashboard."
        );
      }

      setDashboardData(data);

    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.message ||
          "Could not connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {
    loadDashboard();

    const handleFocus = () => {
      loadDashboard();
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


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "vshAdminToken"
    );

    localStorage.removeItem(
      "vshAdmin"
    );

    localStorage.removeItem(
      "vshAdminLoggedIn"
    );

    navigate("/");
  };


  // =========================================
  // UPDATE BOOKING
  // =========================================

  const updateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem(
          "vshAdminToken"
        );

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
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

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Could not update booking."
        );

        return;
      }

      await loadDashboard();

    } catch (err) {
      console.error(
        "Booking update error:",
        err
      );

      alert(
        "Could not connect to the server."
      );
    }
  };


  // =========================================
  // ADD SERVICE
  // =========================================

  const addService = async (e) => {
    e.preventDefault();

    if (
      !newServiceName.trim() ||
      !newServicePrice
    ) {
      alert(
        "Please enter service name and price."
      );

      return;
    }

    try {
      const token =
        localStorage.getItem(
          "vshAdminToken"
        );

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/services",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: newServiceName.trim(),
            category:
              newServiceCategory,
            price:
              Number(newServicePrice),
            description:
              newServiceDescription.trim(),
            image:
              newServiceImage.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Could not add service."
        );

        return;
      }

      setNewServiceName("");
      setNewServiceCategory(
        "Cleaning"
      );
      setNewServicePrice("");
      setNewServiceDescription("");
      setNewServiceImage("");
      setShowAddService(false);

      await loadDashboard();

      alert(
        "Service added successfully!"
      );

    } catch (err) {
      console.error(
        "Add service error:",
        err
      );

      alert(
        "Could not connect to the server."
      );
    }
  };


  // =========================================
  // DELETE SERVICE
  // =========================================

  const deleteService = async (
    serviceId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this service?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "vshAdminToken"
        );

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/services/${serviceId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Could not delete service."
        );

        return;
      }

      await loadDashboard();

      alert(
        "Service deleted successfully!"
      );

    } catch (err) {
      console.error(
        "Delete service error:",
        err
      );

      alert(
        "Could not connect to the server."
      );
    }
  };


  // =========================================
  // SIDEBAR BUTTON
  // =========================================

  const sidebarButton = (
    tab,
    icon,
    text,
    count = 0
  ) => {
    return (
      <button
        className={
          activeTab === tab
            ? "admin-sidebar-link active"
            : "admin-sidebar-link"
        }

        onClick={() => {
          setActiveTab(tab);
          setMobileMenu(false);
        }}
      >
        {icon}

        <span>
          {text}
        </span>

        {count > 0 && (
          <b className="admin-sidebar-badge">
            {count}
          </b>
        )}
      </button>
    );
  };


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading && !dashboardData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
          background: "#f5f5f2",
        }}
      >
        <Clock3 size={40} />

        <h2>
          Loading Admin Dashboard...
        </h2>

        <p
          style={{
            color: "#777",
            fontSize: "13px",
          }}
        >
          Fetching data from MongoDB.
        </p>
      </div>
    );
  }


  // =========================================
  // SAFE DEFAULT DATA
  // =========================================

  const stats =
    dashboardData?.stats || {
      customers: 0,
      professionals: 0,
      bookings: 0,
      revenue: 0,
    };

  const activity =
    dashboardData?.activity || {
      pending: 0,
      accepted: 0,
      completed: 0,
    };

  const customers =
    dashboardData?.customers || [];

  const professionals =
    dashboardData?.professionals || [];

  const bookings =
    dashboardData?.bookings || [];

  const services =
    dashboardData?.services || [];


  return (
    <div className="admin-dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={
          mobileMenu
            ? "admin-sidebar open"
            : "admin-sidebar"
        }
      >

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-icon">
            <Shield size={19} />
          </div>

          <div>

            <strong>
              Village Service
            </strong>

            <span>
              Admin Panel
            </span>

          </div>

        </div>


        <nav>

          {sidebarButton(
            "dashboard",
            <LayoutDashboard size={18} />,
            "Dashboard"
          )}

          {sidebarButton(
            "customers",
            <Users size={18} />,
            "Customers",
            customers.length
          )}

          {sidebarButton(
            "professionals",
            <UserRoundCog size={18} />,
            "Professionals",
            professionals.length
          )}

          {sidebarButton(
            "bookings",
            <CalendarDays size={18} />,
            "Bookings",
            activity.pending
          )}

          {sidebarButton(
            "services",
            <Wrench size={18} />,
            "Services",
            services.length
          )}

        </nav>


        <div className="admin-sidebar-bottom">

          <button
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <button
            className="admin-mobile-menu"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            <Menu size={22} />
          </button>


          <div>

            <span>
              ADMIN CONTROL PANEL
            </span>

            <h1>

              {activeTab ===
                "dashboard" &&
                "Dashboard"}

              {activeTab ===
                "customers" &&
                "Customers"}

              {activeTab ===
                "professionals" &&
                "Professionals"}

              {activeTab ===
                "bookings" &&
                "Bookings"}

              {activeTab ===
                "services" &&
                "Services"}

            </h1>

          </div>


          <button
            className="admin-top-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </header>


        {/* ERROR */}

        {error && (
          <div
            style={{
              margin:
                "20px 35px 0",
              padding: "14px 16px",
              background: "#fff1f1",
              border:
                "1px solid #f0caca",
              color: "#a33",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}


        {/* =====================================
            DASHBOARD TAB
        ===================================== */}

        {activeTab ===
          "dashboard" && (

          <div className="admin-content">

            {/* STATS */}

            <section className="admin-stats">

              <div className="admin-stat">

                <Users size={20} />

                <span>
                  Total Customers
                </span>

                <strong>
                  {stats.customers}
                </strong>

              </div>


              <div className="admin-stat">

                <UserRoundCog
                  size={20}
                />

                <span>
                  Professionals
                </span>

                <strong>
                  {stats.professionals}
                </strong>

              </div>


              <div className="admin-stat">

                <CalendarDays size={20} />

                <span>
                  Total Bookings
                </span>

                <strong>
                  {stats.bookings}
                </strong>

              </div>


              <div className="admin-stat">

                <IndianRupee
                  size={20}
                />

                <span>
                  Completed Revenue
                </span>

                <strong>
                  ₹{stats.revenue}
                </strong>

              </div>

            </section>


            {/* OVERVIEW */}

            <section className="admin-overview-grid">

              <div className="admin-panel">

                <div className="admin-panel-heading">

                  <div>

                    <p>
                      BOOKING OVERVIEW
                    </p>

                    <h2>
                      Current activity
                    </h2>

                  </div>

                </div>


                <div className="activity-list">

                  <div>

                    <Clock3 size={18} />

                    <span>
                      Pending bookings
                    </span>

                    <strong>
                      {activity.pending}
                    </strong>

                  </div>


                  <div>

                    <CheckCircle2
                      size={18}
                    />

                    <span>
                      Accepted bookings
                    </span>

                    <strong>
                      {activity.accepted}
                    </strong>

                  </div>


                  <div>

                    <CheckCircle2
                      size={18}
                    />

                    <span>
                      Completed bookings
                    </span>

                    <strong>
                      {activity.completed}
                    </strong>

                  </div>

                </div>

              </div>


              <div className="admin-panel">

                <div className="admin-panel-heading">

                  <div>

                    <p>
                      PLATFORM
                    </p>

                    <h2>
                      Quick statistics
                    </h2>

                  </div>

                </div>


                <div className="quick-stat">

                  <span>
                    Available services
                  </span>

                  <strong>
                    {services.length}
                  </strong>

                </div>


                <div className="quick-stat">

                  <span>
                    Total customers
                  </span>

                  <strong>
                    {customers.length}
                  </strong>

                </div>


                <div className="quick-stat">

                  <span>
                    Total professionals
                  </span>

                  <strong>
                    {professionals.length}
                  </strong>

                </div>

              </div>

            </section>


            {/* RECENT BOOKINGS */}

            <section className="admin-panel admin-recent">

              <div className="admin-panel-heading">

                <div>

                  <p>
                    RECENT ACTIVITY
                  </p>

                  <h2>
                    Recent bookings
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setActiveTab(
                      "bookings"
                    )
                  }
                >
                  View all
                </button>

              </div>


              {bookings.length ===
              0 ? (

                <div className="admin-empty">

                  <CalendarDays
                    size={35}
                  />

                  <h3>
                    No bookings yet
                  </h3>

                  <p>
                    New bookings will
                    appear here.
                  </p>

                </div>

              ) : (

                <div className="admin-recent-list">

                  {bookings
                    .slice(0, 5)
                    .map(
                      (booking) => {

                        const service =
                          booking.service ||
                          {};

                        const customer =
                          booking.customer ||
                          {};

                        return (
                          <div
                            key={
                              booking.bookingId
                            }
                            className="admin-recent-item"
                          >

                            <div>

                              <strong>
                                {service.name ||
                                  "Service"}
                              </strong>

                              <span>
                                {customer.name ||
                                  "Customer"}
                              </span>

                            </div>


                            <div>

                              <strong>
                                ₹
                                {booking.total ||
                                  0}
                              </strong>

                              <span>
                                {booking.status}
                              </span>

                            </div>

                          </div>
                        );
                      }
                    )}

                </div>

              )}

            </section>

          </div>
        )}


        {/* =====================================
            CUSTOMERS TAB
        ===================================== */}

        {activeTab ===
          "customers" && (

          <div className="admin-content">

            <section className="admin-panel">

              <div className="admin-panel-heading">

                <div>

                  <p>
                    USERS
                  </p>

                  <h2>
                    Customer accounts
                  </h2>

                </div>

              </div>


              {customers.length ===
              0 ? (

                <div className="admin-empty">

                  <Users size={35} />

                  <h3>
                    No customers yet
                  </h3>

                  <p>
                    Registered customers will
                    appear here.
                  </p>

                </div>

              ) : (

                <div className="admin-table">

                  <div className="admin-table-header">

                    <span>
                      Customer
                    </span>

                    <span>
                      Email
                    </span>

                    <span>
                      Phone
                    </span>

                    <span>
                      Bookings
                    </span>

                  </div>


                  {customers.map(
                    (customer) => {

                      const customerBookings =
                        bookings.filter(
                          (booking) =>
                            booking.customer?._id ===
                              customer._id
                        );

                      return (
                        <div
                          className="admin-table-row"
                          key={
                            customer._id
                          }
                        >

                          <span>
                            <strong>
                              {customer.name}
                            </strong>
                          </span>

                          <span>
                            {customer.email}
                          </span>

                          <span>
                            {customer.phone}
                          </span>

                          <span>
                            {
                              customerBookings.length
                            }
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </section>

          </div>
        )}


        {/* =====================================
            PROFESSIONALS TAB
        ===================================== */}

        {activeTab ===
          "professionals" && (

          <div className="admin-content">

            <section className="admin-panel">

              <div className="admin-panel-heading">

                <div>

                  <p>
                    SERVICE PROVIDERS
                  </p>

                  <h2>
                    Professional accounts
                  </h2>

                </div>

              </div>


              {professionals.length ===
              0 ? (

                <div className="admin-empty">

                  <UserRoundCog
                    size={35}
                  />

                  <h3>
                    No professionals yet
                  </h3>

                  <p>
                    Registered professionals
                    will appear here.
                  </p>

                </div>

              ) : (

                <div className="admin-professional-list">

                  {professionals.map(
                    (professional) => (

                      <div
                        className="professional-admin-card"
                        key={
                          professional._id
                        }
                      >

                        <div className="professional-admin-avatar">

                          {professional.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>


                        <div className="professional-admin-info">

                          <h3>
                            {professional.name}
                          </h3>

                          <span>
                            {
                              professional.serviceCategory
                            }
                          </span>

                          <p>
                            {professional.email}
                          </p>

                          <p>
                            {professional.phone}
                          </p>

                        </div>


                        <div
                          className="professional-admin-status"
                          style={{
                            background:
                              professional.isApproved
                                ? "#e8f5eb"
                                : "#fff5dc",

                            color:
                              professional.isApproved
                                ? "#287c40"
                                : "#9b7000",
                          }}
                        >

                          <CheckCircle2
                            size={15}
                          />

                          {professional.isApproved
                            ? "Approved"
                            : "Pending"}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </div>
        )}


        {/* =====================================
            BOOKINGS TAB
        ===================================== */}

        {activeTab ===
          "bookings" && (

          <div className="admin-content">

            <section className="admin-panel">

              <div className="admin-panel-heading">

                <div>

                  <p>
                    ALL TRANSACTIONS
                  </p>

                  <h2>
                    Booking management
                  </h2>

                </div>

              </div>


              {bookings.length ===
              0 ? (

                <div className="admin-empty">

                  <CalendarDays
                    size={35}
                  />

                  <h3>
                    No bookings found
                  </h3>

                  <p>
                    Customer bookings will
                    appear here.
                  </p>

                </div>

              ) : (

                <div className="admin-booking-list">

                  {bookings.map(
                    (booking) => {

                      const service =
                        booking.service ||
                        {};

                      const customer =
                        booking.customer ||
                        {};

                      const professional =
                        booking.professional ||
                        null;

                      return (
                        <div
                          className="admin-booking-card"
                          key={
                            booking.bookingId
                          }
                        >

                          {service.image ? (

                            <img
                              src={
                                service.image
                              }
                              alt={
                                service.name
                              }
                            />

                          ) : (

                            <div
                              style={{
                                width: "80px",
                                height: "65px",
                                background:
                                  "#eeeeeb",
                                borderRadius:
                                  "7px",
                              }}
                            />

                          )}


                          <div className="admin-booking-info">

                            <div>

                              <small>
                                {
                                  service.category
                                }
                              </small>

                              <h3>
                                {
                                  service.name
                                }
                              </h3>

                              <span>
                                {
                                  customer.name ||
                                  "Customer"
                                }
                                {" · "}
                                {
                                  customer.phone ||
                                  "No phone"
                                }
                              </span>

                              <span
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                {professional
                                  ? `Professional: ${professional.name}`
                                  : "Professional: Not assigned"}
                              </span>

                            </div>

                            <strong>
                              ₹
                              {booking.total ||
                                0}
                            </strong>

                          </div>


                          <div className="admin-booking-status">

                            <span
                              className={`admin-status ${
                                booking.status
                                  ?.toLowerCase()
                              }`}
                            >
                              {
                                booking.status
                              }
                            </span>


                            <div className="admin-status-actions">

                              {booking.status !==
                                "Completed" &&
                                booking.status !==
                                  "Rejected" && (

                                  <button
                                    onClick={() =>
                                      updateBookingStatus(
                                        booking.bookingId,
                                        "Completed"
                                      )
                                    }
                                  >
                                    <CheckCircle2
                                      size={15}
                                    />

                                    Complete
                                  </button>

                              )}


                              {booking.status !==
                                "Rejected" &&
                                booking.status !==
                                  "Completed" && (

                                  <button
                                    onClick={() =>
                                      updateBookingStatus(
                                        booking.bookingId,
                                        "Rejected"
                                      )
                                    }
                                  >
                                    <X size={15} />

                                    Reject
                                  </button>

                              )}

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </section>

          </div>
        )}


        {/* =====================================
            SERVICES TAB
        ===================================== */}

        {activeTab ===
          "services" && (

          <div className="admin-content">

            <section className="admin-panel">

              <div className="admin-panel-heading">

                <div>

                  <p>
                    SERVICE CATALOGUE
                  </p>

                  <h2>
                    Manage services
                  </h2>

                </div>


                <button
                  className="add-service-button"
                  onClick={() =>
                    setShowAddService(
                      !showAddService
                    )
                  }
                >
                  <Plus size={16} />

                  Add Service
                </button>

              </div>


              {/* ADD SERVICE FORM */}

              {showAddService && (

                <form
                  className="add-service-form"
                  onSubmit={addService}
                >

                  <input
                    type="text"
                    placeholder="Service name"
                    value={
                      newServiceName
                    }
                    onChange={(e) =>
                      setNewServiceName(
                        e.target.value
                      )
                    }
                  />


                  <select
                    value={
                      newServiceCategory
                    }
                    onChange={(e) =>
                      setNewServiceCategory(
                        e.target.value
                      )
                    }
                  >

                    <option>
                      Cleaning
                    </option>

                    <option>
                      Repairs
                    </option>

                    <option>
                      Appliance
                    </option>

                    <option>
                      Beauty
                    </option>

                    <option>
                      Automobile
                    </option>

                    <option>
                      Home Care
                    </option>

                  </select>


                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={
                      newServicePrice
                    }
                    onChange={(e) =>
                      setNewServicePrice(
                        e.target.value
                      )
                    }
                  />


                  <input
                    type="text"
                    placeholder="Image URL"
                    value={
                      newServiceImage
                    }
                    onChange={(e) =>
                      setNewServiceImage(
                        e.target.value
                      )
                    }
                  />


                  <input
                    type="text"
                    placeholder="Short description"
                    value={
                      newServiceDescription
                    }
                    onChange={(e) =>
                      setNewServiceDescription(
                        e.target.value
                      )
                    }
                  />


                  <button
                    type="submit"
                  >
                    Add Service
                  </button>

                </form>

              )}


              {/* SERVICE LIST */}

              {services.length ===
              0 ? (

                <div className="admin-empty">

                  <Wrench size={35} />

                  <h3>
                    No services found
                  </h3>

                  <p>
                    Add your first service
                    using the button above.
                  </p>

                </div>

              ) : (

                <div className="admin-service-list">

                  {services.map(
                    (service) => (

                      <div
                        className="admin-service-row"
                        key={
                          service._id
                        }
                      >

                        <div className="admin-service-number">

                          {service.image ? (

                            <img
                              src={
                                service.image
                              }
                              alt={
                                service.name
                              }
                              style={{
                                width:
                                  "38px",
                                height:
                                  "38px",
                                borderRadius:
                                  "7px",
                                objectFit:
                                  "cover",
                              }}
                            />

                          ) : (

                            <Wrench
                              size={17}
                            />

                          )}

                        </div>


                        <div>

                          <strong>
                            {service.name}
                          </strong>

                          <span>
                            {
                              service.category
                            }
                          </span>

                        </div>


                        <strong>
                          ₹{service.price}
                        </strong>


                        <button
                          className="delete-service"
                          onClick={() =>
                            deleteService(
                              service._id
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;