import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCamera, FaVideo, FaUtensils, FaPaintBrush, FaMapMarkerAlt, FaPalette, FaMusic, FaCar } from "react-icons/fa";
import { searchServices } from "../../api/serviceApi";

const vendorCategories = [
  {
    title: "Photography",
    subtitle: "Capture every moment with trusted photographers.",
    icon: FaCamera,
  },
  {
    title: "Videography",
    subtitle: "Cinematic wedding films and coverage.",
    icon: FaVideo,
  },
  {
    title: "Catering",
    subtitle: "Custom menus and premium dining services.",
    icon: FaUtensils,
  },
  {
    title: "Decoration",
    subtitle: "Beautiful styling and decor for every theme.",
    icon: FaPaintBrush,
  },
  {
    title: "Wedding Venue",
    subtitle: "Stunning spaces for your ceremony and reception.",
    icon: FaMapMarkerAlt,
  },
  {
    title: "Makeup Artist",
    subtitle: "Bridal beauty and styling services.",
    icon: FaPalette,
  },
  {
    title: "DJ & Music",
    subtitle: "Live DJs and music for reception entertainment.",
    icon: FaMusic,
  },
  {
    title: "Transportation",
    subtitle: "Luxury travel and guest transport services.",
    icon: FaCar,
  },
];

const getIconFor = (cat) => cat.icon || FaUsers;

const CustomerVendorCategories = () => {
  const [vendorCounts, setVendorCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.all(
          vendorCategories.map((cat) =>
            searchServices({ category: cat.title }).then((res) => ({
              title: cat.title,
              count: Array.isArray(res.data) ? res.data.length : 0,
            }))
          )
        );

        const counts = {};
        results.forEach((result) => {
          counts[result.title] = result.count;
        });
        setVendorCounts(counts);
      } catch (err) {
        console.error("Failed to fetch vendor counts", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="vendor-categories-section">
      <div className="vendor-categories-header">
        <div>
          <h2>Vendor Listings</h2>
          <p className="vendor-categories-sub">
            Shop top wedding services in one place with fast access to the best professionals.
          </p>
        </div>
        <Link to="/customer/services" className="vendor-categories-viewall">
          View all services
        </Link>
      </div>

      <div className="vendor-category-list">
        {vendorCategories.map((cat) => {
          const Icon = getIconFor(cat);
          const count = vendorCounts[cat.title] ?? "—";
          return (
            <Link
              key={cat.title}
              to={`/customer/services?category=${encodeURIComponent(cat.title)}`}
              className="vendor-category-item"
              aria-label={`Browse ${cat.title} services`}
            >
              <div className="vendor-category-avatar" aria-hidden>
                <Icon />
              </div>
              <div className="vendor-category-info">
                <div className="vendor-category-name">{cat.title}</div>
                <p className="vendor-category-description">{cat.subtitle}</p>
              </div>
              <span className="vendor-category-meta">{count} vendors</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CustomerVendorCategories;
