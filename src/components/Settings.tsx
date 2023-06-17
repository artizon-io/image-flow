import { FC, PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import CloseButton from "./CloseButton";
import { GearIcon } from "@radix-ui/react-icons";
import ColorHueSlider from "./ColorHueSlider";
import { create } from "zustand";
import ImageDirPathConfigurator from "./ImageDirPathConfigurator";

const usePositiveWeightMapColorHueStore = create<{
  colorHue: number;
  setColorHue: (colorHue: number) => void;
}>((set) => ({
  colorHue: 0,
  setColorHue: (colorHue: number) => set((state) => ({ ...state, colorHue })),
}));

export const usePositiveWeightMapColorHue = () =>
  usePositiveWeightMapColorHueStore((state) => state.colorHue);

const useNegativeWeightMapColorHueStore = create<{
  colorHue: number;
  setColorHue: (colorHue: number) => void;
}>((set) => ({
  colorHue: 0,
  setColorHue: (colorHue: number) => set((state) => ({ ...state, colorHue })),
}));

export const useNegativeWeightMapColorHue = () =>
  useNegativeWeightMapColorHueStore((state) => state.colorHue);

const Section: FC<
  PropsWithChildren<{
    sectionTitle: string;
    sectionDescription?: string;
  }>
> = ({ sectionTitle, sectionDescription, children }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-s text-neutral-400">{sectionTitle}</h3>
    {sectionDescription ? (
      <p className="text-xs text-neutral-300">{sectionDescription}</p>
    ) : null}
    {children}
  </div>
);

const FieldGroup: FC<
  PropsWithChildren<{
    label: string;
  }>
> = ({ label, children }) => (
  <div className="flex justify-between">
    <label className="text-xs font-medium text-neutral-200">{label}</label>
    {children}
  </div>
);

const SettingsDialog: FC<{
  className?: string;
}> = ({ ...props }) => {
  const { colorHue: positiveColorHue, setColorHue: setPositiveColorHue } =
    usePositiveWeightMapColorHueStore((state) => state);
  const { colorHue: negativeColorHue, setColorHue: setNegativeColorHue } =
    useNegativeWeightMapColorHueStore((state) => state);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={twMerge("naviconbutton", props.className)}>
          <GearIcon className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-800/[0.8] fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-900 px-8 py-8 flex flex-col gap-6">
          <div className="flex gap-1 flex-col">
            <Dialog.Title className="text-neutral-200 text-xl">
              Settings
            </Dialog.Title>
            <Dialog.Description className="text-neutral-400 text-s leading-normal bottom-0">
              All settings are saved automatically.
            </Dialog.Description>
          </div>
          <Section sectionTitle="Weight Map Color Hue (0°-360°)">
            <FieldGroup label="Positive">
              <ColorHueSlider
                colorHue={positiveColorHue}
                setColorHue={setPositiveColorHue}
              />
            </FieldGroup>
            <FieldGroup label="Negative">
              <ColorHueSlider
                colorHue={negativeColorHue}
                setColorHue={setNegativeColorHue}
              />
            </FieldGroup>
          </Section>
          <Section
            sectionTitle="Images Location"
            sectionDescription="At the moment, we only support loading images from the user Desktop/Documents/Pictures directory (or any of their subdirectories)"
          >
            <ImageDirPathConfigurator />
          </Section>
          {/* <Section sectionTitle="Theme">
          </Section> */}
          {/* <Section sectionTitle="Shortcuts Key Mapping">
          </Section> */}
          <Dialog.Close asChild>
            <CloseButton className="top-4 right-4" size="Big" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsDialog;
