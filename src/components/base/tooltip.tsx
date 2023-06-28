import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  tooltip: string;
}

export default function Tooltip({ children, tooltip }: TooltipProps) {
  return (
    <div className="group relative m-12 flex justify-center">
      {children}
      <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {tooltip}
      </span>
    </div>
  );
}
