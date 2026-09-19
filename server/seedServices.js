require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./models/Service");

const services = [
  {
    name: "Home Cleaning",
    category: "Cleaning",
    price: 299,
    description: "Professional home cleaning service for rooms, kitchens and common areas.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 124,
    isActive: true,
  },
  {
    name: "Electrician",
    category: "Repairs",
    price: 199,
    description: "Electrical repair, switch, wiring, fan and appliance installation services.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 98,
    isActive: true,
  },
  {
    name: "Plumbing",
    category: "Repairs",
    price: 249,
    description: "Tap, pipe, leakage, bathroom and general plumbing repair services.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 112,
    isActive: true,
  },
  {
    name: "AC Repair",
    category: "Appliance",
    price: 499,
    description: "Professional AC repair and servicing.",
    image:
      "https://images.unsplash.com/photo-1631545806609-3e5c5b8b9e3f?auto=format&fit=crop&w=800&q=85",
    rating: 4.8,
    reviews: 124,
    isActive: true,
  },
  {
    name: "Salon at Home",
    category: "Beauty",
    price: 349,
    description: "Convenient salon and grooming services at your doorstep.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 156,
    isActive: true,
  },
  {
    name: "Car Washing",
    category: "Automobile",
    price: 299,
    description: "Exterior and basic interior car cleaning at your home.",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 73,
    isActive: true,
  },
  {
    name: "Pest Control",
    category: "Home Care",
    price: 499,
    description: "Professional pest-control treatment for common household pests.",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 64,
    isActive: true,
  },
  {
    name: "Water Tank Cleaning",
    category: "Cleaning",
    price: 599,
    description: "Professional cleaning and maintenance of residential water tanks.",
    image:
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 52,
    isActive: true,
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    for (const service of services) {
      await Service.findOneAndUpdate(
        { name: service.name },
        service,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`Service ready: ${service.name}`);
    }

    console.log("All default services have been added.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedServices();