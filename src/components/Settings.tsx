import { FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import CloseButton from "./CloseButton";

const SettingsDialog: FC<{
  className: string;
}> = ({ ...props }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button
        className={twMerge(
          "text-neutral-500 bg-neutral-800 hover:text-neutral-400 self-center absolute top-5 right-5 px-2 py-1 rounded-md hover:border-neutral-500",
          props.className
        )}
      >
        Settings
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-neutral-800/[0.8] fixed inset-0" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-900 px-8 py-8 flex flex-col gap-2">
        <Dialog.Title className="text-neutral-200 text-2xl">
          Settings
        </Dialog.Title>
        <Dialog.Description className="text-neutral-400 leading-normal absolute bottom-0">
          Refer to the documentation for more information.
        </Dialog.Description>
        <Dialog.Close asChild>
          <CloseButton className="top-4 right-4" size="Big" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default SettingsDialog;
