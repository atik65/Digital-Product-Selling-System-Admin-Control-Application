import { Maximize2 } from "lucide-react";
import React from "react";

const FullScreenControl = () => {
  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };
  return (
    <div>
      {" "}
      <button
        type="button"
        variant="ghost"
        size="icon"
        className="bg-white/20 text-sm font-semibold text-white rounded-full h-9 w-9 flex items-center justify-center hover:bg-white/30 transition-colors"
        onClick={handleToggleFullscreen}
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FullScreenControl;
