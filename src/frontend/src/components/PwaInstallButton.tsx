import { Download } from "lucide-react";
import { usePwaInstallPrompt } from "../hooks/usePwaInstallPrompt";
import { Button } from "./ui/button";

interface PwaInstallButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function PwaInstallButton({
  variant = "outline",
  size = "sm",
  className = "",
}: PwaInstallButtonProps) {
  const { isInstallable, promptInstall } = usePwaInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={promptInstall}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Install app
    </Button>
  );
}
