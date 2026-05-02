const User = require('../models/User');
const userStore = require('../utils/userStore');

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

    // Combine DB users with created users in memory
    const createdUsersList = userStore.getAllUsers();
    const allUsers = [...(users || []), ...createdUsersList];

    // Cache the result
    usersCache = allUsers;
    usersCacheTime = Date.now();

    res.json(allUsers);
  } catch (error) {
    // On DB error, return created users + mock users
    const createdUsersList = userStore.getAllUsers();
    const allUsers = [...createdUsersList, ...MOCK_USERS];
    
    usersCache = allUsers;
    usersCacheTime = Date.now();
    res.json(allUsers);
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

    if (user) {
      return res.json(user);
    }
    
    // Try to find in created users store
    const createdUser = userStore.getUser(req.params.id);
    if (createdUser) {
      return res.json(createdUser);
    }

    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    // On error, try userStore
    const createdUser = userStore.getUser(req.params.id);
    if (createdUser) {
      return res.json(createdUser);
    }
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, phone, address, updatedAt: Date.now() },
        { new: true }
      ).select('-password');
      return res.json(user);
    } catch (dbErr) {
      // Try userStore fallback
      const createdUser = userStore.getUser(req.params.id);
      if (createdUser) {
        userStore.updateUser(req.params.id, { fullName, phone, address, updatedAt: Date.now() });
        return res.json(userStore.getUser(req.params.id));
      }
      throw dbErr;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.json({ message: 'User deleted successfully' });
    } catch (dbErr) {
      // Try userStore fallback
      const createdUser = userStore.getUser(req.params.id);
      if (createdUser) {
        userStore.deleteUser(req.params.id);
        return res.json({ message: 'User deleted successfully' });
      }
      throw dbErr;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user status
exports.changeUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status, updatedAt: Date.now() },
        { new: true }
      ).select('-password');
      return res.json(user);
    } catch (dbErr) {
      // Try userStore fallback
      const createdUser = userStore.getUser(req.params.id);
      if (createdUser) {
        userStore.updateUser(req.params.id, { status, updatedAt: Date.now() });
        return res.json(userStore.getUser(req.params.id));
      }
      throw dbErr;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
