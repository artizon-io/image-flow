import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  // Weight Map
  positiveColorHue: number;
  setPositiveColorHue: (colorHue: number) => void;
  negativeColorHue: number;
  setNegativeColorHue: (colorHue: number) => void;
}>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (isOpen) => set((state) => ({ ...state, isOpen: isOpen })),
      // Weight Map
      positiveColorHue: 0,
      setPositiveColorHue: (colorHue: number) =>
        set((state) => ({ ...state, positiveColorHue: colorHue })),
      negativeColorHue: 0,
      setNegativeColorHue: (colorHue: number) =>
        set((state) => ({ ...state, negativeColorHue: colorHue })),
    }),
    // TODO: customise `storage` to use config
    {
      name: "settings-storage",
      partialize: (state) => ({
        positiveColorHue: state.positiveColorHue,
        negativeColorHue: state.negativeColorHue,
      }),
    }
  )
);
