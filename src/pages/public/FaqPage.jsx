import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contentService } from "../../services/contentService";
import { ChevronDown, Search, HelpCircle, Phone, MessageSquare } from "lucide-react";
import { Button } from "../../components/common/Button";

export function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = ["All", "General", "Partners & Discounts", "Card & Membership", "Pricing & Validity", "Verification & Security", "Partnership"];

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await contentService.getFaqs();
        setFaqs(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setOpenFaq(data[0].id);
        }
      } catch (e) {
        setFaqs([]);
      }
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const q = (faq.question || "").toLowerCase();
    const a = (faq.answer || "").toLowerCase();
    const matchSearch = q.includes(searchTerm.toLowerCase()) || a.includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || faq.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Knowledge Base & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm">
          Everything you need to know about the Health Mitra card, pricing, discounts, partner verification, and renewals.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g., How much discount? How to verify?)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaq === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-orange-50 text-brand-500 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-sm text-navy-900">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  <p className="pl-9">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No questions found matching your search term.
          </div>
        )}
      </div>

      {/* Help Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold">Have a different question?</h4>
          <p className="text-xs text-slate-300">Our customer support team is available Mon-Sat 9AM-7PM</p>
        </div>
        <div className="flex gap-2">
          <Link to="/contact">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20">
              Contact Support
            </Button>
          </Link>
          <a href="tel:+919436120111">
            <Button size="sm" icon={Phone}>
              Call 1800-MITRA
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
