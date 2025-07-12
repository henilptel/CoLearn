import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Registration step interfaces
interface BasicRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserInfoData {
  name: string;
  gender: string;
  language: string;
  location: string;
}

interface ProfessionData {
  skillsOffered: string[];
  skillsWanted: string[];
  currentPost?: string;
  experienceYears?: number;
}

interface BioData {
  bio: string;
  location: string;
  skillsInterested?: string[];
  isPublic?: boolean;
  profilePhoto?: string;
}

interface TimeSlotData {
  day: string;
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  enabled: boolean;
  slots: TimeSlotData[];
}

interface AvailabilityData {
  availability: DayAvailability[];
}

// Complete registration data structure
export interface RegistrationData {
  step: number;
  isComplete: boolean;
  basic?: BasicRegistrationData;
  userInfo?: UserInfoData;
  profession?: ProfessionData;
  bio?: BioData;
  availability?: AvailabilityData;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateStep: (step: number, data: any) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetRegistration: () => void;
  isStepCompleted: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
  getStepData: <T>(step: number) => T | undefined;
  completeRegistration: () => Promise<boolean>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};

interface RegistrationProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'registration_flow_data';

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse registration data from localStorage:', error);
      }
    }
    
    return {
      step: 0,
      isComplete: false,
    };
  });

  // Save to localStorage whenever registration data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrationData));
  }, [registrationData]);

  const updateStep = (step: number, data: any) => {
    setRegistrationData(prev => {
      const updated = { ...prev, step };
      
      switch (step) {
        case 0:
          updated.basic = { ...prev.basic, ...data };
          break;
        case 1:
          updated.userInfo = { ...prev.userInfo, ...data };
          break;
        case 2:
          updated.profession = { ...prev.profession, ...data };
          break;
        case 3:
          updated.bio = { ...prev.bio, ...data };
          break;
        case 4:
          updated.availability = { ...prev.availability, ...data };
          break;
      }
      
      return updated;
    });
  };

  const goToNextStep = () => {
    setRegistrationData(prev => ({
      ...prev,
      step: Math.min(prev.step + 1, 4)
    }));
  };

  const goToPreviousStep = () => {
    setRegistrationData(prev => ({
      ...prev,
      step: Math.max(prev.step - 1, 0)
    }));
  };

  const resetRegistration = () => {
    const resetData: RegistrationData = {
      step: 0,
      isComplete: false,
    };
    setRegistrationData(resetData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(registrationData.basic?.email && registrationData.basic?.password && 
                 registrationData.basic?.firstName && registrationData.basic?.lastName);
      case 1:
        return !!(registrationData.userInfo?.name && registrationData.userInfo?.gender !== 'Gender' && 
                 registrationData.userInfo?.location !== 'Location');
      case 2:
        return !!(registrationData.profession?.skillsOffered?.length && 
                 registrationData.profession?.skillsWanted?.length);
      case 3:
        return !!(registrationData.bio?.bio && registrationData.bio?.location);
      case 4:
        return !!(registrationData.availability?.availability?.some(day => 
                 day.enabled && day.slots.length > 0));
      default:
        return false;
    }
  };

  const canProceedToStep = (step: number): boolean => {
    if (step === 0) return true;
    
    // Check if all previous steps are completed
    for (let i = 0; i < step; i++) {
      if (!isStepCompleted(i)) {
        return false;
      }
    }
    return true;
  };

  const getStepData = <T,>(step: number): T | undefined => {
    switch (step) {
      case 0:
        return registrationData.basic as T;
      case 1:
        return registrationData.userInfo as T;
      case 2:
        return registrationData.profession as T;
      case 3:
        return registrationData.bio as T;
      case 4:
        return registrationData.availability as T;
      default:
        return undefined;
    }
  };

  const completeRegistration = async (): Promise<boolean> => {
    try {
      // Mark registration as complete
      setRegistrationData(prev => ({
        ...prev,
        isComplete: true
      }));
      
      // Clear registration data from localStorage after successful completion
      localStorage.removeItem(STORAGE_KEY);
      
      return true;
    } catch (error) {
      console.error('Failed to complete registration:', error);
      return false;
    }
  };

  return (
    <RegistrationContext.Provider value={{
      registrationData,
      updateStep,
      goToNextStep,
      goToPreviousStep,
      resetRegistration,
      isStepCompleted,
      canProceedToStep,
      getStepData,
      completeRegistration
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};

// Helper hooks for specific step data
export const useBasicRegistration = () => {
  const { getStepData, updateStep } = useRegistration();
  return {
    data: getStepData<BasicRegistrationData>(0),
    updateData: (data: Partial<BasicRegistrationData>) => updateStep(0, data)
  };
};

export const useUserInfoRegistration = () => {
  const { getStepData, updateStep } = useRegistration();
  return {
    data: getStepData<UserInfoData>(1),
    updateData: (data: Partial<UserInfoData>) => updateStep(1, data)
  };
};

export const useProfessionRegistration = () => {
  const { getStepData, updateStep } = useRegistration();
  return {
    data: getStepData<ProfessionData>(2),
    updateData: (data: Partial<ProfessionData>) => updateStep(2, data)
  };
};

export const useBioRegistration = () => {
  const { getStepData, updateStep } = useRegistration();
  return {
    data: getStepData<BioData>(3),
    updateData: (data: Partial<BioData>) => updateStep(3, data)
  };
};

export const useAvailabilityRegistration = () => {
  const { getStepData, updateStep } = useRegistration();
  return {
    data: getStepData<AvailabilityData>(4),
    updateData: (data: Partial<AvailabilityData>) => updateStep(4, data)
  };
};
