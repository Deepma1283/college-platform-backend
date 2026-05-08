import { PrismaClient, CollegeType, CourseCategory, ExamType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.predictorRule.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const colleges = [
    // ── IITs ────────────────────────────────────────────────────────────────
    {
      name: "IIT Bombay",
      slug: "iit-bombay",
      location: "Powai, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      fees: 230000,
      rating: 4.9,
      placementPercent: 98,
      avgPackage: 2500000,
      highestPackage: 25000000,
      established: 1958,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "Premier engineering institute ranked #1 in India consistently.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 230000, seats: 120, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Electrical Engineering", duration: "4 years", fees: 230000, seats: 80, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Mechanical Engineering", duration: "4 years", fees: 230000, seats: 80, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_ADVANCED, branch: "Computer Science", rankMin: 1, rankMax: 65, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Electrical Engineering", rankMin: 66, rankMax: 250, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Mechanical Engineering", rankMin: 251, rankMax: 600, year: 2023 },
      ],
      reviews: [
        { author: "Rahul Sharma", rating: 5, content: "Best infrastructure and placements in India. The culture of innovation is unmatched.", batch: "2023" },
        { author: "Priya Mehta", rating: 5, content: "Incredible faculty and research opportunities. Placements are top-notch.", batch: "2022" },
      ],
    },
    {
      name: "IIT Delhi",
      slug: "iit-delhi",
      location: "Hauz Khas, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 225000,
      rating: 4.8,
      placementPercent: 97,
      avgPackage: 2200000,
      highestPackage: 22000000,
      established: 1961,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "Top engineering institute in the capital with strong industry ties.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 225000, seats: 100, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Civil Engineering", duration: "4 years", fees: 225000, seats: 60, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Chemical Engineering", duration: "4 years", fees: 225000, seats: 60, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_ADVANCED, branch: "Computer Science", rankMin: 1, rankMax: 100, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Civil Engineering", rankMin: 500, rankMax: 1200, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Chemical Engineering", rankMin: 800, rankMax: 1500, year: 2023 },
      ],
      reviews: [
        { author: "Ankit Gupta", rating: 5, content: "Being in Delhi gives amazing networking and internship opportunities.", batch: "2023" },
        { author: "Sneha Iyer", rating: 4, content: "Great faculty. Campus life could be more vibrant but academics are world-class.", batch: "2022" },
      ],
    },
    {
      name: "IIT Madras",
      slug: "iit-madras",
      location: "Adyar, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 220000,
      rating: 4.8,
      placementPercent: 96,
      avgPackage: 2100000,
      highestPackage: 20000000,
      established: 1959,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "Ranked #1 by NIRF for 5 consecutive years with exceptional research output.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 220000, seats: 90, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Aerospace Engineering", duration: "4 years", fees: 220000, seats: 50, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Biotechnology", duration: "4 years", fees: 220000, seats: 40, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_ADVANCED, branch: "Computer Science", rankMin: 1, rankMax: 120, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Aerospace Engineering", rankMin: 600, rankMax: 1400, year: 2023 },
      ],
      reviews: [
        { author: "Karthik R", rating: 5, content: "Research opportunities are unmatched. Beautiful green campus inside Chennai city.", batch: "2023" },
      ],
    },
    {
      name: "IIT Kharagpur",
      slug: "iit-kharagpur",
      location: "Kharagpur, West Bengal",
      city: "Kharagpur",
      state: "West Bengal",
      fees: 215000,
      rating: 4.7,
      placementPercent: 95,
      avgPackage: 1900000,
      highestPackage: 18000000,
      established: 1951,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "Oldest and largest IIT with a sprawling 2100-acre campus.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 215000, seats: 110, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Mining Engineering", duration: "4 years", fees: 215000, seats: 45, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_ADVANCED, branch: "Computer Science", rankMin: 100, rankMax: 400, year: 2023 },
        { exam: ExamType.JEE_ADVANCED, branch: "Mining Engineering", rankMin: 3000, rankMax: 6000, year: 2023 },
      ],
      reviews: [
        { author: "Subhajit Das", rating: 4, content: "Massive campus, great alumni network. Remote location takes adjustment.", batch: "2022" },
      ],
    },

    // ── NITs ─────────────────────────────────────────────────────────────────
    {
      name: "NIT Trichy",
      slug: "nit-trichy",
      location: "Tiruchirappalli, Tamil Nadu",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      fees: 165000,
      rating: 4.5,
      placementPercent: 93,
      avgPackage: 1400000,
      highestPackage: 12000000,
      established: 1964,
      affiliation: "National Institute of Technology",
      description: "Consistently the top-ranked NIT in India with excellent placements.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 165000, seats: 120, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Electronics & Communication", duration: "4 years", fees: 165000, seats: 100, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Mechanical Engineering", duration: "4 years", fees: 165000, seats: 90, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 1000, rankMax: 4500, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Electronics & Communication", rankMin: 4500, rankMax: 9000, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Mechanical Engineering", rankMin: 9000, rankMax: 18000, year: 2023 },
      ],
      reviews: [
        { author: "Vijay Kumar", rating: 5, content: "Best NIT for placements. Core and IT companies both recruit heavily.", batch: "2023" },
        { author: "Meena S", rating: 4, content: "Faculty is experienced. Hostel facilities are decent. Great peer group.", batch: "2022" },
      ],
    },
    {
      name: "NIT Warangal",
      slug: "nit-warangal",
      location: "Warangal, Telangana",
      city: "Warangal",
      state: "Telangana",
      fees: 155000,
      rating: 4.4,
      placementPercent: 91,
      avgPackage: 1300000,
      highestPackage: 11000000,
      established: 1959,
      affiliation: "National Institute of Technology",
      description: "One of the oldest NITs with strong industry connections in Hyderabad corridor.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 155000, seats: 110, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Civil Engineering", duration: "4 years", fees: 155000, seats: 80, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 3000, rankMax: 7000, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Civil Engineering", rankMin: 15000, rankMax: 28000, year: 2023 },
      ],
      reviews: [
        { author: "Ramesh T", rating: 4, content: "Excellent CS department. Campus is green and well-maintained.", batch: "2023" },
      ],
    },
    {
      name: "NIT Surathkal",
      slug: "nit-surathkal",
      location: "Surathkal, Karnataka",
      city: "Mangalore",
      state: "Karnataka",
      fees: 158000,
      rating: 4.3,
      placementPercent: 90,
      avgPackage: 1250000,
      highestPackage: 10500000,
      established: 1960,
      affiliation: "National Institute of Technology",
      description: "Top NIT on the western coast with strong engineering programs.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 158000, seats: 100, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Information Technology", duration: "4 years", fees: 158000, seats: 60, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 4000, rankMax: 9500, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Information Technology", rankMin: 9500, rankMax: 16000, year: 2023 },
      ],
      reviews: [
        { author: "Aditya Bhat", rating: 4, content: "Coastal location is a huge plus. Solid academics and placement record.", batch: "2022" },
      ],
    },

    // ── Deemed / Private ─────────────────────────────────────────────────────
    {
      name: "BITS Pilani",
      slug: "bits-pilani",
      location: "Pilani, Rajasthan",
      city: "Pilani",
      state: "Rajasthan",
      fees: 560000,
      rating: 4.6,
      placementPercent: 95,
      avgPackage: 1800000,
      highestPackage: 20000000,
      established: 1964,
      affiliation: "Deemed University",
      description: "Premier private engineering university known for its practice school program.",
      type: CollegeType.DEEMED,
      courses: [
        { name: "B.E. Computer Science", duration: "4 years", fees: 560000, seats: 180, category: CourseCategory.ENGINEERING },
        { name: "B.E. Electronics", duration: "4 years", fees: 560000, seats: 150, category: CourseCategory.ENGINEERING },
        { name: "M.Sc. Mathematics", duration: "5 years", fees: 480000, seats: 60, category: CourseCategory.SCIENCE },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 500, rankMax: 3500, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Electronics", rankMin: 3500, rankMax: 8000, year: 2023 },
      ],
      reviews: [
        { author: "Arjun Nair", rating: 5, content: "Practice School internships at top companies set BITS apart from any other private college.", batch: "2023" },
        { author: "Divya Sharma", rating: 4, content: "Campus life is vibrant. Fees are high but ROI is excellent.", batch: "2022" },
      ],
    },
    {
      name: "VIT Vellore",
      slug: "vit-vellore",
      location: "Vellore, Tamil Nadu",
      city: "Vellore",
      state: "Tamil Nadu",
      fees: 450000,
      rating: 4.1,
      placementPercent: 85,
      avgPackage: 750000,
      highestPackage: 8000000,
      established: 1984,
      affiliation: "Deemed University",
      description: "Large private university with strong industry tie-ups and good campus placements.",
      type: CollegeType.DEEMED,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 450000, seats: 600, category: CourseCategory.ENGINEERING },
        { name: "B.Tech ECE", duration: "4 years", fees: 430000, seats: 400, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Biomedical Engineering", duration: "4 years", fees: 410000, seats: 120, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 15000, rankMax: 80000, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "ECE", rankMin: 30000, rankMax: 120000, year: 2023 },
      ],
      reviews: [
        { author: "Pooja Krishnan", rating: 4, content: "Good placements for CS. International exposure is a major highlight.", batch: "2023" },
        { author: "Saurabh Mishra", rating: 3, content: "Very commercialised but the brand name helps in placements.", batch: "2022" },
      ],
    },
    {
      name: "DTU Delhi",
      slug: "dtu-delhi",
      location: "Rohini, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 180000,
      rating: 4.2,
      placementPercent: 92,
      avgPackage: 1200000,
      highestPackage: 10000000,
      established: 1941,
      affiliation: "State University",
      description: "Top state engineering university in Delhi with excellent placement record.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 180000, seats: 180, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Software Engineering", duration: "4 years", fees: 180000, seats: 90, category: CourseCategory.ENGINEERING },
        { name: "B.Tech Environmental Engineering", duration: "4 years", fees: 175000, seats: 60, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 5000, rankMax: 12000, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "Software Engineering", rankMin: 12000, rankMax: 22000, year: 2023 },
      ],
      reviews: [
        { author: "Rohan Verma", rating: 4, content: "Delhi location is great for internships. Strong alumni network in top MNCs.", batch: "2023" },
      ],
    },
    {
      name: "NSUT Delhi",
      slug: "nsut-delhi",
      location: "Dwarka, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 95000,
      rating: 4.0,
      placementPercent: 88,
      avgPackage: 900000,
      highestPackage: 7500000,
      established: 2018,
      affiliation: "State University",
      description: "Netaji Subhas University of Technology — emerging Delhi state university with good CS placements.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 95000, seats: 200, category: CourseCategory.ENGINEERING },
        { name: "B.Tech IT", duration: "4 years", fees: 95000, seats: 120, category: CourseCategory.ENGINEERING },
      ],
      rules: [
        { exam: ExamType.JEE_MAIN, branch: "Computer Science", rankMin: 10000, rankMax: 25000, year: 2023 },
        { exam: ExamType.JEE_MAIN, branch: "IT", rankMin: 25000, rankMax: 45000, year: 2023 },
      ],
      reviews: [
        { author: "Isha Malik", rating: 4, content: "Affordable fees with great placements. The CS batch is very competitive.", batch: "2023" },
      ],
    },

    // ── IIMs ─────────────────────────────────────────────────────────────────
    {
      name: "IIM Ahmedabad",
      slug: "iim-ahmedabad",
      location: "Vastrapur, Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      fees: 2400000,
      rating: 4.9,
      placementPercent: 100,
      avgPackage: 3500000,
      highestPackage: 80000000,
      established: 1961,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "India's premier management institute with global recognition.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "MBA (PGP)", duration: "2 years", fees: 2400000, seats: 400, category: CourseCategory.MANAGEMENT },
        { name: "MBA (PGPX)", duration: "1 year", fees: 2800000, seats: 80, category: CourseCategory.MANAGEMENT },
      ],
      rules: [
        { exam: ExamType.CAT, branch: "MBA", rankMin: 1, rankMax: 50, year: 2023 },
      ],
      reviews: [
        { author: "Arun Joshi", rating: 5, content: "The brand opens every door. Case method pedagogy is world class.", batch: "2023" },
      ],
    },
    {
      name: "IIM Bangalore",
      slug: "iim-bangalore",
      location: "Bannerghatta Road, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      fees: 2300000,
      rating: 4.9,
      placementPercent: 100,
      avgPackage: 3300000,
      highestPackage: 75000000,
      established: 1973,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "Top-tier B-school in India's Silicon Valley with strong tech-business synergy.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "MBA (PGP)", duration: "2 years", fees: 2300000, seats: 450, category: CourseCategory.MANAGEMENT },
      ],
      rules: [
        { exam: ExamType.CAT, branch: "MBA", rankMin: 1, rankMax: 80, year: 2023 },
      ],
      reviews: [
        { author: "Kritika Rao", rating: 5, content: "Bangalore ecosystem adds immense value. Fintech and consulting recruiters are top-notch.", batch: "2022" },
      ],
    },

    // ── Medical ───────────────────────────────────────────────────────────────
    {
      name: "AIIMS Delhi",
      slug: "aiims-delhi",
      location: "Ansari Nagar, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 6000,
      rating: 4.9,
      placementPercent: 100,
      avgPackage: 1500000,
      highestPackage: 5000000,
      established: 1956,
      affiliation: "Autonomous (Institute of National Importance)",
      description: "India's most prestigious medical institution with near-zero fees for MBBS.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "MBBS", duration: "5.5 years", fees: 6000, seats: 107, category: CourseCategory.MEDICAL },
        { name: "B.Sc Nursing", duration: "4 years", fees: 6000, seats: 60, category: CourseCategory.MEDICAL },
      ],
      rules: [
        { exam: ExamType.NEET, branch: "MBBS", rankMin: 1, rankMax: 50, year: 2023 },
      ],
      reviews: [
        { author: "Dr. Neha Singh", rating: 5, content: "The training and exposure here is unlike anything else in India. World-class hospital.", batch: "2022" },
      ],
    },
    {
      name: "Maulana Azad Medical College",
      slug: "mamc-delhi",
      location: "Bahadur Shah Zafar Marg, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 25000,
      rating: 4.6,
      placementPercent: 99,
      avgPackage: 1200000,
      highestPackage: 3500000,
      established: 1958,
      affiliation: "University of Delhi",
      description: "One of India's top government medical colleges with exceptional clinical training.",
      type: CollegeType.GOVERNMENT,
      courses: [
        { name: "MBBS", duration: "5.5 years", fees: 25000, seats: 150, category: CourseCategory.MEDICAL },
      ],
      rules: [
        { exam: ExamType.NEET, branch: "MBBS", rankMin: 50, rankMax: 400, year: 2023 },
      ],
      reviews: [
        { author: "Dr. Rahul Batra", rating: 5, content: "Excellent patient exposure. Delhi location helps for residency applications.", batch: "2021" },
      ],
    },
  ];

  // ── Insert all colleges ───────────────────────────────────────────────────
  for (const { courses, rules, reviews, ...collegeData } of colleges) {
    await prisma.college.create({
      data: {
        ...collegeData,
        courses: {
          create: courses,
        },
        predictorRules: {
          create: rules,
        },
        reviews: {
          create: reviews,
        },
      },
    });
    console.log(`  ✔ ${collegeData.name}`);
  }

  const count = await prisma.college.count();
  console.log(`\n✅ Seeded ${count} colleges successfully.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });