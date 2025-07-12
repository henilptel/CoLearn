import { useState, useEffect } from 'react';
import { userAPI } from '../apis/user';
import type { User, UserProfile } from '../types';

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const response = await userAPI.updateProfile(data);
      if (response.success && response.data) {
        // Update the profile state with the new data
        setProfile(prevProfile => 
          prevProfile ? { ...prevProfile, ...response.data } : null
        );
      } else {
        setError(response.message || 'Failed to update profile');
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
};

export default useProfile;
