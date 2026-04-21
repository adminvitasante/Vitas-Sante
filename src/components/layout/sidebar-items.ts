export type NavItem = {
  label: string;
  icon: string;
  href: string;
};

export type SidebarConfig = {
  title: string;
  subtitle: string;
  items: NavItem[];
  ctaLabel?: string;
  ctaIcon?: string;
  ctaHref?: string;
  bottomItems: NavItem[];
};

export const sidebarConfigs: Record<string, SidebarConfig> = {
  member: {
    title: "Vita Santé Portal",
    subtitle: "Member Portal",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Medical Card", icon: "medical_services", href: "/medical-card" },
      { label: "Find a Doctor", icon: "stethoscope", href: "/doctors" },
      { label: "Dependents", icon: "groups", href: "/dependents" },
      { label: "Payments", icon: "payments", href: "/payments" },
      { label: "Profile", icon: "person", href: "/profile" },
      { label: "Health Analytics", icon: "monitoring", href: "/analytics" },
    ],
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  doctor: {
    title: "Vita Santé Portal",
    subtitle: "Clinical Professional",
    items: [
      { label: "Verification", icon: "verified_user", href: "/verification" },
      { label: "Patient Care", icon: "clinical_notes", href: "/patient-care" },
      { label: "Visit History", icon: "history", href: "/visit-history" },
      { label: "Profile", icon: "person", href: "/profile" },
    ],
    ctaLabel: "New Patient Visit",
    ctaIcon: "add_circle",
    ctaHref: "/patient-care",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  affiliate: {
    title: "Vita Santé Portal",
    subtitle: "Affiliate Partner",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Referrals", icon: "people", href: "/referrals" },
      { label: "Commissions", icon: "payments", href: "/commissions" },
      { label: "Marketing", icon: "campaign", href: "/marketing" },
    ],
    ctaLabel: "Generate Referral Link",
    ctaIcon: "link",
    ctaHref: "/marketing",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  sponsor: {
    title: "Vita Santé Portal",
    subtitle: "Institutional Sponsor",
    items: [
      { label: "Overview", icon: "dashboard", href: "/overview" },
      { label: "Funded Members", icon: "groups", href: "/funded-members" },
      { label: "Impact Reports", icon: "assessment", href: "/impact-reports" },
      { label: "Billing", icon: "receipt_long", href: "/billing" },
    ],
    ctaLabel: "Support More Members",
    ctaIcon: "volunteer_activism",
    ctaHref: "/sponsor-new",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  admin: {
    title: "Vita Santé Admin",
    subtitle: "Mission Control",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Members", icon: "people", href: "/members" },
      { label: "Doctors", icon: "medical_services", href: "/doctors" },
      { label: "Affiliates", icon: "handshake", href: "/affiliates" },
      { label: "Plan Config", icon: "tune", href: "/plans" },
      { label: "System Logs", icon: "terminal", href: "/logs" },
      { label: "Design System", icon: "palette", href: "/design-system" },
    ],
    ctaLabel: "View System Logs",
    ctaIcon: "terminal",
    ctaHref: "/logs",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
};
