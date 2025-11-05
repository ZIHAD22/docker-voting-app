const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Election = require("./models/Election");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const elections = [
  {
    title: "Prime Minister of Bangladesh 2025",
    type: "election",
    category: "National",
    status: "active",
    description: "Vote for the next Prime Minister of Bangladesh",
    icon: "🏛️",
    candidates: [
      {
        name: "Begum Khaleda Zia",
        party: "Bangladesh Nationalist Party (BNP)",
        image: "👩‍💼",
        votes: 0,
        color: "#006A4E",
      },
      {
        name: "Sheikh Hasina",
        party: "Bangladesh Awami League",
        image: "👩‍💼",
        votes: 0,
        color: "#DC143C",
      },
      {
        name: "Dr. Kamal Hossain",
        party: "Gono Forum",
        image: "👨‍💼",
        votes: 0,
        color: "#FF6B35",
      },
      {
        name: "Raushan Ershad",
        party: "Jatiya Party",
        image: "👩‍💼",
        votes: 0,
        color: "#F7B801",
      },
    ],
  },
  {
    title: "Dhaka City Mayor Election",
    type: "election",
    category: "Local",
    status: "active",
    description: "Vote for the Mayor of Dhaka City Corporation",
    icon: "🏙️",
    candidates: [
      {
        name: "Atiqul Islam",
        party: "Awami League",
        image: "👨‍💼",
        votes: 0,
        color: "#006A4E",
      },
      {
        name: "Tabith Awal",
        party: "BNP",
        image: "👨‍💼",
        votes: 0,
        color: "#DC143C",
      },
      {
        name: "Independent Candidate",
        party: "Independent",
        image: "👤",
        votes: 0,
        color: "#6C757D",
      },
    ],
  },
  {
    title: "Most Popular Leader in Bangladesh",
    type: "poll",
    category: "Opinion Poll",
    status: "active",
    description: "Who do you think is the most popular leader?",
    icon: "📊",
    candidates: [
      {
        name: "Begum Khaleda Zia",
        party: "BNP Chairperson",
        image: "👩‍💼",
        votes: 0,
        color: "#006A4E",
      },
      {
        name: "Sheikh Hasina",
        party: "AL President",
        image: "👩‍💼",
        votes: 0,
        color: "#DC143C",
      },
      {
        name: "Tarique Rahman",
        party: "BNP Acting Chairman",
        image: "👨‍💼",
        votes: 0,
        color: "#FF6B35",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await Election.deleteMany();
    await Election.insertMany(elections);
    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
