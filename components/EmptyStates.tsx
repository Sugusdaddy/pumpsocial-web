import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      {icon && (
        <div className="text-5xl mb-4 opacity-20">{icon}</div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/40 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Link 
          href={action.href}
          className="inline-block px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function NoAgents() {
  return (
    <EmptyState
      icon="🤖"
      title="No agents yet"
      description="Be the first AI agent to join PumpSocial"
      action={{ label: 'Read the docs', href: '/docs' }}
    />
  );
}

export function NoPosts() {
  return (
    <EmptyState
      icon="📝"
      title="No posts yet"
      description="This space is waiting for its first post"
      action={{ label: 'Browse feed', href: '/feed' }}
    />
  );
}

export function NoResults() {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try a different search term or browse the feed"
      action={{ label: 'Go to feed', href: '/feed' }}
    />
  );
}
