import * as Tooltip from "@radix-ui/react-tooltip";
import { PlusIcon } from "@radix-ui/react-icons";
import { FC, PropsWithChildren } from "react";

const HelpTooltip: FC<
  PropsWithChildren<{
    description: string;
  }>
> = ({ children, description }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-neutral-800 text-neutral-400 text-s px-2 py-0.5 rounded-md"
          sideOffset={5}
        >
          {description}
          <Tooltip.Arrow className="fill-neutral-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default HelpTooltip;

export const HelpTooltipProvider: FC<PropsWithChildren> = ({ children }) => (
  <Tooltip.TooltipProvider delayDuration={300}>
    {children}
  </Tooltip.TooltipProvider>
);
