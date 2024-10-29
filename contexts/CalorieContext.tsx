// contexts/CalorieContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CalorieContextProps {
  calorieTarget: number;
  setCalorieTarget: (value: number) => void;
}

const CalorieContext = createContext<CalorieContextProps | undefined>(
  undefined
);

export const CalorieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [calorieTarget, setCalorieTarget] = useState<number>(2450); // Default target kalori

  return (
    <CalorieContext.Provider value={{ calorieTarget, setCalorieTarget }}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalorieContext = (): CalorieContextProps => {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error("useCalorieContext must be used within a CalorieProvider");
  }
  return context;
};
