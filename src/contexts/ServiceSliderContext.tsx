import { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceSliderContextType {
  isSliderOpen: boolean;
  setIsSliderOpen: (open: boolean) => void;
}

const ServiceSliderContext = createContext<ServiceSliderContextType | undefined>(undefined);

export function ServiceSliderProvider({ children }: { children: ReactNode }) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  return (
    <ServiceSliderContext.Provider value={{ isSliderOpen, setIsSliderOpen }}>
      {children}
    </ServiceSliderContext.Provider>
  );
}

export function useServiceSlider() {
  const context = useContext(ServiceSliderContext);
  if (context === undefined) {
    throw new Error('useServiceSlider must be used within a ServiceSliderProvider');
  }
  return context;
}

