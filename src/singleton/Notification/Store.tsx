import { create } from "zustand";

export const useNotificationStore = create<{
  open: boolean;
  severity: Severity;
  message: string;
  showNotification: (severity: Severity, message: string) => void;
  setOpen: (open: boolean) => void; // Required by Radix Toast
}>((set) => ({
  open: false,
  severity: "Success",
  message: "",
  showNotification: (severity: Severity, message: string) =>
    set((state) => ({
      open: true,
      severity,
      message,
    })),
  setOpen: (open: boolean) => set((state) => ({ ...state, open })),
}));

export const useNotification = () =>
  useNotificationStore((state) => state.showNotification);

export type Severity = "Success" | "Error" | "Warning";
