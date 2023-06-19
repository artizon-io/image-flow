import * as Toast from "@radix-ui/react-toast";
import { FC } from "react";
import CloseButton from "../../components/CloseButton";
import { twJoin } from "tailwind-merge";
import { useNotificationStore } from "./Store";

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
