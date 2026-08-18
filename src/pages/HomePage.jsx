import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import FeaturedMeals from "../components/FeaturedMeals.jsx";
import PizzaSection from "../components/PizzaSection.jsx";
import SoupStewPreview from "../components/SoupStewPreview.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import DeliveryBand from "../components/DeliveryBand.jsx";
import Testimonials from "../components/Testimonials.jsx";
import InstagramSection from "../components/InstagramSection.jsx";

export default function HomePage() {
  const location = useLocation();

  // If we arrived via /#section (e.g. clicked "About" from another page),
  // scroll to that section once the page has rendered.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [location]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Hero scrollTo={scrollTo} />
      <FeaturedMeals />
      <PizzaSection />
      <SoupStewPreview />
      <WhyChooseUs />
      <DeliveryBand />
      <Testimonials />
      <InstagramSection />
    </>
  );
}
