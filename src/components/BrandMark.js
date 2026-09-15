import { Sprout } from "lucide-react";
import { cn } from "../lib/utils";

function BrandMark({ compact = false, className }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-600 text-white shadow-soft">
        <Sprout className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="text-left">
          <p className="text-lg font-extrabold leading-none tracking-tight text-farm-900">
            Farmer<span className="text-farm-600">Detect</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.16em] text-farm-500">
            AGRITECH
          </p>
        </div>
      )}
    </div>
  );
}

export default BrandMark;
