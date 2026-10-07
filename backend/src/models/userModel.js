/**
 * In-Memory User Model (No Database Connection)
 * Encapsulates data storage and CRUD operations for Users/Alumni entities.
 */

// In-memory data store for users
const users = [];

const UserModel = {
  /**
   * Retrieve all users, optionally sorted by a specific field and order.
   * @param {Object} options - Query options
   * @param {string} [options.sortBy='id'] - Field to sort by
   * @param {string} [options.order='asc'] - Sort order ('asc' or 'desc')
   * @returns {Array} List of sorted users
   */
  getAll({ sortBy = 'id', order = 'asc' } = {}) {
    return [...users].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (typeof valA === 'string') {
        return order === 'desc' 
          ? valB.localeCompare(valA) 
          : valA.localeCompare(valB);
      }

      return order === 'desc' ? valB - valA : valA - valB;
    });
  },

  /**
   * Find a user by their unique ID.
   * @param {number} id - User ID
   * @returns {Object|null} Found user or null
   */
  getById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  },

  /**
   * Create and store a new user entity.
   * @param {Object} payload - User attribute data
   * @returns {Object} Newly created user
   */
  create(payload) {
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...payload,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  /**
   * Fully update (PUT) an existing user entity by ID.
   * Preserves original ID and createdAt date.
   * @param {number} id - User ID to update
   * @param {Object} payload - Complete updated attributes
   * @returns {Object|null} Updated user or null if not found
   */
  update(id, payload) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    const existingUser = users[userIndex];
    const updatedUser = {
      id,
      ...payload,
      createdAt: existingUser.createdAt,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  },

  /**
   * Partially update (PATCH) specific fields of an existing user entity by ID.
   * Preserves ID and merges provided fields with existing data.
   * @param {number} id - User ID to patch
   * @param {Object} payload - Fields to update
   * @returns {Object|null} Updated user or null if not found
   */
  patch(id, payload) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...users[userIndex],
      ...payload,
      id, // ID cannot be overwritten
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  },

  /**
   * Delete a user entity by ID.
   * @param {number} id - User ID to delete
   * @returns {Object|null} Deleted user entity or null if not found
   */
  delete(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    const [deletedUser] = users.splice(userIndex, 1);
    return deletedUser;
  },

  /**
   * Helper function to get total count of users.
   * @returns {number} User count
   */
  count() {
    return users.length;
  }
};

module.exports = UserModel;
