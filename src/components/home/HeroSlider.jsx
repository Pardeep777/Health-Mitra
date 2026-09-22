import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { HealthMitraCard } from "../card/HealthMitraCard";
import { Button } from "../common/Button";

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const slides = [
    {
      id: "family-care",
      image: "/images/hero/custom-hero-banner.jpg",
      badge: "Tripura's Smart Health Card • ₹49 / Year",
      badgeColor: "bg-brand-500/25 text-brand-300 border-brand-400/40",
      heading: (
        <>
          Affordable Healthcare. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-orange-400">
            For Every Family.
          </span>
        </>
      ),
      desc: "Save up to 20% on doctor consultations, blood tests, and hospital care across all 8 districts of Tripura.",
      ctaText: "Get Your Card (₹49)",
      ctaLink: "/enquiry"
    },
    {
      id: "pharmacy",
      image: "/images/hero/custom-pharmacy-banner.jpg",
      badge: "Partner Pharmacy Network • Flat 10% - 20% Off",
      badgeColor: "bg-emerald-500/25 text-emerald-300 border-emerald-400/40",
      heading: (
        <>
          Save Up to 20% On <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
            Daily Medicines.
          </span>
        </>
      ),
      desc: "Instant counter discount on diabetic, cardiac, BP, and regular prescription medications at partner medical stores.",
      ctaText: "Explore Pharmacies",
      ctaLink: "/partners"
    }
  ];

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section
      className="relative w-full bg-slate-950 overflow-hidden select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel (Smooth uncropped cross-fade) */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
              }`}
            >
              <img
                src={s.image}
                alt={s.badge}
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>
          );
        })}

        {/* Soft, balanced gradient overlay: text remains super crisp, while the people & branding are visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20 sm:to-transparent z-1" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-navy-950/80 via-navy-950/40 to-transparent z-1" />
      </div>

      {/* Hero Content & Floating Card */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Clean & Minimal Text Overlay */}
          <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
            {/* Slide Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-sm transition-all duration-300 ${current.badgeColor}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-md">
              {current.heading}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-200/90 max-w-lg mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
              {current.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <Link to={current.ctaLink}>
                <Button size="md" className="shadow-orange-glow font-bold text-xs sm:text-sm px-5 py-2.5">
                  {current.ctaText}
                </Button>
              </Link>
              <Link to="/verify">
                <button className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition duration-200 flex items-center gap-1.5 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Card</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating HealthMitraCard Preview */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
            <div className="relative w-full max-w-[360px] transform hover:scale-105 transition-all duration-300">
              <HealthMitraCard
                cardholderName="Rahul Sharma"
                uniqueId="HMC-7F38A21"
                publicToken="HM_PUBLIC_7F38A21_X92"
                validUntil="01 Sep 2027"
                status="Active"
                interactive={true}
              />

              {/* Floating Highlight Pill */}
              <div className="absolute -bottom-3 -right-2 bg-navy-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xl flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-white">Save Up to 20% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Slide Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-brand-500 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Slide Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-brand-500 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Navigation Dot Indicators */}
      <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-2">
        {slides.map((_, idx) => {
          const active = idx === currentSlide;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                active
                  ? "w-7 h-2 bg-brand-500 shadow-md shadow-brand-500/50"
                  : "w-2 h-2 bg-white/60 hover:bg-white"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
