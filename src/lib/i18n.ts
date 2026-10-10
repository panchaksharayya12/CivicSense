export type LanguageCode = "en" | "kn" | "hi" | "te" | "ta" | "mr";

export interface TranslationDictionary {
  // Brand
  brandName: string;
  tagline: string;

  // Navbar
  navHome: string;
  navReport: string;
  navTrack: string;
  navAbout: string;
  navHelp: string;
  navLogin: string;
  navRegister: string;
  navSignOut: string;
  navCitizenDash: string;
  navAdminOps: string;

  // Hero
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroReportBtn: string;
  heroTrackBtn: string;
  heroLookupPlaceholder: string;
  heroTrackNow: string;

  // Domains
  selectDomainHeader: string;
  selectDomainSubtitle: string;

  // Dashboard
  greetingGoodMorning: string;
  greetingGoodAfternoon: string;
  greetingGoodEvening: string;
  greetingGoodNight: string;
  dashboardSubheader: string;
  statActiveApps: string;
  statInProgress: string;
  statResolved: string;
  quickActionsTitle: string;
  quickReportDesc: string;
  quickAppsDesc: string;
  quickStatusDesc: string;
  quickNotifDesc: string;
  recentAppsTitle: string;
  viewAll: string;
  tableColAppNo: string;
  tableColIssue: string;
  tableColStatus: string;
  tableColDate: string;
  tableColAction: string;
  noAppsYet: string;

  // Report Form
  stepIssueDetails: string;
  stepLocation: string;
  stepAddPhoto: string;
  stepReview: string;
  selectDomainLabel: string;
  selectIssueLabel: string;
  problemDescLabel: string;
  problemDescPlaceholder: string;
  voiceTypingSpeak: string;
  optCurrentLocation: string;
  optDetectLocation: string;
  optManualAddress: string;
  optManualPlaceholder: string;
  uploadPhotoLabel: string;
  choosePhotoBtn: string;
  photoOptionalTip: string;
  reviewTitle: string;
  submitComplaintBtn: string;
  submittedSuccess: string;
  appNumberLabel: string;
  trackStatusBtn: string;

  // Notifications
  notificationsTitle: string;
  notificationsSubtitle: string;
  markAllRead: string;
  filterAll: string;
  filterUnread: string;
  noNotificationsFound: string;
  loadingNotifications: string;
  notifTrackBtn: string;

  // Sidebar
  sidebarDashboard: string;
  sidebarReport: string;
  sidebarMyApps: string;
  sidebarStatus: string;
  sidebarNotifications: string;
  sidebarHelp: string;
  sidebarAIChat: string;
  sidebarOnline: string;
  sidebarCityActionCore: string;
  sidebarCityActionCoreDesc: string;

  // Applications
  myApplicationsTitle: string;
  myApplicationsSubtitle: string;
  searchPlaceholder: string;
  allDomains: string;
  allStatuses: string;
  tableColLocation: string;
  noMatchedApps: string;
  trackStatus: string;

  // Status Badges
  statusSubmitted: string;
  statusVerified: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;

  // Help
  helpEmergencyTitle: string;
  emergencyAlert: string;
  callNow: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandName: "CivicSense",
    tagline: "From Citizen Voice to City Action.",
    navHome: "Home",
    navReport: "Report a Problem",
    navTrack: "Track Status",
    navAbout: "About",
    navHelp: "Help",
    navLogin: "Login",
    navRegister: "Register",
    navSignOut: "Sign Out",
    navCitizenDash: "Citizen Dashboard",
    navAdminOps: "Admin Operations",
    heroTitle1: "From Citizen Voice",
    heroTitle2: "to City Action.",
    heroSubtitle: "Report civic issues, track progress, and help build a cleaner, safer, smarter city — together. Powered by location intelligence and AI incident consolidation.",
    heroReportBtn: "Report a Problem",
    heroTrackBtn: "Track Your Complaint",
    heroLookupPlaceholder: "Enter Application No (e.g. CS-2026-00001)...",
    heroTrackNow: "Track Now",
    selectDomainHeader: "Select a Domain to Report",
    selectDomainSubtitle: "Our AI automatically detects the category from your description or voice, or you can pick directly:",
    greetingGoodMorning: "Good Morning",
    greetingGoodAfternoon: "Good Afternoon",
    greetingGoodEvening: "Good Evening",
    greetingGoodNight: "Good Night",
    dashboardSubheader: "Together we can build a cleaner, safer and better city.",
    statActiveApps: "Active Applications",
    statInProgress: "In Progress",
    statResolved: "Resolved",
    quickActionsTitle: "Quick Actions",
    quickReportDesc: "Submit a new civic issue",
    quickAppsDesc: "View your complaints",
    quickStatusDesc: "Check complaint status",
    quickNotifDesc: "View latest updates",
    recentAppsTitle: "Recent Applications",
    viewAll: "View All",
    tableColAppNo: "Application No.",
    tableColIssue: "Issue",
    tableColStatus: "Status",
    tableColDate: "Date",
    tableColAction: "Action",
    noAppsYet: "No applications submitted yet. Click 'Report a Problem' to begin!",
    stepIssueDetails: "Issue Details",
    stepLocation: "Location",
    stepAddPhoto: "Add Photo / Video",
    stepReview: "Review",
    selectDomainLabel: "Select Domain *",
    selectIssueLabel: "Select Issue *",
    problemDescLabel: "Problem Description *",
    problemDescPlaceholder: "Describe what is wrong, landmarks, and severity...",
    voiceTypingSpeak: "Speak (Voice Typing)",
    optCurrentLocation: "Option 1 — Use Current Location",
    optDetectLocation: "Detect Location",
    optManualAddress: "Option 2 — Enter Address Manually",
    optManualPlaceholder: "e.g. Near Main College Gate, 5th Block, Koramangala, Bengaluru",
    uploadPhotoLabel: "Upload Photo / Video Evidence",
    choosePhotoBtn: "Choose Photo",
    photoOptionalTip: "Photo and video recordings are optional evidence. If you do not have files, you can proceed directly to Review.",
    reviewTitle: "Review Complaint Before Submission",
    submitComplaintBtn: "Submit Complaint",
    submittedSuccess: "Complaint Submitted Successfully",
    appNumberLabel: "Application Number",
    notificationsTitle: "Notifications",
    notificationsSubtitle: "Real-time updates on your civic complaints and municipal actions.",
    markAllRead: "Mark all as read",
    filterAll: "All",
    filterUnread: "Unread",
    noNotificationsFound: "No notifications found in this view.",
    loadingNotifications: "Loading notifications...",
    notifTrackBtn: "Track",

    sidebarDashboard: "Dashboard",
    sidebarReport: "Report a Problem",
    sidebarMyApps: "My Applications",
    sidebarStatus: "Status",
    sidebarNotifications: "Notifications",
    sidebarHelp: "Help & Emergency",
    sidebarAIChat: "CivicSense AI",
    sidebarOnline: "Online",
    sidebarCityActionCore: "City Action Core",
    sidebarCityActionCoreDesc: "Multiple citizen voices consolidate into unified municipal action. Track your neighborhood impact.",

    myApplicationsTitle: "My Applications",
    myApplicationsSubtitle: "Manage and track all civic problems submitted by your account.",
    searchPlaceholder: "Search by application number, issue or address...",
    allDomains: "All Domains",
    allStatuses: "All Statuses",
    tableColLocation: "Location",
    noMatchedApps: "No applications matched your search filters.",
    trackStatus: "Track Status",

    statusSubmitted: "Submitted",
    statusVerified: "Verified",
    statusAssigned: "Assigned",
    statusInProgress: "In Progress",
    statusResolved: "Resolved",
    statusRejected: "Rejected",

    helpEmergencyTitle: "Help & Emergency Assistance",
    emergencyAlert: "Immediate Life Threat or Severe Emergency? Call 112 / 101",
    callNow: "Call Now",
  },
  kn: {
    brandName: "ಸಿವಿಕ್ ಸೆನ್ಸ್",
    tagline: "ನಾಗರಿಕ ಧ್ವನಿಯಿಂದ ನಗರದ ಕ್ರಮದವರೆಗೆ.",
    navHome: "ಮುಖಪುಟ",
    navReport: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    navTrack: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    navAbout: "ಕುರಿತು",
    navHelp: "ಸಹಾಯವಾಣಿ",
    navLogin: "ಲಾಗಿನ್",
    navRegister: "ನೋಂದಣಿ",
    navSignOut: "ಸೈನ್ ಔಟ್",
    navCitizenDash: "ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navAdminOps: "ಅಧಿಕಾರಿ ಕಮಾಂಡ್",
    heroTitle1: "ನಾಗರಿಕ ಧ್ವನಿಯಿಂದ",
    heroTitle2: "ನಗರದ ತ್ವರಿತ ಕ್ರಮಕ್ಕೆ.",
    heroSubtitle: "ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ, ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಸ್ವಚ್ಛ, ಸುರಕ್ಷಿತ ನಗರವನ್ನು ಒಟ್ಟಾಗಿ ನಿರ್ಮಿಸಿ.",
    heroReportBtn: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    heroTrackBtn: "ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    heroLookupPlaceholder: "ಅರ್ಜಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: CS-2026-00001)...",
    heroTrackNow: "ಈಗ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    selectDomainHeader: "ವರದಿ ಮಾಡಲು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectDomainSubtitle: "ನಮ್ಮ AI ನಿಮ್ಮ ಧ್ವನಿ ಅಥವಾ ವಿವರಣೆಯಿಂದ ವರ್ಗವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆ ಮಾಡುತ್ತದೆ:",
    greetingGoodMorning: "ಶುಭೋದಯ",
    greetingGoodAfternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
    greetingGoodEvening: "ಶುಭ ಸಂಜೆ",
    greetingGoodNight: "ಶುಭ ರಾತ್ರಿ",
    dashboardSubheader: "ಒಟ್ಟಾಗಿ ನಾವು ಸ್ವಚ್ಛ, ಸುರಕ್ಷಿತ ಮತ್ತು ಉತ್ತಮ ನಗರವನ್ನು ನಿರ್ಮಿಸಬಹುದು.",
    statActiveApps: "ಸಕ್ರಿಯ ಅರ್ಜಿಗಳು",
    statInProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    statResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    quickActionsTitle: "ತ್ವರಿತ ಕ್ರಮಗಳು",
    quickReportDesc: "ಹೊಸ ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    quickAppsDesc: "ನಿಮ್ಮ ದೂರುಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    quickStatusDesc: "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    quickNotifDesc: "ಇತ್ತೀಚಿನ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    recentAppsTitle: "ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    tableColAppNo: "ಅರ್ಜಿ ಸಂಖ್ಯೆ",
    tableColIssue: "ಸಮಸ್ಯೆ",
    tableColStatus: "ಸ್ಥಿತಿ",
    tableColDate: "ದಿನಾಂಕ",
    tableColAction: "ಕ್ರಮ",
    noAppsYet: "ಇನ್ನೂ ಯಾವುದೇ ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸಲಾಗಿಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' ಕ್ಲಿಕ್ ಮಾಡಿ!",
    stepIssueDetails: "ಸಮಸ್ಯೆಯ ವಿವರ",
    stepLocation: "ಸ್ಥಳ",
    stepAddPhoto: "ಫೋಟೋ / ವೀಡಿಯೊ ಸೇರಿಸಿ",
    stepReview: "ಪರಿಶೀಲನೆ",
    selectDomainLabel: "ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ *",
    selectIssueLabel: "ಸಮಸ್ಯೆಯ ಪ್ರಕಾರ *",
    problemDescLabel: "ಸಮಸ್ಯೆಯ ವಿವರಣೆ *",
    problemDescPlaceholder: "ಸಮಸ್ಯೆ ಏನು ಎಂಬುದನ್ನು ಧ್ವನಿ ಅಥವಾ ಟೈಪಿಂಗ್ ಮೂಲಕ ವಿವರಿಸಿ...",
    voiceTypingSpeak: "ಮಾತನಾಡಿ (ಧ್ವನಿ ಟೈಪಿಂಗ್)",
    optCurrentLocation: "ಆಯ್ಕೆ 1 — ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
    optDetectLocation: "ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಿ",
    optManualAddress: "ಆಯ್ಕೆ 2 — ವಿಳಾಸವನ್ನು ಕೈಯಾರೆ ಟೈಪ್ ಮಾಡಿ",
    optManualPlaceholder: "ಉದಾ: ಮುಖ್ಯ ಕಾಲೇಜು ಗೇಟ್ ಹತ್ತಿರ, ಕೋರಮಂಗಲ 5ನೇ ಬ್ಲಾಕ್, ಬೆಂಗಳೂರು",
    uploadPhotoLabel: "ಫೋಟೋ / ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    choosePhotoBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ",
    photoOptionalTip: "ಫೋಟೋ ಮತ್ತು ವೀಡಿಯೊ ಐಚ್ಛಿಕ ಪುರಾವೆಯಾಗಿದೆ. ನಿಮ್ಮಲ್ಲಿ ಮಾಧ್ಯಮವಿಲ್ಲದಿದ್ದರೂ ಮುಂದುವರಿಯಬಹುದು.",
    reviewTitle: "ಸಲ್ಲಿಸುವ ಮೊದಲು ದೂರನ್ನು ಪರಿಶೀಲಿಸಿ",
    submitComplaintBtn: "ದೂರು ಸಲ್ಲಿಸಿ",
    submittedSuccess: "ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    appNumberLabel: "ಅರ್ಜಿ ಸಂಖ್ಯೆ",
    trackStatusBtn: "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ →",
    notificationsTitle: "ಸೂಚನೆಗಳು",
    notificationsSubtitle: "ನಿಮ್ಮ ನಾಗರಿಕ ದೂರುಗಳು ಮತ್ತು ಮುನ್ಸಿಪಲ್ ಕ್ರಮಗಳ ನೈಜ-ಸಮಯದ ನವೀಕರಣಗಳು.",
    markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    filterAll: "ಎಲ್ಲವೂ",
    filterUnread: "ಓದದಿರುವುದು",
    noNotificationsFound: "ಯಾವುದೇ ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ.",
    loadingNotifications: "ಸೂಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    notifTrackBtn: "ಟ್ರ್ಯಾಕ್",

    sidebarDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    sidebarReport: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    sidebarMyApps: "ನನ್ನ ಅರ್ಜಿಗಳು",
    sidebarStatus: "ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ",
    sidebarNotifications: "ಸೂಚನೆಗಳು",
    sidebarHelp: "ಸಹಾಯ ಮತ್ತು ತುರ್ತು",
    sidebarAIChat: "ಸಿವಿಕ್ ಸೆನ್ಸ್ AI",
    sidebarOnline: "ಆನ್‌ಲೈನ್",
    sidebarCityActionCore: "ನಗರ ಕ್ರಮ ಕೇಂದ್ರ",
    sidebarCityActionCoreDesc: "ನಾಗರಿಕ ಧ್ವನಿಗಳು ಒಟ್ಟಾಗಿ 1 ಮುನ್ಸಿಪಲ್ ಕ್ರಮವಾಗಿ ಬದಲಾಗುತ್ತವೆ. ನಿಮ್ಮ ಬಡಾವಣೆಯ ಪ್ರಭಾವವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",

    myApplicationsTitle: "ನನ್ನ ಅರ್ಜಿಗಳು",
    myApplicationsSubtitle: "ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಸಲ್ಲಿಸಲಾದ ಎಲ್ಲಾ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    searchPlaceholder: "ಅರ್ಜಿ ಸಂಖ್ಯೆ, ಸಮಸ್ಯೆ ಅಥವಾ ವಿಳಾಸದ ಮೂಲಕ ಹುಡುಕಿ...",
    allDomains: "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",
    allStatuses: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    tableColLocation: "ಸ್ಥಳ",
    noMatchedApps: "ಯಾವುದೇ ಅರ್ಜಿಗಳು ನಿಮ್ಮ ಶೋಧನೆಗೆ ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ.",
    trackStatus: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",

    statusSubmitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    statusVerified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    statusAssigned: "ನಿಯೋಜಿಸಲಾಗಿದೆ",
    statusInProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    statusResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    statusRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",

    helpEmergencyTitle: "ಸಹಾಯ ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳು",
    emergencyAlert: "ಜೀವಕ್ಕೆ ತಕ್ಷಣದ ಅಪಾಯವಿದೆಯೇ? 112 / 101 ಗೆ ಕರೆ ಮಾಡಿ",
    callNow: "ಈಗಲೇ ಕರೆ ಮಾಡಿ",
  },
  hi: {
    brandName: "सिविक सेंस",
    tagline: "नागरिक की आवाज़ से शहर की कार्रवाई तक।",
    navHome: "होम",
    navReport: "समस्या दर्ज करें",
    navTrack: "स्थिति देखें",
    navAbout: "परिचय",
    navHelp: "हेल्पलाइन",
    navLogin: "लॉग इन",
    navRegister: "पंजीकरण",
    navSignOut: "साइन आउट",
    navCitizenDash: "नागरिक डैशबोर्ड",
    navAdminOps: "प्रशासनिक कमांड",
    heroTitle1: "नागरिक आवाज़ से",
    heroTitle2: "शहर की कार्रवाई तक।",
    heroSubtitle: "नागरिक समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें और मिलकर एक स्वच्छ, सुरक्षित और स्मार्ट शहर बनाएं।",
    heroReportBtn: "समस्या दर्ज करें",
    heroTrackBtn: "शिकायत ट्रैक करें",
    heroLookupPlaceholder: "आवेदन संख्या दर्ज करें (जैसे CS-2026-00001)...",
    heroTrackNow: "अभी ट्रैक करें",
    selectDomainHeader: "रिपोर्ट करने के लिए श्रेणी चुनें",
    selectDomainSubtitle: "हमारा AI आपके विवरण या आवाज़ से श्रेणी को पहचान लेता है:",
    greetingGoodMorning: "शुभ प्रभात",
    greetingGoodAfternoon: "शुभ दोपहर",
    greetingGoodEvening: "शुभ संध्या",
    greetingGoodNight: "शुभ रात्रि",
    dashboardSubheader: "हम मिलकर अपने शहर को स्वच्छ और सुरक्षित बना सकते हैं।",
    statActiveApps: "सक्रिय आवेदन",
    statInProgress: "प्रगति पर",
    statResolved: "हल किया गया",
    quickActionsTitle: "त्वरित कार्रवाई",
    quickReportDesc: "नई शिकायत दर्ज करें",
    quickAppsDesc: "अपने आवेदन देखें",
    quickStatusDesc: "स्थिति की जांच करें",
    quickNotifDesc: "नए अपडेट देखें",
    recentAppsTitle: "हालिया आवेदन",
    viewAll: "सभी देखें",
    tableColAppNo: "आवेदन सं.",
    tableColIssue: "समस्या",
    tableColStatus: "स्थिति",
    tableColDate: "तारीख",
    tableColAction: "कार्रवाई",
    noAppsYet: "अभी तक कोई आवेदन दर्ज नहीं हुआ है। शुरुआत के लिए 'समस्या दर्ज करें' पर क्लिक करें!",
    stepIssueDetails: "समस्या विवरण",
    stepLocation: "स्थान",
    stepAddPhoto: "फोटो / वीडियो जोड़ें",
    stepReview: "समीक्षा",
    selectDomainLabel: "श्रेणी चुनें *",
    selectIssueLabel: "समस्या चुनें *",
    problemDescLabel: "समस्या का विवरण *",
    problemDescPlaceholder: "बोलकर या लिखकर बताएं कि क्या समस्या है...",
    voiceTypingSpeak: "बोलें (वॉयस टाइपिंग)",
    optCurrentLocation: "विकल्प 1 — वर्तमान स्थान का उपयोग करें",
    optDetectLocation: "स्थान का पता लगाएं",
    optManualAddress: "विकल्प 2 — पता मैन्युअल रूप से दर्ज करें",
    optManualPlaceholder: "जैसे: मेन कॉलेज गेट के पास, कोरमंगला, बेंगलुरु",
    uploadPhotoLabel: "फोटो / वीडियो अपलोड करें",
    choosePhotoBtn: "फोटो चुनें",
    photoOptionalTip: "फोटो और वीडियो वैकल्पिक साक्ष्य हैं। फाइल न होने पर भी आप सीधे समीक्षा पर आगे बढ़ सकते हैं।",
    reviewTitle: "जमा करने से पहले शिकायत की समीक्षा करें",
    submitComplaintBtn: "शिकायत दर्ज करें",
    submittedSuccess: "शिकायत सफलतापूर्वक दर्ज की गई",
    appNumberLabel: "आवेदन संख्या",
    trackStatusBtn: "स्थिति ट्रैक करें →",
    notificationsTitle: "सूचनाएं",
    notificationsSubtitle: "आपकी शिकायतों और नगरपालिका कार्रवाई पर रीयल-टाइम अपडेट।",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    filterAll: "सभी",
    filterUnread: "अपठित",
    noNotificationsFound: "इस दृश्य में कोई सूचना नहीं मिली।",
    loadingNotifications: "सूचनाएं लोड हो रही हैं...",
    notifTrackBtn: "ट्रैक",

    sidebarDashboard: "डैशबोर्ड",
    sidebarReport: "समस्या दर्ज करें",
    sidebarMyApps: "मेरे आवेदन",
    sidebarStatus: "स्थिति देखें",
    sidebarNotifications: "सूचनाएं",
    sidebarHelp: "सहायता और आपातकाल",
    sidebarAIChat: "सिविक सेंस AI",
    sidebarOnline: "ऑनलाइन",
    sidebarCityActionCore: "सिटी एक्शन कोर",
    sidebarCityActionCoreDesc: "कई नागरिक आवाजें एक नगरपालिका कार्रवाई में समेकित होती हैं। अपने क्षेत्र का प्रभाव देखें।",

    myApplicationsTitle: "मेरे आवेदन",
    myApplicationsSubtitle: "अपने खाते द्वारा दर्ज सभी समस्याओं को प्रबंधित और ट्रैक करें।",
    searchPlaceholder: "आवेदन संख्या, समस्या या पते से खोजें...",
    allDomains: "सभी विभाग",
    allStatuses: "सभी स्थितियाँ",
    tableColLocation: "स्थान",
    noMatchedApps: "आपके फ़िल्टर से कोई आवेदन मेल नहीं खाता।",
    trackStatus: "स्थिति ट्रैक करें",

    statusSubmitted: "दर्ज किया गया",
    statusVerified: "सत्यापित",
    statusAssigned: "आवंटित",
    statusInProgress: "प्रगति पर",
    statusResolved: "हल किया गया",
    statusRejected: "खारिज",

    helpEmergencyTitle: "मदद और आपातकालीन सहायता",
    emergencyAlert: "तत्काल आपात स्थिति? 112 / 101 पर कॉल करें",
    callNow: "अभी कॉल करें",
  },
  te: {
    brandName: "సివిక్ సెన్స్",
    tagline: "పౌరుల గళం నుండి నగర కార్యాచరణ వరకు.",
    navHome: "హోమ్",
    navReport: "సమస్యను నివేదించండి",
    navTrack: "స్థితి ట్రాక్ చేయండి",
    navAbout: "గురించి",
    navHelp: "హెల్ప్‌లైన్",
    navLogin: "లాగిన్",
    navRegister: "రిజిస్టర్",
    navSignOut: "సైన్ అవుట్",
    navCitizenDash: "సిటిజన్ డ్యాష్‌బోర్డ్",
    navAdminOps: "అడ్మిన్ కమాండ్",
    heroTitle1: "పౌరుల గళం నుండి",
    heroTitle2: "నగర కార్యాచరణ వరకు.",
    heroSubtitle: "పౌర సమస్యలను నివేదించండి, పురోగతిని ట్రాక్ చేయండి మరియు పరిశుభ్రమైన, సురక్షితమైన నగరాన్ని నిర్మించండి.",
    heroReportBtn: "సమస్యను నివేదించండి",
    heroTrackBtn: "ఫిర్యాదును ట్రాక్ చేయండి",
    heroLookupPlaceholder: "దరఖాస్తు నంబర్‌ను నమోదు చేయండి...",
    heroTrackNow: "ట్రాక్ చేయండి",
    selectDomainHeader: "విభాగాన్ని ఎంచుకోండి",
    selectDomainSubtitle: "మా AI మీ స్వరం లేదా వివరణ నుండి వర్గాన్ని గుర్తిస్తుంది:",
    greetingGoodMorning: "శుభోదయం",
    greetingGoodAfternoon: "శుభ మధ్యాహ్నం",
    greetingGoodEvening: "శుభ సాయంత్రం",
    greetingGoodNight: "శుభ రాత్రి",
    dashboardSubheader: "మనం కలిసి పరిశుభ్రమైన మరియు సురక్షితమైన నగరాన్ని నిర్మించగలం.",
    statActiveApps: "క్రియాశీల దరఖాస్తులు",
    statInProgress: "పురోగతిలో ఉంది",
    statResolved: "పరిష్కరించబడింది",
    quickActionsTitle: "త్వరిత చర్యలు",
    quickReportDesc: "కొత్త సమస్యను నివేదించండి",
    quickAppsDesc: "మీ ఫిర్యాదులను చూడండి",
    quickStatusDesc: "స్థితిని తనిఖీ చేయండి",
    quickNotifDesc: "తాజా అప్‌డేట్‌లు",
    recentAppsTitle: "ఇటీవలి దరఖాస్తులు",
    viewAll: "అన్నీ చూడండి",
    tableColAppNo: "దరఖాస్తు సంఖ్య",
    tableColIssue: "సమస్య",
    tableColStatus: "స్థితి",
    tableColDate: "తేదీ",
    tableColAction: "చర్య",
    noAppsYet: "ఇంకా ఎటువంటి దరఖాస్తులు లేవు. ప్రారంభించడానికి 'సమస్యను నివేదించండి' క్లిక్ చేయండి!",
    stepIssueDetails: "సమస్య వివరాలు",
    stepLocation: "స్థానం",
    stepAddPhoto: "ఫోటో / వీడియో జోడించండి",
    stepReview: "సమీక్ష",
    selectDomainLabel: "విభాగం *",
    selectIssueLabel: "సమస్య రకం *",
    problemDescLabel: "సమస్య వివరణ *",
    problemDescPlaceholder: "సమస్యను వివరించండి...",
    voiceTypingSpeak: "మాట్లాడండి (వాయిస్ టైపింగ్)",
    optCurrentLocation: "ఎంపిక 1 — ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
    optDetectLocation: "స్థానాన్ని గుర్తించండి",
    optManualAddress: "ఎంపిక 2 — చిరునామాను మాన్యువల్‌గా నమోదు చేయండి",
    optManualPlaceholder: "ఉదా: బెంగళూరు",
    uploadPhotoLabel: "ఫోటో / వీడియో అప్‌లోడ్ చేయండి",
    choosePhotoBtn: "ఫోటో ఎంచుకోండి",
    photoOptionalTip: "ఫోటో మరియు వీడియో ఐచ్ఛిక ఆధారాలు. మీ వద్ద ఫైల్స్ లేకపోయినా కొనసాగవచ్చు.",
    reviewTitle: "సమర్పించే ముందు సమీక్షించండి",
    submitComplaintBtn: "ఫిర్యాదు సమర్పించండి",
    submittedSuccess: "ఫిర్యాదు విజయవంతంగా సమర్పించబడింది",
    appNumberLabel: "దరఖాస్తు సంఖ్య",
    trackStatusBtn: "స్థితి ట్రాక్ చేయండి →",
    notificationsTitle: "నోటిఫికేషన్‌లు",
    notificationsSubtitle: "మీ పౌర ఫిర్యాదులు మరియు మున్సిపల్ చర్యలపై తాజా సమాచారం.",
    markAllRead: "అన్నీ చదివినట్లుగా గుర్తించండి",
    filterAll: "అన్నీ",
    filterUnread: "చదవనివి",
    noNotificationsFound: "ఈ విభాగంలో నోటిఫికేషన్‌లు లేవు.",
    loadingNotifications: "నోటిఫికేషన్‌లను లోడ్ చేస్తోంది...",
    notifTrackBtn: "ట్రాక్",

    sidebarDashboard: "డ్యాష్‌బోర్డ్",
    sidebarReport: "సమస్యను నివేదించండి",
    sidebarMyApps: "నా దరఖాస్తులు",
    sidebarStatus: "స్థితి తనిఖీ",
    sidebarNotifications: "నోటిఫికేషన్‌లు",
    sidebarHelp: "సహాయం & అత్యవసరం",
    sidebarAIChat: "సివిక్ సెన్స్ AI",
    sidebarOnline: "ఆన్‌లైన్",
    sidebarCityActionCore: "సిటీ యాక్షన్ కోర్",
    sidebarCityActionCoreDesc: "పౌరుల గళాలు మున్సిపల్ చర్యగా మారతాయి. మీ పరిసరాల ప్రభావాన్ని ట్రాక్ చేయండి.",

    myApplicationsTitle: "నా దరఖాస్తులు",
    myApplicationsSubtitle: "మీ ఖాతా ద్వారా సమర్పించిన అన్ని పౌర సమస్యలను నిర్వహించండి మరియు ట్రాక్ చేయండి.",
    searchPlaceholder: "దరఖాస్తు సంఖ్య, సమస్య లేదా చిరునామా ద్వారా శోధించండి...",
    allDomains: "అన్ని విభాగాలు",
    allStatuses: "అన్ని స్థితులు",
    tableColLocation: "స్థానం",
    noMatchedApps: "మీ శోధనకు తగిన దరఖాస్తులు లేవు.",
    trackStatus: "స్థితి ట్రాక్ చేయండి",

    statusSubmitted: "సమర్పించబడింది",
    statusVerified: "ధృవీకరించబడింది",
    statusAssigned: "కేటాయించబడింది",
    statusInProgress: "పురోగతిలో ఉంది",
    statusResolved: "పరిష్కరించబడింది",
    statusRejected: "తిరస్కరించబడింది",

    helpEmergencyTitle: "సహాయం & అత్యవసర సేవలు",
    emergencyAlert: "తక్షణ అత్యవసర సహాయం కోసం 112 / 101 కి కాల్ చేయండి",
    callNow: "ఇప్పుడే కాల్ చేయండి",
  },
  ta: {
    brandName: "சிவிக் சென்ஸ்",
    tagline: "குடிமக்கள் குரலில் இருந்து நகர நடவடிக்கை வரை.",
    navHome: "முகப்பு",
    navReport: "புகார் அளிக்கவும்",
    navTrack: "நிலை அறிய",
    navAbout: "பற்றி",
    navHelp: "உதவி எண்",
    navLogin: "உள்நுழைக",
    navRegister: "பதிவு செய்க",
    navSignOut: "வெளியேறுக",
    navCitizenDash: "குடிமக்கள் பலகை",
    navAdminOps: "நிர்வாக மையம்",
    heroTitle1: "குடிமக்கள் குரலில் இருந்து",
    heroTitle2: "நகர நடவடிக்கை வரை.",
    heroSubtitle: "நகரப் பிரச்சனைகளைத் தெரிவியுங்கள், முன்னேற்றத்தைக் கண்காணியுங்கள், சிறந்த நகரத்தை உருவாக்குங்கள்.",
    heroReportBtn: "புகார் அளிக்கவும்",
    heroTrackBtn: "புகாரைக் கண்காணிக்கவும்",
    heroLookupPlaceholder: "விண்ணப்ப எண்ணை உள்ளிடவும்...",
    heroTrackNow: "கண்காணிக்கவும்",
    selectDomainHeader: "பிரிவைத் தேர்ந்தெடுக்கவும்",
    selectDomainSubtitle: "எங்கள் AI உங்கள் குரல் அல்லது விளக்கத்திலிருந்து தானாகவே கண்டறியும்:",
    greetingGoodMorning: "காலை வணக்கம்",
    greetingGoodAfternoon: "மதிய வணக்கம்",
    greetingGoodEvening: "மாலை வணக்கம்",
    greetingGoodNight: "இனிய இரவு",
    dashboardSubheader: "நாம் இணைந்து தூய்மையான மற்றும் பாதுகாப்பான நகரத்தை உருவாக்குவோம்.",
    statActiveApps: "செயலில் உள்ள புகார்கள்",
    statInProgress: "செயல்பாட்டில் உள்ளது",
    statResolved: "தீர்க்கப்பட்டது",
    quickActionsTitle: "விரைவு நடவடிக்கைகள்",
    quickReportDesc: "புதிய புகாரை பதிவு செய்க",
    quickAppsDesc: "உங்கள் புகார்களைக் காண்க",
    quickStatusDesc: "நிலையைச் சரிபார்க்கவும்",
    quickNotifDesc: "சமீபத்திய அறிவிப்புகள்",
    recentAppsTitle: "சமீபத்திய புகார்கள்",
    viewAll: "அனைத்தையும் காண்க",
    tableColAppNo: "விண்ணப்ப எண்",
    tableColIssue: "பிரச்சனை",
    tableColStatus: "நிலை",
    tableColDate: "தேதி",
    tableColAction: "செயல்பாடு",
    noAppsYet: "இன்னும் புகார்கள் எதுவும் பதிவு செய்யப்படவில்லை. தொடங்க 'புகார் அளிக்கவும்' கிளிக் செய்க!",
    stepIssueDetails: "பிரச்சனை விவரம்",
    stepLocation: "இடம்",
    stepAddPhoto: "புகைப்படம் / வீடியோ சேர்க்க",
    stepReview: "மதிப்பாய்வு",
    selectDomainLabel: "துறை *",
    selectIssueLabel: "பிரச்சனை வகை *",
    problemDescLabel: "பிரச்சனை விளக்கம் *",
    problemDescPlaceholder: "பிரச்சனையை விவரிக்கவும்...",
    voiceTypingSpeak: "பேசவும் (குரல் தட்டச்சு)",
    optCurrentLocation: "விருப்பம் 1 — தற்போதைய இருப்பிடத்தைப் பயன்படுத்தவும்",
    optDetectLocation: "இருப்பிடத்தைக் கண்டறியவும்",
    optManualAddress: "விருப்பம் 2 — முகவரியை உள்ளிடவும்",
    optManualPlaceholder: "எ.கா: பெங்களூரு",
    uploadPhotoLabel: "புகைப்படம் / வீடியோ பதிவேற்றவும்",
    choosePhotoBtn: "புகைப்படம் தேர்வு செய்க",
    photoOptionalTip: "புகைப்படம் மற்றும் வீடியோ கட்டாயமில்லை. கோப்புகள் இன்றியும் புகார் சமர்ப்பிக்கலாம்.",
    reviewTitle: "சமர்ப்பிக்கும் முன் மதிப்பாய்வு செய்க",
    submitComplaintBtn: "புகாரைச் சமர்ப்பிக்கவும்",
    submittedSuccess: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது",
    appNumberLabel: "விண்ணப்ப எண்",
    trackStatusBtn: "நிலையைக் கண்காணிக்கவும் →",
    notificationsTitle: "அறிவிப்புகள்",
    notificationsSubtitle: "உங்கள் புகார்கள் மற்றும் நகராட்சி நடவடிக்கைகள் குறித்த நிகழ்நேர அறிவிப்புகள்.",
    markAllRead: "அனைத்தையும் படித்ததாகக் குறிக்கவும்",
    filterAll: "அனைத்தும்",
    filterUnread: "படிக்காதவை",
    noNotificationsFound: "அறிவிப்புகள் எதுவும் இல்லை.",
    loadingNotifications: "அறிவிப்புகள் ஏற்றப்படுகின்றன...",
    notifTrackBtn: "கண்காணி",

    sidebarDashboard: "குடிமக்கள் பலகை",
    sidebarReport: "புகார் அளிக்கவும்",
    sidebarMyApps: "என் புகார்கள்",
    sidebarStatus: "நிலை அறிதல்",
    sidebarNotifications: "அறிவிப்புகள்",
    sidebarHelp: "உதவி & அவசர உதவி",
    sidebarAIChat: "சிவிக் சென்ஸ் AI",
    sidebarOnline: "ஆன்லைன்",
    sidebarCityActionCore: "நகர செயல் மையம்",
    sidebarCityActionCoreDesc: "குடிமக்கள் குரல்கள் நகராட்சி நடவடிக்கையாக மாறும். உங்கள் பகுதியின் தாக்கத்தைக் கண்காணிக்கவும்.",

    myApplicationsTitle: "என் புகார்கள்",
    myApplicationsSubtitle: "உங்கள் கணக்கின் மூலம் பதிவு செய்யப்பட்ட அனைத்து புகார்களையும் நிர்வகிக்கவும்.",
    searchPlaceholder: "விண்ணப்ப எண், பிரச்சனை அல்லது முகவரி மூலம் தேடுங்கள்...",
    allDomains: "அனைத்து துறைகள்",
    allStatuses: "அனைத்து நிலைகள்",
    tableColLocation: "இடம்",
    noMatchedApps: "உங்கள் தேடலுக்கு ஏற்ற புகார்கள் இல்லை.",
    trackStatus: "நிலையைக் கண்காணிக்கவும்",

    statusSubmitted: "சமர்ப்பிக்கப்பட்டது",
    statusVerified: "சரிபார்க்கப்பட்டது",
    statusAssigned: "ஒதுக்கப்பட்டது",
    statusInProgress: "செயல்பாட்டில் உள்ளது",
    statusResolved: "தீர்க்கப்பட்டது",
    statusRejected: "நிராகரிக்கப்பட்டது",

    helpEmergencyTitle: "உதவி & அவசர உதவி",
    emergencyAlert: "அவசர உதவிக்கு 112 / 101 ஐ அழைக்கவும்",
    callNow: "இப்போது அழைக்கவும்",
  },
  mr: {
    brandName: "सिव्हिक सेन्स",
    tagline: "नागरिकांच्या आवाजापासून ते शहराच्या कृतीपर्यंत.",
    navHome: "मुख्यपृष्ठ",
    navReport: "तक्रार नोंदवा",
    navTrack: "स्थिती तपासा",
    navAbout: "माहिती",
    navHelp: "हेल्पलाइन",
    navLogin: "लॉग इन",
    navRegister: "नोंदणी",
    navSignOut: "साइन आउट",
    navCitizenDash: "नागरिक डॅशबोर्ड",
    navAdminOps: "प्रशासकीय कक्ष",
    heroTitle1: "नागरिकांच्या आवाजापासून",
    heroTitle2: "शहराच्या कृतीपर्यंत.",
    heroSubtitle: "नागरी समस्यांची तक्रार करा, प्रगतीचा मागोवा घ्या आणि एकत्र येऊन एक स्वच्छ, सुरक्षित शहर बनवा.",
    heroReportBtn: "तक्रार नोंदवा",
    heroTrackBtn: "तक्रार ट्रॅक करा",
    heroLookupPlaceholder: "अर्ज क्रमांक टाका...",
    heroTrackNow: "आता ट्रॅक करा",
    selectDomainHeader: "तक्रारीसाठी विभाग निवडा",
    selectDomainSubtitle: "आमचे AI तुमच्या आवाजावरून किंवा वर्णनावरून विभाग ओळखते:",
    greetingGoodMorning: "शुभ प्रभात",
    greetingGoodAfternoon: "शुभ दुपार",
    greetingGoodEvening: "शुभ संध्याकाळ",
    greetingGoodNight: "शुभ रात्री",
    dashboardSubheader: "आपण मिळून एक स्वच्छ आणि सुरक्षित शहर निर्माण करू शकतो.",
    statActiveApps: "सक्रिय अर्ज",
    statInProgress: "काम सुरू आहे",
    statResolved: "निकाली काढले",
    quickActionsTitle: "जलद कृती",
    quickReportDesc: "नवीन तक्रार नोंदवा",
    quickAppsDesc: "आपल्या तक्रारी पहा",
    quickStatusDesc: "स्थिती तपासा",
    quickNotifDesc: "नवीन सूचना पहा",
    recentAppsTitle: "अलीकडील अर्ज",
    viewAll: "सर्व पहा",
    tableColAppNo: "अर्ज क्र.",
    tableColIssue: "समस्या",
    tableColStatus: "स्थिती",
    tableColDate: "तारीख",
    tableColAction: "कृती",
    noAppsYet: "अद्याप कोणताही अर्ज दाखल केलेला नाही. सुरुवात करण्यासाठी 'तक्रार नोंदवा' वर क्लिक करा!",
    stepIssueDetails: "समस्या तपशील",
    stepLocation: "ठिकाण",
    stepAddPhoto: "फोटो / व्हिडिओ जोडा",
    stepReview: "पुनरावलोकन",
    selectDomainLabel: "विभाग निवडा *",
    selectIssueLabel: "समस्येचा प्रकार *",
    problemDescLabel: "समस्येचे वर्णन *",
    problemDescPlaceholder: "समस्या काय आहे ते सांगा...",
    voiceTypingSpeak: "बोला (व्हॉइस टायपिंग)",
    optCurrentLocation: "पर्याय १ — सध्याचे स्थान वापरा",
    optDetectLocation: "स्थान शोधा",
    optManualAddress: "पर्याय २ — पत्ता हाताने टाका",
    optManualPlaceholder: "उदा: कॉलेज गेट जवळ, बेंगळुरू",
    uploadPhotoLabel: "फोटो / व्हिडिओ अपलोड करा",
    choosePhotoBtn: "फोटो निवडा",
    photoOptionalTip: "फोटो आणि व्हिडिओ ऐच्छिक पुरावा आहे. फाईल नसल्यासही तुम्ही थेट पुनरावलोकनावर पुढे जाऊ शकता.",
    reviewTitle: "दाखल करण्यापूर्वी पुनरावलोकन करा",
    submitComplaintBtn: "तक्रार दाखल करा",
    submittedSuccess: "तक्रार यशस्वीरित्या दाखल झाली",
    appNumberLabel: "अर्ज क्रमांक",
    trackStatusBtn: "स्थिती ट्रॅक करा →",
    notificationsTitle: "सूचना",
    notificationsSubtitle: "आपल्या नागरी तक्रारी आणि महापालिका कारवाईवरील रिअल-टाइम अपडेट्स.",
    markAllRead: "सर्व वाचल्याचे चिन्हांकित करा",
    filterAll: "सर्व",
    filterUnread: "न वाचलेले",
    noNotificationsFound: "कोणत्याही सूचना आढळल्या नाहीत.",
    loadingNotifications: "सूचना लोड होत आहेत...",
    notifTrackBtn: "ट्रॅक",

    sidebarDashboard: "डॅशबोर्ड",
    sidebarReport: "तक्रार नोंदवा",
    sidebarMyApps: "माझे अर्ज",
    sidebarStatus: "स्थिती तपासा",
    sidebarNotifications: "सूचना",
    sidebarHelp: "मदत आणि आपत्कालीन",
    sidebarAIChat: "सिव्हिक सेन्स AI",
    sidebarOnline: "ऑनलाइन",
    sidebarCityActionCore: "सिटी ॲक्शन कोअर",
    sidebarCityActionCoreDesc: "नागरिकांचे आवाज महापालिकेच्या कृतीत एकत्रित होतात. आपल्या परिसराचा प्रभाव ट्रॅक करा.",

    myApplicationsTitle: "माझे अर्ज",
    myApplicationsSubtitle: "आपल्या खात्याद्वारे दाखल केलेल्या सर्व तक्रारी व्यवस्थापित करा आणि ट्रॅक करा.",
    searchPlaceholder: "अर्ज क्रमांक, समस्या किंवा पत्त्यानुसार शोधा...",
    allDomains: "सर्व विभाग",
    allStatuses: "सर्व स्थिती",
    tableColLocation: "ठिकाण",
    noMatchedApps: "कोणतेही अर्ज आढळले नाहीत.",
    trackStatus: "स्थिती ट्रॅक करा",

    statusSubmitted: "दाखल केले",
    statusVerified: "पडताळणी झाली",
    statusAssigned: "नियुक्त केले",
    statusInProgress: "काम सुरू आहे",
    statusResolved: "निकाली काढले",
    statusRejected: "नाकारले",

    helpEmergencyTitle: "मदत आणि आपत्कालीन सेवा",
    emergencyAlert: "तातडीच्या मदतीसाठी 112 / 101 वर संपर्क साधा",
    callNow: "आता कॉल करा",
  },
};

/**
 * Localizes in-app notification title & message dynamically into the user's selected language
 */
export function localizeNotification(
  notif: { title: string; message: string; type?: string; application_id?: string },
  lang: LanguageCode
): { title: string; message: string } {
  if (lang === "en" || !notif) {
    return { title: notif.title, message: notif.message };
  }

  const { title, message } = notif;
  const appIdMatch = message.match(/CS-\d{4}-\d+/i);
  const appId = appIdMatch ? appIdMatch[0] : notif.application_id || "";

  // Title translations
  let localizedTitle = title;
  const tLower = title.toLowerCase();
  if (tLower.includes("received") || tLower.includes("submitted")) {
    localizedTitle = {
      kn: "ದೂರು ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
      hi: "शिकायत प्राप्त हुई",
      te: "ఫిర్యాదు స్వీకరించబడింది",
      ta: "புகார் பெறப்பட்டது",
      mr: "तक्रार प्राप्त झाली",
    }[lang] || title;
  } else if (tLower.includes("verified")) {
    localizedTitle = {
      kn: "ದೂರು ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      hi: "शिकायत सत्यापित",
      te: "ఫిర్యాదు ధృవీకరించబడింది",
      ta: "புகார் சரிபார்க்கப்பட்டது",
      mr: "तक्रार पडताळली",
    }[lang] || title;
  } else if (tLower.includes("assigned")) {
    localizedTitle = {
      kn: "ವಿಭಾಗ ನಿಯೋಜಿಸಲಾಗಿದೆ",
      hi: "विभाग आवंटित",
      te: "శాఖ కేటాయించబడింది",
      ta: "துறை ஒதுக்கப்பட்டது",
      mr: "विभाग नियुक्त केला",
    }[lang] || title;
  } else if (tLower.includes("progress")) {
    localizedTitle = {
      kn: "ಸ್ಥಿತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
      hi: "स्थिति प्रगति पर है",
      te: "స్థితి పురోగతిలో ఉంది",
      ta: "நிலை: செயல்பாட்டில் உள்ளது",
      mr: "स्थिती: काम सुरू आहे",
    }[lang] || title;
  } else if (tLower.includes("resolved")) {
    localizedTitle = {
      kn: "ನಿಮ್ಮ ದೂರು ಪರಿಹರಿಸಲಾಗಿದೆ",
      hi: "शिकायत का समाधान हुआ",
      te: "మీ ఫిర్యాదు పరిష్కరించబడింది",
      ta: "புகார் தீர்க்கப்பட்டது",
      mr: "तक्रार निकाली काढली",
    }[lang] || title;
  } else if (tLower.includes("closed") || tLower.includes("rejected")) {
    localizedTitle = {
      kn: "ದೂರು ಮುಕ್ತಾಯಗೊಂಡಿದೆ",
      hi: "शिकायत बंद की गई",
      te: "ఫిర్యాదు ముగిసింది",
      ta: "புகார் முடிவடைந்தது",
      mr: "तक्रार बंद केली",
    }[lang] || title;
  } else if (tLower.includes("incident")) {
    localizedTitle = {
      kn: "ನಗರ ಘಟನೆ ನವೀಕರಣ",
      hi: "शहर घटना अपडेट",
      te: "నగర సంఘటన నవీకరణ",
      ta: "மாநகர நிகழ்வு தகவல்",
      mr: "शहर घटना अपडेट",
    }[lang] || title;
  }

  // Message translations
  let localizedMessage = message;

  // Case 1: Application submitted / received
  if (
    message.includes("submitted successfully") ||
    message.includes("logged your complaint") ||
    message.includes("awaiting review")
  ) {
    localizedMessage = {
      kn: `ಅರ್ಜಿ ${appId} ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ ಮತ್ತು ಮುನ್ಸಿಪಲ್ ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ.`,
      hi: `आवेदन ${appId} सफलतापूर्वक जमा हो गया है और समीक्षा की प्रतीक्षा कर रहा है।`,
      te: `దరఖాస్తు ${appId} విజయవంతంగా సమర్పించబడింది మరియు సమీక్ష కోసం వేచి ఉంది.`,
      ta: `விண்ணப்பம் ${appId} வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு மதிப்பாய்வுக்காக காத்திருக்கிறது.`,
      mr: `अर्ज ${appId} यशस्वीरित्या दाखल झाला असून पुनरावलोकनाची वाट पाहत आहे.`,
    }[lang] || message;
  }
  // Case 2: Status update (is now ...)
  else if (message.includes("is now") || message.includes("status changed to")) {
    let statusText = "ನವೀಕರಿಸಲಾಗಿದೆ";
    const mLower = message.toLowerCase();
    if (mLower.includes("in progress") || mLower.includes("in_progress")) {
      statusText = {
        kn: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
        hi: "प्रगति पर",
        te: "పురోగతిలో ఉంది",
        ta: "செயல்பாட்டில் உள்ளது",
        mr: "काम सुरू आहे",
      }[lang] || "In Progress";
    } else if (mLower.includes("verified")) {
      statusText = {
        kn: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        hi: "सत्यापित",
        te: "ధృవీకరించబడింది",
        ta: "சரிபார்க்கப்பட்டது",
        mr: "पडताळणी झाली",
      }[lang] || "Verified";
    } else if (mLower.includes("assigned")) {
      statusText = {
        kn: "ನಿಯೋಜಿಸಲಾಗಿದೆ",
        hi: "आवंटित",
        te: "కేటాయించబడింది",
        ta: "ஒதுக்கப்பட்டது",
        mr: "नियुक्त केले",
      }[lang] || "Assigned";
    } else if (mLower.includes("resolved")) {
      statusText = {
        kn: "ಪರಿಹರಿಸಲಾಗಿದೆ",
        hi: "हल किया गया",
        te: "పరిష్కరించబడింది",
        ta: "தீர்க்கப்பட்டது",
        mr: "निकाली काढले",
      }[lang] || "Resolved";
    } else if (mLower.includes("rejected")) {
      statusText = {
        kn: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
        hi: "खारिज",
        te: "తిరస్కరించబడింది",
        ta: "நிராகரிக்கப்பட்டது",
        mr: "नाकारले",
      }[lang] || "Rejected";
    }

    localizedMessage = {
      kn: `ಅರ್ಜಿ ${appId} ರ ಸ್ಥಿತಿಯನ್ನು '${statusText}' ಎಂದು ನವೀಕರಿಸಲಾಗಿದೆ.`,
      hi: `आवेदन ${appId} की स्थिति अब '${statusText}' है।`,
      te: `దరఖాస్తు ${appId} స్థితి ఇప్పుడు '${statusText}' గా మార్చబడింది.`,
      ta: `விண்ணப்பம் ${appId} இன் நிலை இப்போது '${statusText}' என மாற்றப்பட்டுள்ளது.`,
      mr: `अर्ज ${appId} ची स्थिती आता '${statusText}' अशी आहे.`,
    }[lang] || message;
  }
  // Case 3: Department assigned
  else if (message.includes("has been assigned to")) {
    const deptMatch = message.match(/assigned to (.*?)\.?$/i);
    const dept = deptMatch ? deptMatch[1] : "";
    localizedMessage = {
      kn: `ನಿಮ್ಮ ದೂರು ${appId} ಅನ್ನು ${dept} ವಿಭಾಗಕ್ಕೆ ನಿಯೋಜಿಸಲಾಗಿದೆ.`,
      hi: `आपकी शिकायत ${appId} को ${dept} को सौंप दिया गया है।`,
      te: `మీ ఫిర్యాదు ${appId} ${dept} కు కేటాయించబడింది.`,
      ta: `உங்கள் புகார் ${appId} ${dept} துறைக்கு ஒதுக்கப்பட்டுள்ளது.`,
      mr: `आपली तक्रार ${appId} ${dept} कडे सोपवण्यात आली आहे.`,
    }[lang] || message;
  }
  // Case 4: Incident consolidation
  else if (message.includes("linked to city incident") || message.includes("Multiple reports")) {
    const incMatch = message.match(/(INC-[\w-]+)/i);
    const incId = incMatch ? incMatch[1] : "";
    localizedMessage = {
      kn: `ಒಂದೇ ಸಮಸ್ಯೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಅನೇಕ ವರದಿಗಳು ಬಂದಿವೆ. ತ್ವರಿತ ಪರಿಹಾರಕ್ಕಾಗಿ ನಿಮ್ಮ ದೂರನ್ನು ನಗರ ಘಟನೆ ${incId} ಕ್ಕೆ ಜೋಡಿಸಲಾಗಿದೆ.`,
      hi: `एक ही समस्या के लिए कई रिपोर्ट मिलीं। त्वरित कार्रवाई के लिए आपकी शिकायत को शहर घटना ${incId} से जोड़ा गया है।`,
      te: `ఒకే సమస్య కోసం బహుళ నివేదికలు వచ్చాయి. మీ ఫిర్యాదు నగర సంఘటన ${incId} కు అనుసంధానించబడింది.`,
      ta: `ஒரே பிரச்சனைக்கு பல புகார்கள் வந்துள்ளன. உங்கள் புகார் மாநகராட்சி நிகழ்வு ${incId} உடன் இணைக்கப்பட்டுள்ளது.`,
      mr: `याच समस्येसाठी अनेक तक्रारी आल्या आहेत. उच्च प्राधान्य कारवाईसाठी आपली तक्रार शहर घटना ${incId} शी जोडली गेली आहे.`,
    }[lang] || message;
  }

  return { title: localizedTitle, message: localizedMessage };
}
