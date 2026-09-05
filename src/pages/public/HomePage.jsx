import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  HeartPulse,
  CreditCard,
  QrCode,
  Percent,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  PhoneCall,
  Check
} from "lucide-react";
import { HeroSlider } from "../../components/home/HeroSlider";
import { Button } from "../../components/common/Button";
import { initialPartners } from "../../data/partners";

export function HomePage() {
  const featuredPartners = initialPartners.filter((p) => p.featured).slice(0, 3);

  const steps = [
    {
      num: "01",
      title: "Get Your Card",
      desc: "Register in under 2 minutes through a local field agent or online for just ₹49/year.",
      icon: CreditCard
    },
    {
      num: "02",
      title: "Find a Partner",
      desc: "Locate verified pharmacies, pathology labs, and nursing homes near you in Tripura.",
      icon: Search
    },
    {
      num: "03",
      title: "Show / Scan Card",
      desc: "Present your physical or digital QR card at the billing desk of any partner outlet.",
      icon: QrCode
    },
    {
      num: "04",
      title: "Get Your Discount",
      desc: "Save up to 20% on blood tests, prescription medicines, and routine healthcare bills.",
      icon: Percent
    }
  ];

  const benefits = [
    {
      title: "Affordable Membership",
      highlight: "₹49 / year",
      desc: "Less than the price of a single medicine strip, covering an entire year of unlimited discount savings.",
      icon: Sparkles
    },
    {
      title: "Up to 20% Savings",
      highlight: "Substantial Reductions",
      desc: "Enjoy direct discounts of 10% - 20% on routine pathology blood tests, medicines, and room charges.",
      icon: Percent
    },
    {
      title: "100+ Partner Outlets",
      highlight: "Expanding Network",
      desc: "Pre-verified healthcare partners across West Tripura, Gomati, Sepahijala, and all 8 districts.",
      icon: Building2
    },
    {
      title: "Easy QR Verification",
      highlight: "Instant & Digital",
      desc: "Frictionless scan-and-verify system designed for fast billing at busy retail counters.",
      icon: QrCode
    },
    {
      title: "Simple 1-Click Renewal",
      highlight: "No Paperwork",
      desc: "Automatic reminders sent 30 days before expiry with seamless digital UPI or agent renewal.",
      icon: Clock
    },
    {
      title: "Trusted Healthcare Network",
      highlight: "DPDPA 2023 Compliant",
      desc: "Strict data privacy architecture. No sensitive medical or financial records are ever exposed.",
      icon: ShieldCheck
    }
  ];

  const testimonials = [
    {
      name: "Bikash Debnath",
      location: "Agartala, West Tripura",
      rating: 5,
      comment:
        "My parents require regular diabetic and blood pressure medication. Health Mitra saved us over ₹3,200 in the first four months alone at Mitra Pharmacy!",
      savings: "Saved ₹3,200+ on Medicines"
    },
    {
      name: "Swapna Chakraborty",
      location: "Udaipur, Gomati",
      rating: 5,
      comment:
        "Got my complete full body pathology test done at Tripura Diagnostics. Just showed the QR code on my phone and received an instant 20% discount.",
      savings: "Saved ₹500 on Blood Tests"
    },
    {
      name: "Dipankar Roy",
      location: "Bishalgarh, Sepahijala",
      rating: 5,
      comment:
        "For ₹49 a year, this card is truly a blessing for middle-class families in Tripura. The registration with the field agent took only 2 minutes.",
      savings: "Saved ₹1,850 in 6 Months"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 overflow-hidden">
      {/* 1. Dynamic Interactive Hero Slider */}
      <HeroSlider />

      {/* 2. Official Statistics Strip */}
      <section className="bg-navy-950 text-white py-12 border-y border-navy-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-navy-800">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">100+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Partner Healthcare Outlets</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">5,00,000</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Year 1 Target Members</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">₹49</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Annual Card Price</p>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">Up to 20%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Discount at Outlets</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-Step How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            How Health Mitra Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Getting quality healthcare savings has never been simpler. Four quick steps from registration to instant discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold text-brand-500 font-mono">{s.num}</span>
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/how-it-works">
            <Button variant="outline" size="md">
              Learn More About the Process →
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="bg-slate-100/75 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
              Benefits Designed for Every Family
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Health Mitra bridges the gap between essential medical care and family budgets across Tripura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-500 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-2 py-0.5 rounded">
                      {b.highlight}
                    </span>
                    <h3 className="text-lg font-bold text-navy-900">{b.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Partners Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Partner Network
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900">Featured Healthcare Outlets</h2>
            <p className="text-slate-600 text-sm">
              Explore trusted medical outlets in Agartala and across Tripura offering immediate Health Mitra discounts.
            </p>
          </div>
          <Link to="/partners">
            <Button variant="outline" size="sm">
              View All 100+ Partners →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPartners.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow">
                  Up to {p.discountPercent}% OFF
                </div>
                <div className="absolute bottom-3 left-3 bg-navy-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {p.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-navy-900 text-base">{p.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> {p.address}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    ✓ {p.maxDiscountText}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{p.openingHours}</span>
                  <Link to="/partners" className="text-brand-600 font-bold hover:underline">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Patient Stories</span>
            <h2 className="text-3xl font-extrabold text-navy-900">What Our Cardholders Say</h2>
            <p className="text-slate-600 text-sm">Real stories of healthcare savings from across Tripura.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">"{t.comment}"</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-navy-900">{t.name}</h4>
                    <p className="text-[10px] text-slate-500">{t.location}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {t.savings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Phase 1 Enrolment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Get Your Health Mitra Card Today for Just ₹49/Year
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join thousands of families in Tripura saving on medicine, diagnostic blood tests, and hospital fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/enquiry" className="w-full sm:w-auto">
              <Button size="lg" className="w-full shadow-orange-glow">
                Apply for Card (₹49)
              </Button>
            </Link>
            <Link to="/become-partner" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
