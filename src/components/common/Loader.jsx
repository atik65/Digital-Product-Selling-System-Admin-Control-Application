import { Loader2 } from "lucide-react";

export default function LoaderSpinner({ message = "Loading..." }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}
