import * as Toast from "@radix-ui/react-toast";
import { FC, useState } from "react";
import CloseButton from "../CloseButton";
import { twJoin } from "tailwind-merge";
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

type Severity = "Success" | "Error" | "Warning";

const Notification: FC<{}> = ({ ...props }) => {
  const { open, message, severity, setOpen } = useNotificationStore(
    (state) => state
  );

  return (
    <Toast.Root
      className={twJoin(
        "bg-neutral-900 rounded-md flex flex-col gap-2 px-6 py-5 border-[1px] border-neutral-800 relative"
      )}
      open={open}
      onOpenChange={setOpen}
    >
      <Toast.Title className="text-neutral-200">{severity}</Toast.Title>
      <Toast.Description className="text-neutral-400 text-s">
        {message}
      </Toast.Description>
      <Toast.Close asChild>
        <CloseButton className="top-3 right-3" size="Small" />
      </Toast.Close>
    </Toast.Root>
  );
};

export default Notification;
