import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  QrCode,
  Percent,
  Pill,
  Activity,
  HeartPulse,
  Building2,
  Users,
  Check,
  Pause,
  Play,
  Clock,
  Shield,
  Stethoscope
} from "lucide-react";
import { HealthMitraCard } from "../card/HealthMitraCard";
import { Button } from "../common/Button";

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [calcBill, setCalcBill] = useState(2500);
  const autoPlayRef = useRef(null);

  const slides = [
    // Slide 1: Primary Health Mitra Membership Card
    {
      id: "card",
      badge: "Tripura's Smart Healthcare Card • ₹49 / Year",
      badgeIcon: Sparkles,
      badgeColor: "bg-orange-50 border-brand-200 text-brand-700",
      heading: (
        <>
          Affordable healthcare. <br />
          <span className="text-brand-500">Bigger savings.</span> <br />
          Better access.
        </>
      ),
      description:
        "Save up to 20% discount across 100+ verified partner pharmacies, pathology labs, and nursing homes across all 8 districts of Tripura with Health Mitra.",
      pillPrice: "₹49",
      pillSub: "/ year membership",
      pillHighlight: "Save up to 20% at partner outlets",
      primaryCta: { text: "Get Your Health Mitra Card", to: "/enquiry" },
      secondaryCta: { text: "Verify Card", to: "/verify", icon: ShieldCheck },
      tertiaryCta: { text: "Become a Partner →", to: "/become-partner" },
      trustBadges: [
        "Instant QR Verification",
        "100% DPDPA 2023 Compliant",
        "15-Day Card Delivery"
      ],
      type: "card"
    },

    // Slide 2: Medicine & Pharmacy Discounts
    {
      id: "pharmacy",
      badge: "Partner Pharmacy Network • Flat 10% - 20% Off",
      badgeIcon: Pill,
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
      heading: (
        <>
          Save up to 20% on <br />
          <span className="text-emerald-600">Daily Medicines</span> <br />
          & Prescriptions.
        </>
      ),
      description:
        "Never let medicine costs burden your family. Avail guaranteed discounts on diabetic, cardiac, blood pressure, and daily medications at 60+ partner medical stores in Tripura.",
      pillPrice: "10% - 20%",
      pillSub: "Direct off on billing",
      pillHighlight: "60+ Medical Stores in Tripura",
      primaryCta: { text: "Find Partner Pharmacies", to: "/partners" },
      secondaryCta: { text: "Calculate Your Savings", to: "/pricing", icon: Percent },
      tertiaryCta: { text: "Apply for Card (₹49) →", to: "/enquiry" },
      trustBadges: [
        "Valid on Routine & Chronic Meds",
        "No Minimum Bill Required",
        "Instant Counter Discount"
      ],
      type: "pharmacy"
    },

    // Slide 3: Pathology & Diagnostics
    {
      id: "diagnostic",
      badge: "Diagnostic Labs & Pathology • Up to 20% Off",
      badgeIcon: Activity,
      badgeColor: "bg-blue-50 border-blue-200 text-blue-800",
      heading: (
        <>
          Subsidized Rates for <br />
          <span className="text-blue-600">Blood Tests &</span> <br />
          Diagnostic Labs.
        </>
      ),
      description:
        "Get CBC, Lipid Profiles, Thyroid tests, HbA1c, Ultrasound, and full body health checkup packages at discounted rates across certified labs in Agartala and all districts.",
      pillPrice: "Save ₹300+",
      pillSub: "per health package",
      pillHighlight: "Pre-verified Diagnostic Centers",
      primaryCta: { text: "Explore Lab Partners", to: "/partners" },
      secondaryCta: { text: "How Discounts Work", to: "/how-it-works", icon: HeartPulse },
      tertiaryCta: { text: "View Price List →", to: "/pricing" },
      trustBadges: [
        "Certified Partner Labs",
        "Digital Bill Concession",
        "Routine & Special Tests"
      ],
      type: "diagnostic"
    },

    // Slide 4: Instant QR & Field Agent Network
    {
      id: "agent",
      badge: "Tripura-Wide Network • 2-Minute Enrolment",
      badgeIcon: QrCode,
      badgeColor: "bg-purple-50 border-purple-200 text-purple-800",
      heading: (
        <>
          Doorstep Agent Service. <br />
          <span className="text-purple-600">Instant QR Code</span> <br />
          Digital Activation.
        </>
      ),
      description:
        "Enrol in 2 minutes with our authorized field agents across all 8 districts of Tripura. Receive your instant digital card on your phone with seamless QR scan verification.",
      pillPrice: "2 Mins",
      pillSub: "Doorstep Enrolment",
      pillHighlight: "Covering all 8 Tripura Districts",
      primaryCta: { text: "Verify Any Card Now", to: "/verify" },
      secondaryCta: { text: "Join As Field Agent", to: "/join-us", icon: Users },
      tertiaryCta: { text: "Open Member Portal →", to: "/cardholder/card" },
      trustBadges: [
        "Doorstep Registration",
        "WhatsApp & SMS Alerts",
        "DPDPA 2023 Compliant"
      ],
      type: "agent"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

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

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section
      className="relative pt-6 pb-12 lg:pt-12 lg:pb-20 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Progress & Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-200/60">
          {/* Slide Tab Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {slides.map((s, idx) => {
              const active = idx === currentSlide;
              const TabIcon = s.badgeIcon;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    active
                      ? "bg-navy-900 text-white shadow-md scale-102"
                      : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${active ? "text-brand-400" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">
                    {idx === 0 && "Health Mitra Card"}
                    {idx === 1 && "Pharmacy Savings"}
                    {idx === 2 && "Diagnostic Labs"}
                    {idx === 3 && "Instant QR & Agents"}
                  </span>
                  <span className="sm:hidden">0{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Controls: Prev / Pause / Next */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-navy-900 transition text-xs shadow-2xs"
              title={isPaused ? "Play Auto-Slider" : "Pause Auto-Slider"}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-navy-900 transition shadow-2xs"
              title="Previous Slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-navy-900 transition shadow-2xs"
              title="Next Slide"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Slide Timer Bar */}
        <div className="w-full bg-slate-200/60 h-1 rounded-full mb-8 overflow-hidden">
          <div
            key={currentSlide + (isPaused ? "-paused" : "-playing")}
            className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full transition-all"
            style={{
              animation: !isPaused ? "timerFill 6.5s linear forwards" : "none",
              width: isPaused ? "50%" : "0%"
            }}
          />
        </div>

        {/* Main Slide Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[460px]">
          {/* Left Text & CTA Section */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-300">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-xs ${slide.badgeColor}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.12]">
              {slide.heading}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {slide.description}
            </p>

            {/* Price / Highlight Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-2xl font-extrabold text-brand-500">{slide.pillPrice}</span>
                <span className="text-xs text-slate-500 font-semibold">{slide.pillSub}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200 shadow-2xs text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{slide.pillHighlight}</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <Link to={slide.primaryCta.to} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-orange-glow">
                  {slide.primaryCta.text}
                </Button>
              </Link>
              <Link to={slide.secondaryCta.to} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={slide.secondaryCta.icon}
                >
                  {slide.secondaryCta.text}
                </Button>
              </Link>
              <Link to={slide.tertiaryCta.to} className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-slate-600">
                  {slide.tertiaryCta.text}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
              {slide.trustBadges.map((badge, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Visual Showcase (Dynamic based on slide.type) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* 1. Card Showcase (Slide 1) */}
            {slide.type === "card" && (
              <div className="relative w-full max-w-sm sm:max-w-md animate-fadeIn">
                <HealthMitraCard
                  cardholderName="Rahul Sharma"
                  uniqueId="HMC-7F38A21"
                  publicToken="HM_PUBLIC_7F38A21_X92"
                  validUntil="01 Sep 2027"
                  status="Active"
                  interactive={true}
                />

                {/* Floating highlight badge */}
                <div className="absolute -bottom-5 -right-2 sm:-right-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">Up to 20% OFF</p>
                    <p className="text-[10px] text-slate-500 font-medium">100+ Outlets in Tripura</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Pharmacy Savings Calculator Showcase (Slide 2) */}
            {slide.type === "pharmacy" && (
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-900">Pharmacy Bill Calculator</h3>
                      <p className="text-[10px] text-slate-500">Live 15% discount simulation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    SAVE 15% - 20%
                  </span>
                </div>

                {/* Slider Input */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Monthly Medicine Bill:</span>
                    <span className="text-brand-600 font-extrabold text-sm">₹{calcBill} / month</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={calcBill}
                    onChange={(e) => setCalcBill(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹500</span>
                    <span>₹5,000</span>
                    <span>₹10,000</span>
                  </div>
                </div>

                {/* Calculation Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">You Pay Only</p>
                    <p className="text-lg font-extrabold text-navy-900 mt-0.5">
                      ₹{Math.round(calcBill * 0.85)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold">Save ₹{Math.round(calcBill * 0.15)}/mo</p>
                  </div>
                  <div className="bg-emerald-500 text-white p-3.5 rounded-2xl shadow-md text-center">
                    <p className="text-[10px] text-emerald-100 font-semibold uppercase">Total Yearly Savings</p>
                    <p className="text-xl font-extrabold text-white mt-0.5">
                      ₹{Math.round(calcBill * 0.15 * 12).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-emerald-100">on ₹49 Card Fee!</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Mitra Pharmacy, Agartala
                  </span>
                  <Link to="/partners" className="text-brand-600 font-bold hover:underline">
                    View 60+ Outlets →
                  </Link>
                </div>
              </div>
            )}

            {/* 3. Diagnostic Lab Package Showcase (Slide 3) */}
            {slide.type === "diagnostic" && (
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-blue-100 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-900">Lab Test Price Comparison</h3>
                      <p className="text-[10px] text-slate-500">Tripura Diagnostics & Partner Labs</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                    VERIFIED RATES
                  </span>
                </div>

                {/* Test Rows */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy-900">Full Body Health Checkup</p>
                      <p className="text-[10px] text-slate-500">CBC, Liver, Kidney, Lipid & Blood Sugar</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 line-through mr-1.5">₹1,500</span>
                      <span className="text-sm font-extrabold text-blue-700">₹1,200</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy-900">Lipid & Cardiac Profile</p>
                      <p className="text-[10px] text-slate-500">Cholesterol, HDL, LDL, Triglycerides</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 line-through mr-1.5">₹900</span>
                      <span className="text-sm font-extrabold text-blue-700">₹720</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy-900">Thyroid Profile (T3, T4, TSH)</p>
                      <p className="text-[10px] text-slate-500">Fast digital report within 4 hours</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 line-through mr-1.5">₹550</span>
                      <span className="text-sm font-extrabold text-blue-700">₹440</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-center text-[11px] text-blue-800 font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Present Health Mitra QR at billing desk for instant reduction</span>
                </div>
              </div>
            )}

            {/* 4. Instant QR Simulator Showcase (Slide 4) */}
            {slide.type === "agent" && (
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-purple-100 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-900">Instant QR Verification Demo</h3>
                      <p className="text-[10px] text-slate-500">Doorstep Agent & Instant Activation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SCAN ACTIVE
                  </span>
                </div>

                {/* QR Scanner Simulation */}
                <div className="relative bg-navy-950 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl mb-3 shadow-lg relative">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HM_VERIFIED_7F38A21"
                      alt="Demo QR"
                      className="w-full h-full object-contain"
                    />
                    {/* Laser Scanner Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" style={{ top: "45%" }} />
                  </div>

                  <p className="text-xs font-mono font-bold text-emerald-400">STATUS: VERIFIED ACTIVE</p>
                  <p className="text-sm font-bold mt-1">Rahul Sharma</p>
                  <p className="text-[10px] text-slate-400 font-mono">ID: HMC-7F38A21 • Valid: 2027</p>

                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>DPDPA 2023 Compliant Verification</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-[11px]">
                    <Users className="w-3.5 h-3.5 text-purple-600" /> 8 Districts of Tripura
                  </span>
                  <Link to="/verify" className="text-brand-600 font-bold hover:underline text-xs">
                    Test Live Verification →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes timerFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
