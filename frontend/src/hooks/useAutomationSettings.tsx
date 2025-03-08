import { useState, useEffect } from "react";

interface AutomationSettings {
  autoRepayment: boolean;
  autoCollateral: boolean;
  riskThreshold: number;
}

const STORAGE_KEY = "automationSettings";

export const useAutomationSettings = () => {
  const [settings, setSettings] = useState<AutomationSettings>({
    autoRepayment: false,
    autoCollateral: false,
    riskThreshold: 50,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: AutomationSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  return { settings, saveSettings };
};
