import { FC, PropsWithChildren, forwardRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import CloseButton from "../../components/CloseButton";
import { GearIcon } from "@radix-ui/react-icons";
import CustomSlider from "../../components/Slider";
import ImageDirPathConfigurator from "../ImageDirPathConfigurator";
import { useSettingsStore } from "./Store";
import { useCommandPaletteStore } from "../commandPalette/Store";

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

const SettingsDialog = forwardRef<
  any,
  {
    className?: string;
  }
>(({ ...props }, ref) => {
  const {
    isOpen,
    setOpen,
    positiveColorHue,
    setPositiveColorHue,
    negativeColorHue,
    setNegativeColorHue,
  } = useSettingsStore((state) => state);

  const { addCommandPaletteAction, removeCommandPaletteAction } =
    useCommandPaletteStore((state) => ({
      addCommandPaletteAction: state.addAction,
      removeCommandPaletteAction: state.removeAction,
    }));

  useEffect(() => {
    addCommandPaletteAction({
      id: "settings",
      title: "Open Settings",
      section: "Settings",
      handler: () => setOpen(true),
    });

    return () => removeCommandPaletteAction("settings");
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={twMerge("naviconbutton-with-border", props.className)}
          ref={ref}
        >
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
            <Dialog.Description className="text-neutral-400 text-sm leading-normal bottom-0">
              All settings are saved automatically.
            </Dialog.Description>
          </div>
          <Section sectionTitle="Weight Map Color Hue (0°-360°)">
            <FieldGroup label="Positive">
              <CustomSlider
                value={positiveColorHue}
                setValue={setPositiveColorHue}
                disabled={true}
                min={0}
                max={360}
              />
            </FieldGroup>
            <FieldGroup label="Negative">
              <CustomSlider
                value={negativeColorHue}
                setValue={setNegativeColorHue}
                disabled={true}
                min={0}
                max={360}
              />
            </FieldGroup>
          </Section>
          <Section sectionTitle="Graph Control">
            <FieldGroup label="Pan Sensitivity">
              <CustomSlider
                value={positiveColorHue}
                setValue={setPositiveColorHue}
                min={0}
                max={1}
                step={0.01}
              />
            </FieldGroup>
            <FieldGroup label="Zoom Sensitivity">
              <CustomSlider
                value={negativeColorHue}
                setValue={setNegativeColorHue}
                min={0}
                max={1}
                step={0.01}
                disabled={true}
              />
            </FieldGroup>
          </Section>
          <Section
            sectionTitle="Images Location"
            sectionDescription="At the moment, we only support loading images from the user Desktop/Documents/Pictures directory (or any of their subdirectories)"
          >
            <ImageDirPathConfigurator />
          </Section>
          <Dialog.Close asChild>
            <CloseButton className="top-4 right-4" size="Big" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export default SettingsDialog;
