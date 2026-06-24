// Auth API
export {
	type AdminUser,
	getSession,
	loginAdmin,
	logout,
} from "./auth";

// Churches API
export {
	type Church,
	type ChurchInsert,
	type ChurchUpdate,
	getChurch,
	getChurches,
	getChurchStats,
	updateChurch,
	updateChurchStatus,
} from "./churches";
// Content API
export {
	approveContent,
	type ContentItem,
	getContentItem,
	getContentItems,
	getContentStats,
	rejectContent,
} from "./content";
// Dashboard API
export {
	type DashboardStats,
	getDashboardStats,
	getRecentActivities,
} from "./dashboard";

// Donations API
export {
	type Donation,
	type DonationCampaign,
	getCampaign,
	getCampaigns,
	getDonationStats,
	getDonations,
	updateCampaignStatus,
} from "./donations";

// Events API
export {
	type Event,
	getEvent,
	getEventStats,
	getEvents,
	updateEventStatus,
} from "./events";
// Users API
export {
	assignUserRole,
	getUser,
	getUserStats,
	getUsers,
	type Profile,
	removeUserRole,
	type UserRole,
} from "./users";
