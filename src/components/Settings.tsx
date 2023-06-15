import { FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import CloseButton from "./CloseButton";
import { GearIcon } from "@radix-ui/react-icons";

const SettingsDialog: FC<{
  className?: string;
}> = ({ ...props }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className={twMerge("naviconbutton", props.className)}>
        <GearIcon className="w-5 h-5" />
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-neutral-800/[0.8] fixed inset-0" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-900 px-8 py-8 flex flex-col gap-2">
        <Dialog.Title className="text-neutral-200 text-2xl">
          Settings
        </Dialog.Title>
        <Dialog.Description className="text-neutral-400 leading-normal bottom-0">
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
