import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FileText,
  HelpCircle,
  Image as ImageIcon,
  MessageSquareQuote,
  Users2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  Upload,
  Sparkles
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { DataTable } from "../../components/common/DataTable";
import { useNotifications } from "../../context/NotificationContext";
import { contentService } from "../../services/contentService";
import { bannerService } from "../../services/bannerService";

export function AdminContentPage() {
  const { showToast } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "banners");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dual Image Upload Refs for Banner Image & Card Image
  const addBannerFileRef = useRef(null);
  const addCardFileRef = useRef(null);
  const editBannerFileRef = useRef(null);
  const editCardFileRef = useRef(null);

  // Data Collections
  const [banners, setBanners] = useState([]);
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);

  // Modals & Active Edit States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form States
  const initialBannerForm = {
    title: "",
    subtitle: "",
    paragraph: "",
    badge: "",
    section: "home_hero",
    sort_order: "0",
    btn1_text: "",
    btn1_link: "",
    btn2_text: "",
    btn2_link: "",
    banner_image_file: null,
    banner_image_preview: "",
    banner_image: "",
    card_image_file: null,
    card_image_preview: "",
    card_image: "",
    card_btn_text: "",
    card_btn_link: "",
    status: "active"
  };
  const [bannerForm, setBannerForm] = useState(initialBannerForm);

  const openEditBanner = (b) => {
    const bannerUrl = b.banner_image_url || b.banner?.image_url || b.banner_image || b.banner?.image || "";
    const cardUrl = b.card_image_url || b.card?.image_url || b.card_image || b.card?.image || "";

    setItemToEdit({
      ...b,
      banner_image_file: null,
      banner_image_preview: bannerUrl,
      banner_image: b.banner_image || b.banner?.image || "",
      card_image_file: null,
      card_image_preview: cardUrl,
      card_image: b.card_image || b.card?.image || ""
    });
    setEditModalOpen(true);
  };

  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    status: "active"
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "General",
    sort_order: "1",
    status: "active"
  });

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Health Camps",
    image_url: "",
    description: "",
    status: "active"
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "Cardholder Member",
    district: "West Tripura",
    rating: "5",
    content: "",
    avatar: "",
    status: "active"
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    designation: "",
    bio: "",
    photo: "",
    email: "",
    phone: "",
    sort_order: "1",
    status: "active"
  });

  const loadCurrentTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "banners") {
        const data = await bannerService.getAdminBanners(searchTerm ? { search: searchTerm } : {});
        setBanners(Array.isArray(data) ? data : []);
      } else if (activeTab === "pages") {
        const data = await contentService.getPages(searchTerm ? { search: searchTerm } : {});
        setPages(Array.isArray(data) ? data : []);
      } else if (activeTab === "faq") {
        const data = await contentService.getFaqs(searchTerm ? { search: searchTerm } : {});
        setFaqs(Array.isArray(data) ? data : []);
      } else if (activeTab === "gallery") {
        const data = await contentService.getGallery(searchTerm ? { search: searchTerm } : {});
        setGallery(Array.isArray(data) ? data : []);
      } else if (activeTab === "testimonials") {
        const data = await contentService.getTestimonials(searchTerm ? { search: searchTerm } : {});
        setTestimonials(Array.isArray(data) ? data : []);
      } else if (activeTab === "team") {
        const data = await contentService.getManagementTeam(searchTerm ? { search: searchTerm } : {});
        setTeam(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Content load error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentTabData();
  }, [activeTab, searchTerm]);

  // Handle Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      if (activeTab === "banners") {
        await bannerService.addBanner(bannerForm);
        showToast("Website banner created successfully!", "success");
        setBannerForm(initialBannerForm);
      } else if (activeTab === "pages") {
        await contentService.addPage(pageForm);
        showToast("Static page created successfully!", "success");
        setPageForm({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "active" });
      } else if (activeTab === "faq") {
        await contentService.addFaq(faqForm);
        showToast("FAQ added successfully!", "success");
        setFaqForm({ question: "", answer: "", category: "General", sort_order: "1", status: "active" });
      } else if (activeTab === "gallery") {
        await contentService.addGalleryItem(galleryForm);
        showToast("Gallery image added successfully!", "success");
        setGalleryForm({ title: "", category: "Health Camps", image_url: "", description: "", status: "active" });
      } else if (activeTab === "testimonials") {
        await contentService.addTestimonial(testimonialForm);
        showToast("Testimonial added successfully!", "success");
        setTestimonialForm({ name: "", role: "Cardholder Member", district: "West Tripura", rating: "5", content: "", avatar: "", status: "active" });
      } else if (activeTab === "team") {
        await contentService.addTeamMember(teamForm);
        showToast("Team member added successfully!", "success");
        setTeamForm({ name: "", designation: "", bio: "", photo: "", email: "", phone: "", sort_order: "1", status: "active" });
      }
      setAddModalOpen(false);
      loadCurrentTabData();
    } catch (err) {
      showToast(err.message || "Failed to add item.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // Handle Edit Item
  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!itemToEdit) return;
    setBtnLoading(true);
    try {
      if (activeTab === "banners") {
        await bannerService.editBanner(itemToEdit);
        showToast("Website banner updated successfully!", "success");
      } else if (activeTab === "pages") {
        await contentService.editPage(itemToEdit);
        showToast("Page updated successfully!", "success");
      } else if (activeTab === "faq") {
        await contentService.editFaq(itemToEdit);
        showToast("FAQ updated successfully!", "success");
      } else if (activeTab === "gallery") {
        await contentService.editGalleryItem(itemToEdit);
        showToast("Gallery updated successfully!", "success");
      } else if (activeTab === "testimonials") {
        await contentService.editTestimonial(itemToEdit);
        showToast("Testimonial updated successfully!", "success");
      } else if (activeTab === "team") {
        await contentService.editTeamMember(itemToEdit);
        showToast("Team member updated successfully!", "success");
      }
      setEditModalOpen(false);
      setItemToEdit(null);
      loadCurrentTabData();
    } catch (err) {
      showToast(err.message || "Failed to update item.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (item) => {
    try {
      const curStatus = item.status || "active";
      if (activeTab === "banners") await bannerService.toggleBannerStatus(item.id, curStatus);
      else if (activeTab === "pages") await contentService.togglePageStatus(item.id, curStatus);
      else if (activeTab === "faq") await contentService.toggleFaqStatus(item.id, curStatus);
      else if (activeTab === "gallery") await contentService.toggleGalleryStatus(item.id, curStatus);
      else if (activeTab === "testimonials") await contentService.toggleTestimonialStatus(item.id, curStatus);
      else if (activeTab === "team") await contentService.toggleTeamMemberStatus(item.id, curStatus);

      showToast("Status updated successfully!", "success");
      loadCurrentTabData();
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    }
  };

  // Handle Delete
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    setBtnLoading(true);
    try {
      if (activeTab === "banners") await bannerService.deleteBanner(itemToDelete.id);
      else if (activeTab === "pages") await contentService.deletePage(itemToDelete.id);
      else if (activeTab === "faq") await contentService.deleteFaq(itemToDelete.id);
      else if (activeTab === "gallery") await contentService.deleteGalleryItem(itemToDelete.id);
      else if (activeTab === "testimonials") await contentService.deleteTestimonial(itemToDelete.id);
      else if (activeTab === "team") await contentService.deleteTeamMember(itemToDelete.id);

      showToast("Item deleted successfully!", "info");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadCurrentTabData();
    } catch (err) {
      showToast(err.message || "Failed to delete item.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const tabs = [
    { id: "banners", label: "Website Banners", icon: Layers, desc: "/admin/banners/list" },
    { id: "pages", label: "Pages CMS", icon: FileText, desc: "/admin/content/pages" },
    { id: "faq", label: "FAQs Manager", icon: HelpCircle, desc: "/admin/content/faq" },
    { id: "gallery", label: "Gallery Media", icon: ImageIcon, desc: "/admin/content/gallery" },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, desc: "/admin/content/testimonials" },
    { id: "team", label: "Management Team", icon: Users2, desc: "/admin/content/management_team" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Website Content & CMS Management</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/content/pages, faq, gallery, testimonials, management_team
          </p>
        </div>
        <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
          + Add New {tabs.find((t) => t.id === activeTab)?.label.split(" ")[0]}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSearchTerm("");
                setSearchParams({ tab: t.id });
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition ${
                isSelected
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Endpoint: <code className="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-bold">{tabs.find((t) => t.id === activeTab)?.desc}</code>
        </div>
      </div>

      {/* Content Rendering for Active Tab */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {/* 0. Website Banners Tab */}
        {activeTab === "banners" && (
          <div className="divide-y divide-slate-100">
            {banners.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No website banners found in the database.</p>
                <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
                  Create First Banner
                </Button>
              </div>
            ) : (
              banners.map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 hover:bg-slate-50/60 transition"
                >
                  {/* Left: Thumbnail & Banner Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Dual Image Thumbnails: 1. Banner Image & 2. Card Image */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* 1. Banner Background Image */}
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-sm group/bimg flex items-center justify-center">
                          {(b.banner_image_url || b.banner?.image_url || b.banner_image) ? (
                            <a
                              href={b.banner_image_url || b.banner?.image_url || b.banner_image}
                              target="_blank"
                              rel="noreferrer"
                              title="Click to view full banner background image"
                              className="w-full h-full block"
                            >
                              <img
                                src={b.banner_image_url || b.banner?.image_url || b.banner_image}
                                alt="Banner BG"
                                className="w-full h-full object-cover group-hover/bimg:scale-105 transition"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </a>
                          ) : (
                            <div className="text-[10px] text-slate-400 text-center px-1 font-medium">
                              No Banner
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 bg-navy-950/85 text-[9px] text-white font-mono px-1 rounded">
                            #{b.id}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-tight">
                          1. Banner BG
                        </span>
                      </div>

                      {/* 2. Card Graphic Image */}
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-sm group/cimg flex items-center justify-center">
                          {(b.card_image_url || b.card?.image_url || b.card_image) ? (
                            <a
                              href={b.card_image_url || b.card?.image_url || b.card_image}
                              target="_blank"
                              rel="noreferrer"
                              title="Click to view full card graphic image"
                              className="w-full h-full block"
                            >
                              <img
                                src={b.card_image_url || b.card?.image_url || b.card_image}
                                alt="Card Visual"
                                className="w-full h-full object-cover group-hover/cimg:scale-105 transition"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </a>
                          ) : (
                            <div className="text-[10px] text-slate-400 text-center px-1 font-medium">
                              No Card
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-brand-600 mt-1 uppercase tracking-tight">
                          2. Card Img
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Badges & Section info */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {b.section || "home_hero"}
                        </span>
                        <Badge variant={b.status === "active" ? "success" : "default"}>
                          {b.status || "active"}
                        </Badge>
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Sort Order: {b.sort_order ?? 0}
                        </span>
                        {b.badge && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            ★ {b.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h4 className="font-bold text-sm text-navy-900 leading-snug">
                          {b.title}
                        </h4>
                        {b.subtitle && (
                          <p className="text-xs text-brand-600 font-medium">
                            {b.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Paragraph */}
                      {b.paragraph && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {b.paragraph}
                        </p>
                      )}

                      {/* Buttons & Card preview tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                        {b.btn1_text && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Btn 1: <strong>{b.btn1_text}</strong> ({b.btn1_link || "/"})
                          </span>
                        )}
                        {b.btn2_text && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Btn 2: <strong>{b.btn2_text}</strong> ({b.btn2_link || "/"})
                          </span>
                        )}
                        {b.card_btn_text && (
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded">
                            Card Action: <strong>{b.card_btn_text}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                        b.status === "active"
                          ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                          : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      {b.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-2 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(b);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 1. Pages Tab */}
        {activeTab === "pages" && (
          <div className="divide-y divide-slate-100">
            {pages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No static pages found.</div>
            ) : (
              pages.map((p) => (
                <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-navy-900">{p.title}</h4>
                      <Badge variant={p.status === "active" ? "success" : "default"}>{p.status || "active"}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">Slug: /{p.slug}</p>
                    <p className="text-xs text-slate-600 line-clamp-1">{p.content ? p.content.substring(0, 120) : "No content preview"}...</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      {p.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => {
                        setItemToEdit({ ...p });
                        setEditModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50"
                      title="Edit Page"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(p);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. FAQs Tab */}
        {activeTab === "faq" && (
          <div className="divide-y divide-slate-100">
            {faqs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No FAQs found.</div>
            ) : (
              faqs.map((f) => (
                <div key={f.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-2 py-0.5 rounded">
                        {f.category || "General"}
                      </span>
                      <Badge variant={f.status === "active" ? "success" : "default"}>{f.status || "active"}</Badge>
                    </div>
                    <h4 className="font-bold text-sm text-navy-900 mt-1">{f.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(f)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      {f.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => {
                        setItemToEdit({ ...f });
                        setEditModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(f);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Gallery Media Tab */}
        {activeTab === "gallery" && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.length === 0 ? (
              <div className="col-span-full p-8 text-center text-xs text-slate-400">No gallery media uploaded yet.</div>
            ) : (
              gallery.map((g) => (
                <div key={g.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="h-40 bg-slate-200 overflow-hidden relative">
                    <img src={g.image_url || g.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"} alt={g.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-navy-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {g.category || "Health Camps"}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h5 className="font-bold text-xs text-navy-900 leading-snug">{g.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{g.description || "Healthcare campaign event"}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <Badge variant={g.status === "active" ? "success" : "default"}>{g.status || "active"}</Badge>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleStatus(g)} className="text-[11px] text-slate-600 hover:text-brand-600 px-1 font-semibold">
                          Toggle
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(g);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="divide-y divide-slate-100">
            {testimonials.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No member testimonials found.</div>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-navy-900">{t.name}</h4>
                      <span className="text-xs text-slate-500">({t.role || "Member"}, {t.district || "West Tripura"})</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: Number(t.rating) || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <Badge variant={t.status === "active" ? "success" : "default"}>{t.status || "active"}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{t.content || t.comment || "Great healthcare discounts in Tripura!"}"</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(t)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      {t.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(t);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. Management Team Tab */}
        {activeTab === "team" && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {team.length === 0 ? (
              <div className="col-span-full p-8 text-center text-xs text-slate-400">No management team members found.</div>
            ) : (
              team.map((m) => (
                <div key={m.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                      alt={m.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-navy-900 leading-snug">{m.name}</h5>
                      <p className="text-[11px] text-brand-600 font-semibold">{m.designation || "Director"}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{m.bio || "Healthcare Operations Leadership"}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <Badge variant={m.status === "active" ? "success" : "default"}>{m.status || "active"}</Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setItemToEdit({ ...m });
                          setEditModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(m);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Add New ${tabs.find((t) => t.id === activeTab)?.label.split(" ")[0]}`}
        subtitle={`POST ${tabs.find((t) => t.id === activeTab)?.desc}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddItem} className="space-y-4 text-xs">
          {activeTab === "banners" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Banner Title *"
                  placeholder="e.g. Tripura Healthcare Special Banner"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  required
                />
                <Input
                  label="Subtitle"
                  placeholder="e.g. Instant Health Cards at ₹49/Year"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Paragraph / Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Get up to 20% discount on medicines, lab diagnostics, and hospital care across Tripura..."
                  value={bannerForm.paragraph}
                  onChange={(e) => setBannerForm({ ...bannerForm, paragraph: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Badge Tag"
                  placeholder="e.g. Tripura Healthcare"
                  value={bannerForm.badge}
                  onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                />
                <Input
                  label="Section"
                  placeholder="home_hero"
                  value={bannerForm.section}
                  onChange={(e) => setBannerForm({ ...bannerForm, section: e.target.value })}
                />
                <Input
                  label="Sort Order"
                  type="number"
                  placeholder="0"
                  value={bannerForm.sort_order}
                  onChange={(e) => setBannerForm({ ...bannerForm, sort_order: e.target.value })}
                />
              </div>

              {/* Primary Button */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Button 1 (Primary CTA)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Btn 1 Text"
                    placeholder="e.g. Buy Health Card"
                    value={bannerForm.btn1_text}
                    onChange={(e) => setBannerForm({ ...bannerForm, btn1_text: e.target.value })}
                  />
                  <Input
                    label="Btn 1 Link"
                    placeholder="e.g. /card/register"
                    value={bannerForm.btn1_link}
                    onChange={(e) => setBannerForm({ ...bannerForm, btn1_link: e.target.value })}
                  />
                </div>
              </div>

              {/* Secondary Button */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Button 2 (Secondary CTA)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Btn 2 Text"
                    placeholder="e.g. Verify Card"
                    value={bannerForm.btn2_text}
                    onChange={(e) => setBannerForm({ ...bannerForm, btn2_text: e.target.value })}
                  />
                  <Input
                    label="Btn 2 Link"
                    placeholder="e.g. /verify"
                    value={bannerForm.btn2_link}
                    onChange={(e) => setBannerForm({ ...bannerForm, btn2_link: e.target.value })}
                  />
                </div>
              </div>

              {/* Image 1: Banner Background Image (banner_image) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      1. Banner Background Image (Select From Device)
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Landscape banner image displayed in the hero backdrop
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-brand-600 bg-orange-100/70 px-2 py-0.5 rounded">
                    banner_image
                  </span>
                </div>

                {bannerForm.banner_image_preview ? (
                  <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white p-2.5 flex items-center gap-3">
                    <img
                      src={bannerForm.banner_image_preview}
                      alt="Banner Preview"
                      className="w-24 h-14 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-navy-900 truncate">
                        {bannerForm.banner_image_file?.name || "Banner Background Selected"}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        {bannerForm.banner_image_file?.size
                          ? `Ready to upload (${(bannerForm.banner_image_file.size / 1024).toFixed(1)} KB)`
                          : "Image chosen"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => addBannerFileRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBannerForm((prev) => ({
                            ...prev,
                            banner_image_file: null,
                            banner_image_preview: "",
                            banner_image: ""
                          }));
                          if (addBannerFileRef.current) addBannerFileRef.current.value = "";
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Remove banner image"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => addBannerFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-4 text-center cursor-pointer transition hover:bg-orange-50/20 group bg-white"
                  >
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-500 mx-auto mb-1 transition-colors" />
                    <p className="text-xs font-bold text-slate-700 group-hover:text-brand-600">
                      Click to choose Banner Background image file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Landscape ratio recommended (PNG, JPG, WEBP)
                    </p>
                  </div>
                )}

                <input
                  ref={addBannerFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setBannerForm((prev) => ({
                        ...prev,
                        banner_image_file: file,
                        banner_image_preview: previewUrl,
                        banner_image: file
                      }));
                    }
                  }}
                />
              </div>

              {/* Image 2: Health Card / Foreground Visual (card_image) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      2. Health Card / Foreground Image (Select From Device)
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Visual graphic displayed on the hero card (e.g. Health Card graphic)
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded">
                    card_image
                  </span>
                </div>

                {bannerForm.card_image_preview ? (
                  <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white p-2.5 flex items-center gap-3">
                    <img
                      src={bannerForm.card_image_preview}
                      alt="Card Preview"
                      className="w-20 h-16 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-navy-900 truncate">
                        {bannerForm.card_image_file?.name || "Card Graphic Selected"}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        {bannerForm.card_image_file?.size
                          ? `Ready to upload (${(bannerForm.card_image_file.size / 1024).toFixed(1)} KB)`
                          : "Image chosen"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => addCardFileRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBannerForm((prev) => ({
                            ...prev,
                            card_image_file: null,
                            card_image_preview: "",
                            card_image: ""
                          }));
                          if (addCardFileRef.current) addCardFileRef.current.value = "";
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Remove card image"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => addCardFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition hover:bg-purple-50/20 group bg-white"
                  >
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-500 mx-auto mb-1 transition-colors" />
                    <p className="text-xs font-bold text-slate-700 group-hover:text-purple-600">
                      Click to choose Health Card graphic image file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Card / Visual graphic (PNG, JPG, WEBP)
                    </p>
                  </div>
                )}

                <input
                  ref={addCardFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setBannerForm((prev) => ({
                        ...prev,
                        card_image_file: file,
                        card_image_preview: previewUrl,
                        card_image: file
                      }));
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Input
                    label="Card Button Text"
                    placeholder="e.g. Join at ₹49/Year"
                    value={bannerForm.card_btn_text}
                    onChange={(e) => setBannerForm({ ...bannerForm, card_btn_text: e.target.value })}
                  />
                  <Input
                    label="Card Button Link"
                    placeholder="e.g. /buy-card"
                    value={bannerForm.card_btn_link}
                    onChange={(e) => setBannerForm({ ...bannerForm, card_btn_link: e.target.value })}
                  />
                </div>
              </div>

              <Select
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" }
                ]}
                value={bannerForm.status}
                onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
              />
            </>
          )}

          {activeTab === "pages" && (
            <>
              <Input
                label="Page Title *"
                placeholder="e.g. Terms & Conditions"
                value={pageForm.title}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                required
              />
              <Input
                label="URL Slug *"
                placeholder="e.g. terms-and-conditions"
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Page Content (HTML/Markdown) *</label>
                <textarea
                  rows={5}
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "faq" && (
            <>
              <Input
                label="FAQ Category"
                placeholder="e.g. General, Discount, Enrollment"
                value={faqForm.category}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                required
              />
              <Input
                label="Question *"
                placeholder="e.g. How do I get discount at partner pharmacies?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Answer *</label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "gallery" && (
            <>
              <Input
                label="Image Title *"
                placeholder="e.g. Agartala Health Camp 2026"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                required
              />
              <Input
                label="Category *"
                placeholder="e.g. Health Camps, Card Distribution"
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                required
              />
              <Input
                label="Image URL *"
                placeholder="https://images.unsplash.com/photo-..."
                value={galleryForm.image_url}
                onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                required
              />
              <Input
                label="Description"
                placeholder="Short caption for the gallery photo"
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
              />
            </>
          )}

          {activeTab === "testimonials" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Member Name *"
                  placeholder="e.g. Pranab Debnath"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Role / Title"
                  placeholder="e.g. Member / Patient"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="District"
                  placeholder="e.g. West Tripura"
                  value={testimonialForm.district}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, district: e.target.value })}
                />
                <Select
                  label="Rating"
                  options={[
                    { label: "5 Stars ★★★★★", value: "5" },
                    { label: "4 Stars ★★★★", value: "4" },
                    { label: "3 Stars ★★★", value: "3" }
                  ]}
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Testimonial Content *</label>
                <textarea
                  rows={3}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "team" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Dr. A. K. Roy"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Designation *"
                  placeholder="e.g. Medical Director"
                  value={teamForm.designation}
                  onChange={(e) => setTeamForm({ ...teamForm, designation: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Photo URL"
                placeholder="https://images.unsplash.com/..."
                value={teamForm.photo}
                onChange={(e) => setTeamForm({ ...teamForm, photo: e.target.value })}
              />
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bio Summary</label>
                <textarea
                  rows={3}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={btnLoading}>
              Save Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {itemToEdit && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit ${activeTab.toUpperCase()} Item`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleEditItem} className="space-y-4 text-xs">
            {activeTab === "banners" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Banner Title *"
                    value={itemToEdit.title || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Subtitle"
                    value={itemToEdit.subtitle || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, subtitle: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Paragraph / Description</label>
                  <textarea
                    rows={3}
                    value={itemToEdit.paragraph || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, paragraph: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Badge Tag"
                    value={itemToEdit.badge || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, badge: e.target.value })}
                  />
                  <Input
                    label="Section"
                    value={itemToEdit.section || "home_hero"}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, section: e.target.value })}
                  />
                  <Input
                    label="Sort Order"
                    type="number"
                    value={itemToEdit.sort_order ?? 0}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, sort_order: e.target.value })}
                  />
                </div>

                {/* Primary Button */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Button 1 (Primary CTA)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Btn 1 Text"
                      value={itemToEdit.btn1_text || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, btn1_text: e.target.value })}
                    />
                    <Input
                      label="Btn 1 Link"
                      value={itemToEdit.btn1_link || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, btn1_link: e.target.value })}
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Button 2 (Secondary CTA)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Btn 2 Text"
                      value={itemToEdit.btn2_text || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, btn2_text: e.target.value })}
                    />
                    <Input
                      label="Btn 2 Link"
                      value={itemToEdit.btn2_link || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, btn2_link: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image 1: Banner Background Image (banner_image) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                        1. Banner Background Image (Select From Device)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Landscape banner image displayed in the hero backdrop
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-600 bg-orange-100/70 px-2 py-0.5 rounded">
                      banner_image
                    </span>
                  </div>

                  {(itemToEdit.banner_image_preview || itemToEdit.banner_image_url || itemToEdit.banner_image) ? (
                    <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white p-2.5 flex items-center gap-3">
                      <img
                        src={itemToEdit.banner_image_preview || itemToEdit.banner_image_url || itemToEdit.banner_image}
                        alt="Current Banner BG"
                        className="w-24 h-14 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-navy-900 truncate">
                          {itemToEdit.banner_image_file?.name || "Existing Banner BG"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {itemToEdit.banner_image_file?.size
                            ? `New file chosen (${(itemToEdit.banner_image_file.size / 1024).toFixed(1)} KB)`
                            : "Saved on server"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => editBannerFileRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setItemToEdit((prev) => ({
                              ...prev,
                              banner_image_file: null,
                              banner_image_preview: "",
                              banner_image: "",
                              banner_image_url: ""
                            }));
                            if (editBannerFileRef.current) editBannerFileRef.current.value = "";
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                          title="Remove banner image"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => editBannerFileRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-4 text-center cursor-pointer transition hover:bg-orange-50/20 group bg-white"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-500 mx-auto mb-1 transition-colors" />
                      <p className="text-xs font-bold text-slate-700 group-hover:text-brand-600">
                        Click to choose Banner Background image file
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  )}

                  <input
                    ref={editBannerFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setItemToEdit((prev) => ({
                          ...prev,
                          banner_image_file: file,
                          banner_image_preview: previewUrl,
                          banner_image: file
                        }));
                      }
                    }}
                  />
                </div>

                {/* Image 2: Health Card / Foreground Visual (card_image) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                        2. Health Card / Foreground Image (Select From Device)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Visual graphic displayed on the hero card
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded">
                      card_image
                    </span>
                  </div>

                  {(itemToEdit.card_image_preview || itemToEdit.card_image_url || itemToEdit.card_image) ? (
                    <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white p-2.5 flex items-center gap-3">
                      <img
                        src={itemToEdit.card_image_preview || itemToEdit.card_image_url || itemToEdit.card_image}
                        alt="Current Card Visual"
                        className="w-20 h-16 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-navy-900 truncate">
                          {itemToEdit.card_image_file?.name || "Existing Card Graphic"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {itemToEdit.card_image_file?.size
                            ? `New file chosen (${(itemToEdit.card_image_file.size / 1024).toFixed(1)} KB)`
                            : "Saved on server"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => editCardFileRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setItemToEdit((prev) => ({
                              ...prev,
                              card_image_file: null,
                              card_image_preview: "",
                              card_image: "",
                              card_image_url: ""
                            }));
                            if (editCardFileRef.current) editCardFileRef.current.value = "";
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                          title="Remove card image"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => editCardFileRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition hover:bg-purple-50/20 group bg-white"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-500 mx-auto mb-1 transition-colors" />
                      <p className="text-xs font-bold text-slate-700 group-hover:text-purple-600">
                        Click to choose Health Card graphic image file
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  )}

                  <input
                    ref={editCardFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setItemToEdit((prev) => ({
                          ...prev,
                          card_image_file: file,
                          card_image_preview: previewUrl,
                          card_image: file
                        }));
                      }
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Input
                      label="Card Button Text"
                      value={itemToEdit.card_btn_text || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, card_btn_text: e.target.value })}
                    />
                    <Input
                      label="Card Button Link"
                      value={itemToEdit.card_btn_link || ""}
                      onChange={(e) => setItemToEdit({ ...itemToEdit, card_btn_link: e.target.value })}
                    />
                  </div>
                </div>

                <Select
                  label="Status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" }
                  ]}
                  value={itemToEdit.status || "active"}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, status: e.target.value })}
                />
              </>
            )}

            {activeTab === "pages" && (
              <>
                <Input
                  label="Page Title *"
                  value={itemToEdit.title || ""}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, title: e.target.value })}
                  required
                />
                <Input
                  label="URL Slug *"
                  value={itemToEdit.slug || ""}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, slug: e.target.value })}
                  required
                />
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Content *</label>
                  <textarea
                    rows={6}
                    value={itemToEdit.content || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, content: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                    required
                  />
                </div>
              </>
            )}

            {activeTab === "faq" && (
              <>
                <Input
                  label="Category"
                  value={itemToEdit.category || "General"}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, category: e.target.value })}
                  required
                />
                <Input
                  label="Question *"
                  value={itemToEdit.question || ""}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, question: e.target.value })}
                  required
                />
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Answer *</label>
                  <textarea
                    rows={4}
                    value={itemToEdit.answer || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, answer: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                    required
                  />
                </div>
              </>
            )}

            {activeTab === "team" && (
              <>
                <Input
                  label="Full Name *"
                  value={itemToEdit.name || ""}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                  required
                />
                <Input
                  label="Designation *"
                  value={itemToEdit.designation || ""}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, designation: e.target.value })}
                  required
                />
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Bio Summary</label>
                  <textarea
                    rows={3}
                    value={itemToEdit.bio || ""}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, bio: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={btnLoading}>
                Update Item
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Deletion"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              Are you sure you want to permanently delete this {activeTab} entry?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" loading={btnLoading} onClick={handleDeleteItem}>
                Delete Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
