import api from '../api';

/**
 * ProfileService handles all profile-related API calls
 * 
 * Backend endpoints:
 * - GET /profile - Get current user's profile
 * - PUT /profile - Update current user's profile
 * - POST /profile/image - Upload profile image
 */
export class ProfileService {
  /**
   * Get current user's profile
   * Includes user data, role, privilege, profile info, and image
   * @returns {Promise<Object>} User profile data
   */
  static async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  }

  /**
   * Update current user's profile
   * @param {Object} data - Profile data to update
   * @param {string} data.prof_firstname - First name
   * @param {string} data.prof_lastname - Last name
   * @param {string} data.prof_address - Address
   * @param {string} data.prof_date_of_birth - Date of birth
   * @returns {Promise<Object>} Updated profile data
   */
  static async updateProfile(data) {
    const response = await api.put('/profile', data);
    return response.data;
  }

  /**
   * Upload profile image
   * @param {FormData} formData - Form data containing image file
   * @returns {Promise<Object>} Upload result with image URL
   */
  static async uploadImage(formData) {
    const response = await api.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}
