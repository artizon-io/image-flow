import * as ScrollArea from "@radix-ui/react-scroll-area";
import { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const AppScrollArea: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <ScrollArea.Root className={twMerge("overflow-hidden", className)}>
    <ScrollArea.Viewport className="w-full h-full flex justify-stretch items-stretch child:h-full">
      {children}
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="bg-neutral-900" />
  </ScrollArea.Root>
);

export default AppScrollArea;
