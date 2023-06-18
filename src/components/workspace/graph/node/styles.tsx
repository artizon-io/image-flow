import { twMerge } from "tailwind-merge";
import { tailwind } from "../../../../utils/tailwind";

// String won't be interpreted as tailwind string if the string
// is stored in non-tsx/jsx file
export const labelStyles = tailwind`text-neutral-500 font-medium text-s`;
export const valueStyles = tailwind`font-mono text-neutral-200 text-xs bg-neutral-800 p-1 shadow-none`;
export const inputStyles = twMerge(
  valueStyles,
  tailwind`outline-none read-only:text-neutral-500`
);
// https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values
export const twoColumnGridStyles = tailwind`grid gap-x-2 gap-y-1 grid-cols-[auto_auto]`;
