// Auth API
export {
  loginAdmin,
  getSession,
  logout,
  type AdminUser,
} from "./auth";

// Churches API
export {
  getChurches,
  getChurch,
  updateChurchStatus,
  updateChurch,
  getChurchStats,
  type Church,
  type ChurchInsert,
  type ChurchUpdate,
} from "./churches";

// Users API
export {
  getUsers,
  getUser,
  assignUserRole,
  removeUserRole,
  getUserStats,
  type Profile,
  type UserRole,
} from "./users";

// Content API
export {
  getContentItems,
  getContentItem,
  approveContent,
  rejectContent,
  getContentStats,
  type ContentItem,
} from "./content";

// Donations API
export {
  getDonations,
  getCampaigns,
  getCampaign,
  updateCampaignStatus,
  getDonationStats,
  type Donation,
  type DonationCampaign,
} from "./donations";

// Events API
export {
  getEvents,
  getEvent,
  updateEventStatus,
  getEventStats,
  type Event,
} from "./events";

// Dashboard API
export {
  getDashboardStats,
  getRecentActivities,
  type DashboardStats,
} from "./dashboard";
