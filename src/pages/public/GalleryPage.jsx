import React, { useState } from "react";
import { galleryItems } from "../../data/gallery";
import { Sparkles, Filter, Calendar } from "lucide-react";
import { Badge } from "../../components/common/Badge";

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Health Camps", "Partner Network", "Field Operations", "Awareness"];

  const filtered = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Visual Impact & Community Outreach
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Health Mitra in Action
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Moments from our rural health camps, partner onboarding summits, and grassroots awareness campaigns across Tripura.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-brand-500 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                {item.category}
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </div>
              <h3 className="font-bold text-base text-navy-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
