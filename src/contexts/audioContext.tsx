import React, { createContext, useContext, useRef, ReactNode } from 'react';
import Sound from 'react-native-sound';

interface AudioContextType {
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  resumeBackgroundMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
  backgroundSoundRef: React.MutableRefObject<Sound | null>;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const AudioProvider = ({ 
  children, 
  backgroundSoundRef, 
  startBackgroundMusic, 
  stopBackgroundMusic 
}: AudioProviderProps) => {
  const pauseBackgroundMusic = () => {
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.pause();
      console.log('Background music paused');
    }
  };

  const resumeBackgroundMusic = () => {
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.play((success) => {
        if (success) {
          console.log('Background music resumed');
        } else {
          console.log('Failed to resume background music');
        }
      });
    }
  };

  return (
    <AudioContext.Provider
      value={{
        startBackgroundMusic,
        stopBackgroundMusic,
        pauseBackgroundMusic,
        resumeBackgroundMusic,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

