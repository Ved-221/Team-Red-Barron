import { OrbitalLoader } from "@/components/ui/orbital-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none select-none">
      <OrbitalLoader showTitle={true} />
    </div>
  );
}
