import { FC, Ref, forwardRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

// Radix "Gotchas"
// https://www.radix-ui.com/docs/primitives/guides/composition#composing-with-your-own-react-components

const CloseButton = forwardRef<
  any,
  {
    className?: string;
    size: "Big" | "Small";
  }
>(({ className, size, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        "text-neutral-500 absolute inline-flex items-center justify-center rounded-full shadow-none hover:text-neutral-400 hover:border-neutral-700",
        size === "Big" ? "h-8 w-8" : "h-7 w-7",
        className
      )}
      aria-label="Close"
      {...props}
      ref={ref}
    >
      <Cross2Icon className={size === "Big" ? "w-5 h-5" : "w-4 h-4"} />
    </button>
  );
});

export default CloseButton;
