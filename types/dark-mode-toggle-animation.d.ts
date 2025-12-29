declare module "dark-mode-toggle-animation" {
  import { ComponentType } from "react";

  interface DarkModeToggleProps {
    mode?: "sun" | "moon";
    onClick?: () => void;
    width?: string;
    moonColor?: string;
    sunColor?: string;
    animationDuration?: number;
  }

  const DarkModeToggle: ComponentType<DarkModeToggleProps>;
  export default DarkModeToggle;
}
