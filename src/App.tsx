import { useState, useMemo, useRef, useEffect } from "react";
import { configDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";
import SettingsDialog from "./components/Settings";
import "ninja-keys";
import _Notification, { useNotification } from "./components/Notification";
import * as RadixToast from "@radix-ui/react-toast";
import CommandPalette, { useCommandPalette } from "./components/CommandPalette";
import { Component1Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import RootContextMenu from "./components/RootContextMenu";
import LayoutManager from "./components/LayoutManager";

// TODO: add transitions

const Nav = () => {
  const showCommandPalette = useCommandPalette();

  return (
    <div className="absolute top-3 right-5 flex flex-row gap-3">
      <button
        className="naviconbutton"
        onClick={(e) =>
          open("https://github.com/artizon-io/stable-diffusion-metadata-ui")
        }
      >
        <GitHubLogoIcon />
      </button>
      <button className="naviconbutton" onClick={showCommandPalette}>
        <Component1Icon />
      </button>
      <SettingsDialog />
    </div>
  );
};

function App() {
  const Notification = useMemo(() => _Notification, []);

  const showNotification = useNotification();

  return (
    <RadixToast.Provider swipeDirection="right">
      {/* TODO: make a notification stack */}
      <RadixToast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] list-none z-10 outline-none" />
      <Notification />
      <CommandPalette />
      <RootContextMenu>
        <LayoutManager />
      </RootContextMenu>
      <Nav />
    </RadixToast.Provider>
  );
}

export default App;
