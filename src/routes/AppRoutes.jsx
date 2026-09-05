import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PartnerLayout } from "../layouts/PartnerLayout";
import { AgentLayout } from "../layouts/AgentLayout";
import { CardholderLayout } from "../layouts/CardholderLayout";
import { DistrictLayout } from "../layouts/DistrictLayout";

// Public Pages
import { HomePage } from "../pages/public/HomePage";
import { HowItWorksPage } from "../pages/public/HowItWorksPage";
import { FindPartnerPage } from "../pages/public/FindPartnerPage";
import { PricingPage } from "../pages/public/PricingPage";
import { BecomePartnerPage } from "../pages/public/BecomePartnerPage";
import { GalleryPage } from "../pages/public/GalleryPage";
import { TeamPage } from "../pages/public/TeamPage";
import { CardVerifyPage } from "../pages/public/CardVerifyPage";
import { BuyCardEnquiryPage } from "../pages/public/BuyCardEnquiryPage";
import { AboutPage } from "../pages/public/AboutPage";
import { FaqPage } from "../pages/public/FaqPage";
import { PrivacyPolicyPage } from "../pages/public/PrivacyPolicyPage";
import { DpdpaPolicyPage } from "../pages/public/DpdpaPolicyPage";
import { ContactPage } from "../pages/public/ContactPage";
import { LoginPage } from "../pages/public/LoginPage";
import { JoinUsPage } from "../pages/public/JoinUsPage";
import { PublicQrVerifyPage } from "../pages/public/PublicQrVerifyPage";

// Admin Pages
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminCardholdersPage } from "../pages/admin/AdminCardholdersPage";
import { AdminCardholderDetailPage } from "../pages/admin/AdminCardholderDetailPage";
import { AdminPartnersPage } from "../pages/admin/AdminPartnersPage";
import { AdminAgentsPage } from "../pages/admin/AdminAgentsPage";
import { AdminDistributorsPage } from "../pages/admin/AdminDistributorsPage";
import { AdminDistrictsPage } from "../pages/admin/AdminDistrictsPage";
import { AdminVerificationLogsPage } from "../pages/admin/AdminVerificationLogsPage";
import { AdminRenewalsPage } from "../pages/admin/AdminRenewalsPage";
import { AdminAnalyticsPage } from "../pages/admin/AdminAnalyticsPage";
import { AdminReportsPage } from "../pages/admin/AdminReportsPage";
import { AdminAuditLogsPage } from "../pages/admin/AdminAuditLogsPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";

// Partner Pages
import { PartnerDashboardPage } from "../pages/partner/PartnerDashboardPage";
import { PartnerVerifyPage } from "../pages/partner/PartnerVerifyPage";
import { PartnerVerificationsHistoryPage } from "../pages/partner/PartnerVerificationsHistoryPage";
import { PartnerProfilePage } from "../pages/partner/PartnerProfilePage";
import { PartnerServicesPage } from "../pages/partner/PartnerServicesPage";

// Field Agent Pages
import { AgentDashboardPage } from "../pages/agent/AgentDashboardPage";
import { AgentRegisterCardholderPage } from "../pages/agent/AgentRegisterCardholderPage";
import { AgentCardsListPage } from "../pages/agent/AgentCardsListPage";
import { AgentPerformancePage } from "../pages/agent/AgentPerformancePage";
import { AgentProfilePage } from "../pages/agent/AgentProfilePage";

// Cardholder Pages
import { CardholderCardPage } from "../pages/cardholder/CardholderCardPage";
import { CardholderRenewalPage } from "../pages/cardholder/CardholderRenewalPage";
import { CardholderProfilePage } from "../pages/cardholder/CardholderProfilePage";

// District Coordinator Pages
import { DistrictDashboardPage } from "../pages/district/DistrictDashboardPage";
import { DistrictAgentsPage } from "../pages/district/DistrictAgentsPage";
import { DistrictPartnersPage } from "../pages/district/DistrictPartnersPage";
import { DistrictCardsPage } from "../pages/district/DistrictCardsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Marketing Website */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="partners" element={<FindPartnerPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="become-partner" element={<BecomePartnerPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="verify" element={<CardVerifyPage />} />
        <Route path="enquiry" element={<BuyCardEnquiryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="dpdpa" element={<DpdpaPolicyPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="join-us" element={<JoinUsPage />} />
      </Route>

      {/* Standalone minimal QR scan verification */}
      <Route path="/verify/:token" element={<PublicQrVerifyPage />} />

      {/* 2. Admin Operations Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="cardholders" element={<AdminCardholdersPage />} />
        <Route path="cardholders/:id" element={<AdminCardholderDetailPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="agents" element={<AdminAgentsPage />} />
        <Route path="distributors" element={<AdminDistributorsPage />} />
        <Route path="districts" element={<AdminDistrictsPage />} />
        <Route path="verification" element={<AdminVerificationLogsPage />} />
        <Route path="renewals" element={<AdminRenewalsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 3. Partner Portal */}
      <Route path="/partner" element={<PartnerLayout />}>
        <Route index element={<PartnerDashboardPage />} />
        <Route path="verify" element={<PartnerVerifyPage />} />
        <Route path="verifications" element={<PartnerVerificationsHistoryPage />} />
        <Route path="profile" element={<PartnerProfilePage />} />
        <Route path="services" element={<PartnerServicesPage />} />
      </Route>

      {/* 4. Field Agent Portal */}
      <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<AgentDashboardPage />} />
        <Route path="register" element={<AgentRegisterCardholderPage />} />
        <Route path="cards" element={<AgentCardsListPage />} />
        <Route path="performance" element={<AgentPerformancePage />} />
        <Route path="profile" element={<AgentProfilePage />} />
      </Route>

      {/* 5. Cardholder Member Portal */}
      <Route path="/cardholder" element={<CardholderLayout />}>
        <Route index element={<Navigate to="/cardholder/card" replace />} />
        <Route path="card" element={<CardholderCardPage />} />
        <Route path="renewal" element={<CardholderRenewalPage />} />
        <Route path="profile" element={<CardholderProfilePage />} />
      </Route>

      {/* 6. District Coordinator Portal */}
      <Route path="/district" element={<DistrictLayout />}>
        <Route index element={<Navigate to="/district/dashboard" replace />} />
        <Route path="dashboard" element={<DistrictDashboardPage />} />
        <Route path="agents" element={<DistrictAgentsPage />} />
        <Route path="partners" element={<DistrictPartnersPage />} />
        <Route path="cards" element={<DistrictCardsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
