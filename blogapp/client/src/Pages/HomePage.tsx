import Hero from "../components/Hero";
import PricingTable from "../components/PricingTable";
import ContactUs from "../components/ContactUs";
import left from "../assets/img/LandingPage/left.avif";
import right from "../assets/img/LandingPage/right.avif";
import middle from "../assets/img/LandingPage/middle.avif";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  return (
    <div className="md:pt-6 w-screen overflow-hidden">
      <Hero />
      <div className="lg:relative lg:min-h-screen mb-7 flex justify-center items-center">
        <img
          src={middle}
          alt="hero"
          loading="eager"
          className="hidden lg:block absolute w-1/2 m-auto inset-0"
        />
        <img
          src={left}
          alt="hero"
          loading="eager"
          className="lg:absolute w-11/12 lg:w-[37.5%] m-auto left-0"
        />
        <img
          src={right}
          alt="hero"
          loading="eager"
          className="absolute hidden lg:block w-[37.5%] m-auto right-0"
        />
      </div>
      <Testimonials />
      <Features />
      <PricingTable />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default HomePage;
