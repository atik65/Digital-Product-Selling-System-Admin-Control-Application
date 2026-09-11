import Image from "@/components/common/Image";
import Text from "@/components/common/Text";
import { cn } from "@/lib/utils";

const AuthLayout = ({ title, subtitle, children, className }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center px-4 py-8",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,107,71,0.08),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-lg rounded-3xl md:bg-white md:p-8 md:ring-1 ring-emerald-900/5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <Image src="/logo.png" alt="Embassy crest" width={28} height={28} />
          </div>

          <Text component="h1" className="text-2xl font-bold text-neutral-900">
            {title}
          </Text>
          <p className="text-sm text-neutral-600">{subtitle}</p>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
