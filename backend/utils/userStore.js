// In-memory store for users created during session
// This persists on each Vercel serverless instance
const CREATED_USERS = {};

module.exports = {
  CREATED_USERS,
  addUser: (userId, userData) => {
    CREATED_USERS[userId] = userData;
  },
  getAllUsers: () => {
    return Object.values(CREATED_USERS);
  },
  getUser: (userId) => {
    return CREATED_USERS[userId];
  },
  updateUser: (userId, updates) => {
    if (CREATED_USERS[userId]) {
      CREATED_USERS[userId] = { ...CREATED_USERS[userId], ...updates };
    }
  },
  deleteUser: (userId) => {
    delete CREATED_USERS[userId];
  }
};
