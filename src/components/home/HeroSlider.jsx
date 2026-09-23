import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { bannerService } from "../../services/bannerService";

function isExternalUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

export function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});
  const autoPlayRef = useRef(null);

  // Fetch dynamic banners directly from cupan.getfreedeal.com/api/content/banners
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicBanners() {
      try {
        setLoading(true);
        const data = await bannerService.getAll();

        if (!isMounted) return;

        console.group("🚀 [Health Mitra] Hero Section Banners API Response");
        console.log("Raw API Response Data:", data);
        if (Array.isArray(data)) {
          console.table(
            data.map((b) => ({
              id: b.id,
              title: b.title,
              section: b.section,
              banner_image_url: b.banner_image_url || b.banner?.image_url,
              card_image_url: b.card_image_url || b.card?.image_url
            }))
          );
        }
        console.groupEnd();

        if (Array.isArray(data) && data.length > 0) {
          // Filter for home_hero section if section exists, otherwise use all banners
          const heroBanners = data.filter(
            (b) => !b.section || b.section === "home_hero"
          );

          const bannersToRender = heroBanners.length > 0 ? heroBanners : data;

          // Pure dynamic mapping: ZERO static fallback texts
          const mapped = bannersToRender.map((item, idx) => {
            const btn1Text = item.buttons?.btn1?.text?.trim() || item.btn1_text?.trim() || "";
            const btn1Link = item.buttons?.btn1?.link?.trim() || item.btn1_link?.trim() || "";

            const btn2Text = item.buttons?.btn2?.text?.trim() || item.btn2_text?.trim() || "";
            const btn2Link = item.buttons?.btn2?.link?.trim() || item.btn2_link?.trim() || "";

            // 1. Banner Background Visual (banner_image)
            const rawBannerImg =
              item.banner_image_url ||
              item.banner?.image_url ||
              item.banner_image ||
              item.banner?.image ||
              "";

            // 2. Card Foreground Visual (card_image)
            const rawCardImg =
              item.card_image_url ||
              item.card?.image_url ||
              item.card_image ||
              item.card?.image ||
              item.image_url ||
              item.image ||
              "";

            const cardBtnText =
              item.card?.button_text?.trim() || item.card_btn_text?.trim() || "";
            const cardBtnLink =
              item.card?.button_link?.trim() || item.card_btn_link?.trim() || "";

            const badgeText = item.badge?.trim() || "";

            return {
              id: item.id || `api-banner-${idx}`,
              badge: badgeText,
              title: item.title?.trim() || "",
              subtitle: item.subtitle?.trim() || "",
              paragraph: item.paragraph?.trim() || "",
              btn1Text,
              btn1Link,
              btn2Text,
              btn2Link,
              bannerImageUrl: rawBannerImg,
              cardImageUrl: rawCardImg,
              cardBtnText,
              cardBtnLink
            };
          });

          setSlides(mapped);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.warn("Error fetching dynamic banners:", err);
        setSlides([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDynamicBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure currentSlide is within bounds
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  // Auto-slide every 6 seconds, pause on mouse hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Modern Shimmer Skeleton while loading API data
  if (loading && slides.length === 0) {
    return (
      <section className="relative w-full bg-slate-950 py-14 sm:py-16 min-h-[380px] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-28 h-6 bg-slate-800/80 rounded-full" />
              <div className="w-3/4 h-10 bg-slate-800 rounded-2xl" />
              <div className="w-1/2 h-8 bg-slate-800/60 rounded-2xl" />
              <div className="w-full max-w-lg h-14 bg-slate-800/40 rounded-xl" />
              <div className="flex gap-3 pt-2">
                <div className="w-32 h-10 bg-brand-500/20 rounded-xl" />
                <div className="w-28 h-10 bg-slate-800/50 rounded-xl" />
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-5 justify-center">
              <div className="w-[340px] h-[220px] bg-slate-800/40 rounded-2xl border border-slate-800" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no banners returned from API
  if (slides.length === 0) {
    return null;
  }

  const current = slides[currentSlide] || slides[0];

  // Validate uploaded image URLs
  const isBannerUsable =
    Boolean(current.bannerImageUrl) &&
    !brokenImages[`banner_${current.id}`] &&
    !current.bannerImageUrl.includes("example.com");

  const isCardUsable =
    Boolean(current.cardImageUrl) &&
    !brokenImages[`card_${current.id}`] &&
    !current.cardImageUrl.includes("example.com");

  return (
    <section
      className="relative w-full bg-slate-950 overflow-hidden select-none group min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Website Dynamic Hero Section"
    >
      {/* Background Banner Image (banner_image) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {isBannerUsable ? (
          <div key={`banner-bg-${current.id}`} className="absolute inset-0 w-full h-full">
            {/* Full-width, crystal-clear background banner image */}
            <img
              src={current.bannerImageUrl}
              alt={current.title || "Hero Banner Background"}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
              onError={() => {
                console.warn("Banner background image load failed:", current.bannerImageUrl);
                setBrokenImages((prev) => ({ ...prev, [`banner_${current.id}`]: true }));
              }}
            />
            {/* Soft left gradient ONLY behind text for crisp readability; right side is completely clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 to-transparent" />
          </div>
        ) : isCardUsable ? (
          <div
            key={`ambient-bg-${current.id}`}
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-125 transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${current.cardImageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950" />
        )}
      </div>

      {/* Hero Content & Dynamic Card/Image */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Pure Dynamic Content from API */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            {/* Dynamic Badge (ONLY rendered if present in API) */}
            {current.badge && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-sm transition-all duration-300 bg-brand-500/25 text-brand-300 border-brand-400/40">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{current.badge}</span>
              </div>
            )}

            {/* Main Title & Subtitle */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-md">
              {current.title && <span>{current.title}</span>}
              {current.subtitle && (
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-orange-400">
                  {current.subtitle}
                </span>
              )}
            </h1>

            {/* Dynamic Paragraph (ONLY rendered if present in API) */}
            {current.paragraph && (
              <p className="text-xs sm:text-sm lg:text-base text-slate-200/90 max-w-lg mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
                {current.paragraph}
              </p>
            )}

            {/* Dynamic CTA Buttons (ONLY rendered if button text is provided in API) */}
            {(current.btn1Text || current.btn2Text) && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                {/* Button 1 */}
                {current.btn1Text && (
                  isExternalUrl(current.btn1Link) ? (
                    <a
                      href={current.btn1Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="md"
                        className="shadow-orange-glow font-bold text-xs sm:text-sm px-5 py-2.5 flex items-center gap-1.5"
                      >
                        <span>{current.btn1Text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Link to={current.btn1Link || "/"}>
                      <Button
                        size="md"
                        className="shadow-orange-glow font-bold text-xs sm:text-sm px-5 py-2.5 flex items-center gap-1.5"
                      >
                        <span>{current.btn1Text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )
                )}

                {/* Button 2 */}
                {current.btn2Text && (
                  isExternalUrl(current.btn2Link) ? (
                    <a
                      href={current.btn2Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{current.btn2Text}</span>
                    </a>
                  ) : (
                    <Link
                      to={current.btn2Link || "/"}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{current.btn2Text}</span>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Health Card Graphic (card_image) ONLY */}
          <div className="flex lg:col-span-5 items-center justify-center relative mt-4 lg:mt-0">
            <div className="relative w-full max-w-[420px] transform hover:scale-[1.01] transition-all duration-300">
              {isCardUsable ? (
                /* Health Card Graphic (card_image) */
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/60 backdrop-blur-md p-2">
                  <img
                    src={current.cardImageUrl}
                    alt={current.title || "Health Card Graphic"}
                    className="w-full h-auto max-h-[320px] object-cover rounded-xl"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [`card_${current.id}`]: true }))
                    }
                  />

                  {/* Card Action Button (if present in API) */}
                  {current.cardBtnText && (
                    <div className="absolute bottom-3 right-3">
                      {isExternalUrl(current.cardBtnLink) ? (
                        <a
                          href={current.cardBtnLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold shadow-lg transition hover:scale-105"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{current.cardBtnText}</span>
                        </a>
                      ) : (
                        <Link
                          to={current.cardBtnLink || "/"}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold shadow-lg transition hover:scale-105"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{current.cardBtnText}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : current.title ? (
                /* Dynamic Health Mitra Branded Card - ZERO static data */
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 via-navy-950/90 to-slate-900/90 backdrop-blur-xl p-6 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    {current.badge ? (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/15 px-2.5 py-1 rounded-full border border-brand-500/30">
                        {current.badge}
                      </span>
                    ) : (
                      <div />
                    )}
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Health Mitra
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {current.title}
                    </h3>
                    {current.subtitle && (
                      <p className="text-xs sm:text-sm text-brand-300 font-medium mt-1">
                        {current.subtitle}
                      </p>
                    )}
                  </div>
                  {current.paragraph && (
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {current.paragraph}
                    </p>
                  )}
                  {current.cardBtnText && (
                    <div className="pt-2">
                      {isExternalUrl(current.cardBtnLink) ? (
                        <a
                          href={current.cardBtnLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg transition hover:scale-105"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{current.cardBtnText}</span>
                        </a>
                      ) : (
                        <Link
                          to={current.cardBtnLink || "/"}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg transition hover:scale-105"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{current.cardBtnText}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Slide Arrow (rendered if more than 1 slide) */}
      {slides.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-brand-500 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next Slide Arrow (rendered if more than 1 slide) */}
      {slides.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-brand-500 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dynamic Navigation Dots for ALL slides returned from API */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-2">
          {slides.map((_, idx) => {
            const active = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${active
                  ? "w-7 h-2 bg-brand-500 shadow-md shadow-brand-500/50"
                  : "w-2 h-2 bg-white/60 hover:bg-white"
                  }`}
                aria-label={`Go to slide ${idx + 1} of ${slides.length}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
