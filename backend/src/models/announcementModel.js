/**
 * In-Memory Announcement Model
 * Encapsulates data storage and CRUD operations for Announcement entities.
 */

// In-memory data store for announcements with seed data
const announcements = [
  {
    id: 1,
    title: '🎓 2026 Geleneksel Mezunlar Günü ve Pilav Günü',
    content: 'Tüm mezunlarımızı ve akademik personelimizi kampüsümüzde düzenlenecek 2026 Mezunlar Günü etkinliğimize davet ediyoruz. Detaylı program yakında açıklanacaktır.',
    category: 'Etkinlik',
    author: 'Mezunlar Derneği',
    isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 2,
    title: '💼 Teknoloji Sektöründe Kariyer ve Mentörlük Buluşması',
    content: 'Yazılım ve Yapay Zekâ alanında çalışan kıdemli mezunlarımız, son sınıf öğrencilerimizle deneyimlerini paylaşacak. Katılım ücretsizdir.',
    category: 'Kariyer & İş',
    author: 'Kariyer Merkezi',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const AnnouncementModel = {
  /**
   * Retrieve all announcements, optionally filtered and sorted by a specific field and order.
   * @param {Object} options - Query options
   * @param {string} [options.sortBy='id'] - Field to sort by
   * @param {string} [options.order='asc'] - Sort order ('asc' or 'desc')
   * @param {string} [options.category] - Filter by category
   * @returns {Array} List of sorted announcements
   */
  getAll({ sortBy = 'id', order = 'asc', category } = {}) {
    let result = [...announcements];

    if (category) {
      result = result.filter(a => a.category && a.category.toLowerCase() === category.toLowerCase());
    }

    return result.sort((a, b) => {
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
   * Find an announcement by its unique ID.
   * @param {number|string} id - Announcement ID
   * @returns {Object|null} Found announcement or null
   */
  getById(id) {
    const numId = Number(id);
    const announcement = announcements.find(a => a.id === numId);
    return announcement || null;
  },

  /**
   * Create and store a new announcement entity.
   * @param {Object} payload - Announcement attribute data
   * @returns {Object} Newly created announcement
   */
  create(payload) {
    const newAnnouncement = {
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      title: payload.title || '',
      content: payload.content || '',
      category: payload.category || 'General',
      author: payload.author || 'System Admin',
      isPinned: Boolean(payload.isPinned),
      ...payload,
      createdAt: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    return newAnnouncement;
  },

  /**
   * Fully update (PUT) an existing announcement entity by ID.
   * Preserves original ID and createdAt date.
   * @param {number|string} id - Announcement ID to update
   * @param {Object} payload - Complete updated attributes
   * @returns {Object|null} Updated announcement or null if not found
   */
  update(id, payload) {
    const numId = Number(id);
    const announcementIndex = announcements.findIndex(a => a.id === numId);
    if (announcementIndex === -1) return null;

    const existingAnnouncement = announcements[announcementIndex];
    const updatedAnnouncement = {
      id: numId,
      ...payload,
      createdAt: existingAnnouncement.createdAt,
      updatedAt: new Date().toISOString()
    };

    announcements[announcementIndex] = updatedAnnouncement;
    return updatedAnnouncement;
  },

  /**
   * Partially update (PATCH) specific fields of an existing announcement entity by ID.
   * Preserves ID and merges provided fields with existing data.
   * @param {number|string} id - Announcement ID to patch
   * @param {Object} payload - Fields to update
   * @returns {Object|null} Updated announcement or null if not found
   */
  patch(id, payload) {
    const numId = Number(id);
    const announcementIndex = announcements.findIndex(a => a.id === numId);
    if (announcementIndex === -1) return null;

    const updatedAnnouncement = {
      ...announcements[announcementIndex],
      ...payload,
      id: numId, // ID cannot be overwritten
      updatedAt: new Date().toISOString()
    };

    announcements[announcementIndex] = updatedAnnouncement;
    return updatedAnnouncement;
  },

  /**
   * Delete an announcement entity by ID.
   * @param {number|string} id - Announcement ID to delete
   * @returns {Object|null} Deleted announcement entity or null if not found
   */
  delete(id) {
    const numId = Number(id);
    const announcementIndex = announcements.findIndex(a => a.id === numId);
    if (announcementIndex === -1) return null;

    const [deletedAnnouncement] = announcements.splice(announcementIndex, 1);
    return deletedAnnouncement;
  },

  /**
   * Helper function to get total count of announcements.
   * @returns {number} Announcement count
   */
  count() {
    return announcements.length;
  }
};

module.exports = AnnouncementModel;
