import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "../Notification/Store";

export const useSettingsStore = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  // Weight Map
  positiveColorHue: number;
  setPositiveColorHue: (colorHue: number) => boolean;
  negativeColorHue: number;
  setNegativeColorHue: (colorHue: number) => boolean;
  // Graph
  panSensitivity: number;
  setPanSensitivity: (sensitivity: number) => boolean;
  zoomSensitivity: number;
  setZoomSensitivity: (sensitivity: number) => boolean;
}>()(
  // TODO: refactor the validation logic (use zod?)
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (isOpen) => set((state) => ({ ...state, isOpen: isOpen })),
      // Weight Map
      positiveColorHue: 0,
      setPositiveColorHue: (colorHue: number) => {
        if (!(colorHue >= 0 && colorHue <= 360)) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Unable to set weight map color hue to ${colorHue}`
            );
          return false;
        }

        set((state) => ({ ...state, positiveColorHue: colorHue }));
        return true;
      },
      negativeColorHue: 0,
      setNegativeColorHue: (colorHue: number) => {
        if (!(colorHue >= 0 && colorHue <= 360)) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Unable to set weight map color hue to ${colorHue}`
            );
          return false;
        }

        set((state) => ({ ...state, negativeColorHue: colorHue }));
        return true;
      },
      panSensitivity: 0.5,
      setPanSensitivity: (sensitivity) => {
        if (!(sensitivity >= 0 && sensitivity <= 1)) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Unable to set pan sensitivity to ${sensitivity}`
            );
          return false;
        }

        set((state) => ({ ...state, panSensitivity: sensitivity }));
        return true;
      },
      zoomSensitivity: 0.5,
      setZoomSensitivity: (sensitivity) => {
        if (!(sensitivity >= 0 && sensitivity <= 1)) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Unable to set pan sensitivity to ${sensitivity}`
            );
          return false;
        }

        set((state) => ({ ...state, zoomSensitivity: sensitivity }));
        return true;
      },
    }),
    // TODO: customise `storage` to use config
    // TODO: find a method (TS compliant) that picks the keys I want from an object
    {
      name: "settings-storage",
      partialize: (state) => ({
        positiveColorHue: state.positiveColorHue,
        negativeColorHue: state.negativeColorHue,
        panSensitivity: state.panSensitivity,
        zoomSensitivity: state.zoomSensitivity,
      }),
    }
  )
);
