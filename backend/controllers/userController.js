const User = require('../models/User');

// Mock users for fallback when DB unavailable
const MOCK_USERS = [
  {
    _id: 'mock-user-1',
    email: 'user1@example.com',
    fullName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: 'Hà Nội, Việt Nam',
    status: 'active',
    createdAt: new Date('2026-04-01'),
    _note: 'Mock user - database unavailable'
  },
  {
    _id: 'mock-user-2',
    email: 'user2@example.com',
    fullName: 'Trần Thị B',
    phone: '0987654321',
    address: 'TP Hồ Chí Minh, Việt Nam',
    status: 'active',
    createdAt: new Date('2026-04-02'),
    _note: 'Mock user - database unavailable'
  }
];

let usersCacheTime = 0;
let usersCache = null;
const CACHE_DURATION = 10000; // 10s cache

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Return cache if valid
    if (usersCache && Date.now() - usersCacheTime < CACHE_DURATION) {
      return res.json(usersCache);
    }

    // Set timeout for DB query
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const users = await Promise.race([
      User.find().select('-password'),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);

    // Cache the result
    usersCache = users || [];
    usersCacheTime = Date.now();

    res.json(users || []);
  } catch (error) {
    // Return mock users on timeout or DB error - instant fallback
    usersCache = MOCK_USERS;
    usersCacheTime = Date.now();
    res.json(MOCK_USERS);
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const user = await Promise.race([
      User.findById(req.params.id).select('-password'),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    // Return mock user on error
    const mockUser = MOCK_USERS[0];
    res.json(mockUser);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, address, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user status
exports.changeUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
