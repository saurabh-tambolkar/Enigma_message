import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
      <div className="gap-6 flex flex-col md:flex-row mt-4">
        <div className="relative h-[200px] w-[350px] rounded-xl bg-slate-400 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
        <div className="relative h-[200px] w-[350px] rounded-xl bg-slate-400 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
        <div className="relative h-[200px] w-[350px] rounded-xl bg-slate-400 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      </div>
  );
}
