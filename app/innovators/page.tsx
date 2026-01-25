"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InnovatorsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const innovations = [
    { ripd: "AG-01-133", title: "Vertical Farming: Future Farming Technology for Food", pi: "S.M.Anamul Arefin", coPi: "Zerin Tasnim" },
    { ripd: "AG-01-156", title: "IoT Based Modular Smart Farming System for Aeroponics, Hydroponics, and Aquaponics", pi: "Md. Iftikhar Alam Omar", coPi: "Md. Zulfiker Ali" },
    { ripd: "FI-01-05", title: "Solar Brilliance: Revolutionizing Fish Drying in Bangladesh with Sustainable Technology", pi: "MD. Masud Rana", coPi: "Md. Abu Saeid" },
    { ripd: "FI-01-32", title: "PONDVISION: Real-Time Fish Monitoring for Count and Health with AI & IoT", pi: "Md. Aminul Islam", coPi: "Nazia Islam Purba" },
    { ripd: "FO-01-30", title: "NHP Showcase: Customized Product Display Freezer", pi: "AKM Ganiul Zadid", coPi: "Md Mosaraf Hossain Tipu" },
    { ripd: "FO-01-51", title: "Rapid Detection Kit for Lead Chromate and Metanil Yellow in Turmeric Powder", pi: "Md. Latiful Bari", coPi: "Sharmin Zaman Emon" },
    { ripd: "NV-01-57", title: "AirZenith Oxyfier", pi: "Nahid Hassan", coPi: "Md. Badsha Molla" },
    { ripd: "OT-01-11", title: "Simulation-Based Driving, Road Rules, Problem Identification & Vehicle Repair Training Simulator", pi: "Mohammad Mojibur Rahman Sagar", coPi: "Krishna Ray" },
    { ripd: "OT-01-20", title: "Scalable Menstrual Hygiene Management via Diva Sanitary Pad Vending Machines", pi: "Md. Nazrul Islam Anik", coPi: "Ishmam Ur Rahman" },
    { ripd: "OT-01-294", title: "Revolutionizing Transportation: Hyperloop Simulation for Goods Transportation", pi: "Dr. Rajib Nandee", coPi: "Md. Rifat Khandaker" },
    { ripd: "OT-01-302", title: "Smart CCRM (Citizen & Customer Relationship Management)", pi: "Tanvir Hassan Sourov", coPi: "Shahidul Islam" },
    { ripd: "OT-01-319", title: "Pet Care & Tracker", pi: "Mahamudul Hasan", coPi: "Ehsanul Siddiq Arannya" },
    { ripd: "TR-01-51", title: "Digital Driver", pi: "Shubho Al Farooque", coPi: "Shuvro Pal" },
    { ripd: "TR-01-77", title: "Electric Delivery Pickup Van for Last-Mile Delivery Solutions", pi: "Mustafa Al Momin", coPi: "Faisal Akram Ether" },
    { ripd: "OT-01-310", title: "Hybrid Cadastral Surveying Map Preparation Using Smart Technology", pi: "Eng. Pulak Kanti Barua", coPi: "Dr M Mizanur Rahman" },
    { ripd: "TR-01-76", title: "Develop an Affordable and configurable amphibious aircraft for emerging economics", pi: "Raisul Azad Khandoker", coPi: "Sayed Mosharrf Ali" },
    { ripd: "OT-01-346", title: "Smart Seaweed Processing & Marketing: Leveraging Technology for Efficient Soup Production and Quality Control", pi: "Mir Mohammad Ali", coPi: "Ashfia Nisha Bristy" },
    { ripd: "HE-01-346", title: "Green Solution for Dengue Management: A Sustainable Approach using indigenous Bacillus thuringiensis for vector control", pi: "Professor Dr. Shakila Nargis Khan", coPi: "Professor Dr. Muhammad Manjurul Karim" },
  ];

  const categories = ["All", "AG", "FI", "FO", "NV", "OT", "TR", "HE"];

  // Filtered list
  const filteredInnovations = innovations.filter((item) => {
    const matchFilter = filter === "All" || item.ripd.startsWith(filter);
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.pi.toLowerCase().includes(search.toLowerCase()) ||
      item.coPi?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // GSAP animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.utils.toArray(".innovation-card").forEach((element: any, index) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, [filteredInnovations]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-white overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-teal-500">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">Innovators & Innovations</h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto text-blue-100">
            Explore visionary ideas shaping tomorrow’s agriculture, technology, and sustainability.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or researcher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm rounded-full border transition ${
                  filter === cat
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInnovations.map((item, i) => (
            <motion.div
              key={i}
              className="innovation-card bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-xs font-semibold text-primary mb-2">
                RIPD: {item.ripd}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>PI:</strong> {item.pi}
                <br />
                {item.coPi && (
                  <>
                    <strong>Co-PI:</strong> {item.coPi}
                  </>
                )}
              </p>
            </motion.div>
          ))}

          {filteredInnovations.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No results found.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-700 via-blue-600 to-teal-500 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Collaborate with RIC–SAU
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
            Partner with us to turn innovative ideas into impactful real-world
            solutions.
          </p>
          <Link href="/contact">
            <Button
              size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Get in Touch
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
