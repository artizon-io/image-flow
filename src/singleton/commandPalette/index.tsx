import { useEffect, useRef } from "react";
import _Notification from "../Notification";
import { useNotification } from "../Notification/Store";
import type { NinjaKeys as _NinjaKeys } from "ninja-keys";
import "./ninja-keys.css";
import { NinjaKeys, useCommandPaletteStore } from "./Store";

const CommandPalette = () => {
  const showNotification = useNotification();

  // Reference to the "ninja-keys" element
  const ninjaKeys = useRef<NinjaKeys>(null);
  const {
    actions: actions,
    shouldOpen,
    resetShouldOpen,
  } = useCommandPaletteStore((state) => state);

  useEffect(() => {
    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fail to load");
      console.error("Ninja Keys fail to load");
      return;
    }
    ninjaKeys.current.data = actions;
    ninjaKeys.current.hideBreadcrumbs = true;
  }, []);

  useEffect(() => {
    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fails");
      return;
    }

    if (shouldOpen) {
      ninjaKeys.current.open();
      resetShouldOpen();
    }
  }, [shouldOpen]);

  useEffect(() => {
    console.debug("Command palette actions updated", actions);

    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fails");
      return;
    }

    ninjaKeys.current.data = actions;
  }, [actions]);

  // @ts-ignore
  return <ninja-keys ref={ninjaKeys} />;
};

export default CommandPalette;
