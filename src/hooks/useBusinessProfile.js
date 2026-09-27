import { useLocalStorage } from './useLocalStorage';

const defaultProfile = { name: '', legalName: '', logo: null };

export function useBusinessProfile() {
  const [profile, setProfile] = useLocalStorage('bar_business_profile', defaultProfile);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return { profile, updateProfile };
}
