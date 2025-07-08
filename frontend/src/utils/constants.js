export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',

  // Users
  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`,

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,

  // Dashboard
  DASHBOARD: '/api/dashboard',

  // Reports
  REPORTS: '/api/reports',
  REPORT_BY_ID: (id) => `/api/reports/${id}`,

  // Backups
  BACKUPS: '/api/backups',
  CREATE_BACKUP: '/api/backups/create',
  RESTORE_BACKUP: (id) => `/api/backups/${id}/restore`,

  // Barcode
  BARCODE_SCAN: '/api/barcode/scan',

  // Uploads
  UPLOADS: '/api/uploads',
};

export const PRODUCT_STATUS = {
  FRESH: 'Fresh',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
};

export const REPORT_TYPES = {
  EXPIRY: 'expiry',
  INVENTORY: 'inventory',
  USAGE: 'usage',
  CATEGORY: 'category',
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy HH:mm:ss',
};

export const EXPIRY_THRESHOLDS = {
  EXPIRING_SOON: 7, // days
  EXPIRED: 0, // days
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#8B5CF6',
  SECONDARY: '#6B7280',
};

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful!',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PRODUCT_CREATED: 'Product created successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  REPORT_CREATED: 'Report generated successfully!',
  REPORT_DELETED: 'Report deleted successfully!',
  BACKUP_CREATED: 'Backup created successfully!',
  BACKUP_RESTORED: 'Backup restored successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BARCODE_SCANNED: 'Barcode scanned successfully!',
  BARCODE_NOT_FOUND: 'Product not found for this barcode.',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};