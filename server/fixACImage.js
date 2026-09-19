require("dotenv").config();

const mongoose = require("mongoose");
const Service = require("./models/Service");

async function fixACImage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    const updated = await Service.findOneAndUpdate(
      { name: "AC Repair" },
      {
        $set: {
          image:
  "https://lirp.cdn-website.com/011734fc/dms3rep/multi/opt/1198778773-7f4c17c9-1920w.png",
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      console.log("AC Repair service not found.");
    } else {
      console.log("AC Repair image updated successfully.");
      console.log(updated.image);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixACImage();