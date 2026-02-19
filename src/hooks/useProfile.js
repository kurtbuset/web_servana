import { useState, useEffect, useCallback } from 'react';
import toast from '../utils/toast';
import { ProfileService } from '../services/profile.service';

/**
 * useProfile hook manages user profile state and actions
 * 
 * Features:
 * - Fetch user profile on mount
 * - Update profile information
 * - Upload profile image
 * - Loading and error state management
 * - Toast notifications for user feedback
 * - Automatic refetch after updates
 * 
 * @returns {Object} Profile state and actions
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user profile
   * @returns {Promise<Object>} Profile data
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProfileService.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Fetch profile error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ProfileService.updateProfile(data);
      setProfile(result);
      toast.success('Profile updated successfully');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload profile image
   * @param {FormData} formData - Form data containing image file
   * @returns {Promise<Object>} Upload result
   */
  const uploadImage = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ProfileService.uploadImage(formData);
      toast.success('Image uploaded successfully');
      // Refresh profile to get updated image
      await fetchProfile();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadImage,
    refetch: fetchProfile
  };
};
