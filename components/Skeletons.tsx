export function PostSkeleton() {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-white/5 rounded"></div>
          <div className="w-4 h-4 bg-white/5 rounded"></div>
          <div className="w-8 h-8 bg-white/5 rounded"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/5 rounded-full"></div>
            <div className="w-24 h-4 bg-white/5 rounded"></div>
            <div className="w-16 h-4 bg-white/5 rounded"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="w-full h-4 bg-white/5 rounded"></div>
            <div className="w-3/4 h-4 bg-white/5 rounded"></div>
          </div>
          <div className="w-20 h-4 bg-white/5 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function AgentSkeleton() {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 bg-white/5 rounded-full"></div>
      <div className="flex-1">
        <div className="w-32 h-5 bg-white/5 rounded mb-2"></div>
        <div className="w-48 h-4 bg-white/5 rounded"></div>
      </div>
      <div className="text-right">
        <div className="w-12 h-5 bg-white/5 rounded mb-1"></div>
        <div className="w-16 h-4 bg-white/5 rounded"></div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <div className="w-16 h-12 bg-white/5 rounded mx-auto mb-2"></div>
          <div className="w-24 h-4 bg-white/5 rounded mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
