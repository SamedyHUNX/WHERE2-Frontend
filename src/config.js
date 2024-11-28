const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const ENV = process.env.REACT_APP_NODE_ENV || "development";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "clientId";

const config = {
  apiUrl: API_URL,
  env: ENV,
  socketServer: "ws://localhost:4000",
  isDevelopment: ENV === "development",
  isProduction: ENV === "production",
  auth: {
    loginUrl: `${API_URL}/api/users/login`,
    registerUrl: `${API_URL}/api/users/signup`,
    verifyAccountUrl: `${API_URL}/api/users/signup/verifyAccount`,
    sendVerificationCode: `${API_URL}/api/users/signup/sendVerificationCode`,
    resendVerificationCodeUrl: `${API_URL}/api/users/signup/resendVerificationCode`,
    sendWelcomeEmailUrl: `${API_URL}/api/users/signup/sendWelcomeEmail`,
    logoutUrl: `${API_URL}/api/users/logout`,
    forgotPasswordUrl: `${API_URL}/api/users/forgotPassword`,
    resetPasswordUrl: (token) => `${API_URL}/api/users/resetPassword/${token}`,
    refreshTokenUrl: `${API_URL}/api/users/refreshToken`,
    fetchProfileUrl: (username) => `${API_URL}/api/users/profile/${username}`,
    getUserRole: `${API_URL}/api/users/login/getRole`,
    updatePassword: (userId) => `${API_URL}/api/users/updatePassword/${userId}`,
    reactivate: `${API_URL}/api/users/reactivate`,
  },
  user: {
    upload: `${API_URL}/api/upload`,
    visitorTrack: `${API_URL}/api/visitors/track-visit`,
    visits: `${API_URL}/api/visitors/visits`,
  },
  profile: {
    getMyProfile: (userId) => `${API_URL}/api/users/profile/${userId}`,
    updateMyProfile: (userId) => `${API_URL}/api/users/profile/${userId}`,
    getPublicProfile: (userId) =>
      `${API_URL}/api/users/public/${userId}`,

    getAdminContentList: (adminId) => `${API_URL}/api/users/content-list/${adminId}`,
    getAdminContentList: (adminId) => `${API_URL}/api/users/content-list/${adminId}`,
  },
  analytics: {
    getAllUsers: `${API_URL}/api/users/user-list`,
    deleteUserById: (userId) => `${API_URL}/api/users/delete-user/${userId}`,
    reactivateUserById: (userId) =>
      `${API_URL}/api/users/reactivate-user/${userId}`,
  },
  photo: {
    getS3Url: `${API_URL}/api/user/s3Url`,
    uploadProfilePicture: `${API_URL}/api/user/profile-picture`,
    uploadPublicPhoto: `${API_URL}/api/user/public`,
    fetchPublicPhotoForPost: (userId, postId) =>
      `${API_URL}/api/user/${userId}/public/${postId}`,
    fetchProfilePicture: (userId) =>
      `${API_URL}/api/user/${userId}/profile-picture`,
    fetchBatchProfilePictures: `${API_URL}/api/user/users/batch-profile-pictures`,
  },
  community: {
    createDiscussion: `${API_URL}/api/discussion`,
    getDiscussions: `${API_URL}/api/discussions`,
    getUserDiscussions: (userId) => `${API_URL}/api/discussions/${userId}`,
    addComment: (discussionId, commentId) =>
      `${API_URL}/api/discussions/${discussionId}/comment/${commentId}`,
    getAllComments: (discussionId) =>
      `${API_URL}/api/discussions/${discussionId}/comments`,
    deleteDiscussion: (discussionId) =>
      `${API_URL}/api/discussion/${discussionId}`,
    deleteComment: (commentId) =>
      `${API_URL}/api/discussion/comment/${commentId}`,
  },
  job: {
    getAllJob: `${API_URL}/api/jobs/job-list`,
    getAssociatedCompany: (jobId) =>
      `${API_URL}/api/jobs/associatedCompany/${jobId}`,
    approveJob: (jobId) => `${API_URL}/api/jobs/approve/${jobId}`,
    disapproveJob: (jobId) => `${API_URL}/api/jobs/disapprove/${jobId}`,
    getJob: (jobId) => `${API_URL}/api/jobs/${jobId}`,
    deleteJob: (jobId) => `${ API_URL }/api/jobs/deleteJob/${ jobId }`,
    getOneCompany: (comId) => `${API_URL}/api/companies/getOneCompany/${comId}`
  },
  favorite: {
    addFavorite: `${API_URL}/api/favorites/addFavorite`,
    getFavorite: (userId, category) =>
      `${API_URL}/api/favorites/${userId}/${category}`,
    removedFavorite: (cardId, category) =>
      `${API_URL}/api/favorites/${cardId}/${category}`,
  },
  list: {
    getAllList: (model) => `${API_URL}/api/list/${model}`,
  },
  universities: {
    getAllUniversity : `${API_URL}/api/list/university`,
    getUniversityList : `${API_URL}/api/detail/university/university-list`,
    getUniversityById : `${API_URL}/api/detail/university`,
    approveUniversity : (universityId) => `${API_URL}/api/detail/university/approve/${universityId}`,
    disapproveUniversity : (universityId) => `${API_URL}/api/detail/university/disapprove/${universityId}`,
    deleteUniversity : (universityId) => `${API_URL}/api/detail/university/deleteUniversity/${universityId}`,
  },
  scholarships: {
    getAllScholarships: `${API_URL}/api/list/scholarship`,
    getScholarshipById: `${API_URL}/api/detail/scholarship`,
  },
  accommodation: {
    getAllAccommodation: `${API_URL}/api/list/accommodation`,
    getAccommodationById: `${ API_URL }/api/accommodation`,
    getFilterAccommodation: (universityName) => `${ API_URL }/api/accommodation/filterAccommodation/${universityName}`,
    addAccommodation: `${ API_URL }/api/accommodation/addAccommodation`,
    deleteAccommodation: (accId) => `${ API_URL }/api/accommodation/deleteAccommodation/${ accId }`,
    getAllAccommodationList: `${ API_URL }/api/accommodation/accommodation-list/all`,
    approveAccommodation : (accommodationId) => `${API_URL}/api/accommodation/approve/${accommodationId}`,
    disapproveAccommodation : (accommodationId) => `${API_URL}/api/accommodation/disapprove/${accommodationId}`,
  },
  search: {
    searchAny: `${API_URL}/api/`,
  },
  list: {
    getAllList: (model) => `${API_URL}/api/list/${model}`,
  },
  chatbot: {
    sendMessage: `${API_URL}/api/ai/summary`,
  },
  payment: {
    makePayment: `${API_URL}/api/bakong-payment`,
    createPaypalOrder: `${API_URL}/api/create-paypal-order`,
    capturePaypalOrder: `${API_URL}/api/capture-paypal-order`,
    createSubscription: `${API_URL}/api/create-subscription`,
  },
  paypal: {
    clientID: CLIENT_ID,
  },
  dashboard: {
    getVerificationData: `${API_URL}/api/dashboard/get-verification-data`,
    getDiscussionsPerDay: `${API_URL}/api/dashboard/discussions-per-day`,
    getDeviceDistribution: `${API_URL}/api/dashboard/device-distribution`,
    getActiveAndViews: `${API_URL}/api/dashboard/active-and-views`,
    getUserCounts: `${API_URL}/api/dashboard/user-counts-by-city`,
    getCommentsPerDay: `${API_URL}/api/dashboard/comments-by-day`,
  },
  health: {
    getAllHealthArticles: `${API_URL}/api/health/health-articles`,
    getHealthArticleById: (id) => `${API_URL}/api/health/health-articles/${id}`,
  },
  contentCreation: {
    createUniversity: `${API_URL}/api/detail/university/addUniversity`,
    createJob: `${API_URL}/api/jobs/addJob`,
    createAccomodation: `${ API_URL }/api/accommodation/addAccommodation`,
    createCompany: `${API_URL}/api/companies/addCompany`
  },
  filterMajor: {
    getFilterMajor: (id) => `${ API_URL }/api/filtered/major/${id}`,
    getMajor: (name) => `${ API_URL }/api/filtered/majorName/${ name }`,
    getFilterPrice: `${ API_URL }/api/filtered/price`,
  },
  contact: {
    sendEmail: `${API_URL}/api/contact`,
    getAllContact : `${API_URL}/api/admin/contacts`,
    markAsRead : (messageId) =>  `${API_URL}/api/admin/contacts/${messageId}/read`
  },
  follow: {
    follow: (endpoint, targetUserId) =>
      `${API_URL}/api/${endpoint}/${targetUserId}`,
    unfollow: (targetUserId) => `${API_URL}/api/unfollow/${targetUserId}`,
    checkStatus: (targetUserId) =>
      `${API_URL}/api/followers/check/${targetUserId}`,
    getFollowersCount: (userId) => `${API_URL}/api/followers/count/${userId}`,
    // getFollwers: (userId) => `${API_URL}/api/users/${userId}/followers`,
  },
  messages: {
    getMessages: (userId) => `${API_URL}/api/user/message/${userId}`,
    send: `${API_URL}/api/user/message/`,
  },
  notifications: {
    getNotifications: `${API_URL}/api/notifications`,
    markAsRead:
      `${API_URL}/api/notifications/read`,
    readAll: `${API_URL}/api/notifications/read-all`,
    delete: (notificationId) => `${API_URL}/api/notifications/${notificationId}l`
  },
  companies : {
    getCompanyProfile : (companyId) => `${API_URL}/api/companies/getOneCompany/${companyId}`,
    updateCompanyProfile : (companyId) => `${API_URL}/api/companies/updateCompany/${companyId}`,
    
  },
  filterMajor: {
    getFilterMajor: (id) => `${ API_URL }/api/filtered/major/${id}`,
    getMajor: (name) => `${ API_URL }/api/filtered/majorName/${ name }`,
    getFilterPrice: `${ API_URL }/api/filtered/price`,
  }
};
export default config;
