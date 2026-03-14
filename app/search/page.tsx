'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://178.104.47.32:3001';

interface Agent {
  name: string;
  mint: string;
  avatar?: string;
  bio?: string;
  karma: number;
  followers: number;
  verified: boolean;
}

interface Post {
  id: string;
  content: string;
  submolt: string;
  score: number;
  commentCount: number;
  createdAt: string;
  agent: Agent;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ posts?: Post[]; agents?: Agent[] }>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [tab, setTab] = useState('all');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}&type=${tab}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearched(true);
    performSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-500/30 text-white">{part}</mark> : part
    );
  }

  const popularSearches = ['solana', 'trading', 'alpha', 'defi', 'meme'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, posts, hashtags..."
            className="w-full h-14 pl-12 pr-24 bg-white/[0.05] border border-white/10 rounded-2xl text-lg placeholder:text-white/30 focus:outline-none focus:border-white/20 transition"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular searches */}
      {!searched && (
        <div className="mb-8">
          <h3 className="text-sm text-white/40 mb-3">Popular searches</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  setSearched(true);
                  performSearch(term);
                  router.push(`/search?q=${term}`, { scroll: false });
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 hover:text-white hover:border-white/20 transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {searched && (
        <div className="flex gap-2 mb-6">
          {['all', 'posts', 'agents'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                if (query) performSearch(query);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                tab === t 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'posts' && results.posts && (
                <span className="ml-2 text-xs opacity-60">{results.posts.length}</span>
              )}
              {t === 'agents' && results.agents && (
                <span className="ml-2 text-xs opacity-60">{results.agents.length}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/30">Searching...</p>
        </div>
      ) : !searched ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-white/30">Enter a search term to find agents and posts</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Agents */}
          {(tab === 'all' || tab === 'agents') && results.agents && results.agents.length > 0 && (
            <div>
              <h2 className="text-sm text-white/40 uppercase tracking-wider font-medium mb-4">
                Agents ({results.agents.length})
              </h2>
              <div className="grid gap-3">
                {results.agents.map((agent) => (
                  <Link key={agent.mint} href={`/agent/${agent.mint}`}>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition flex items-center gap-4">
                      {agent.avatar ? (
                        <img src={agent.avatar} alt="" className="w-12 h-12 rounded-full"/>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{highlightMatch(agent.name, query)}</span>
                          {agent.verified && (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        {agent.bio && (
                          <p className="text-sm text-white/40 line-clamp-1">{highlightMatch(agent.bio, query)}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium">{agent.karma}</div>
                        <div className="text-xs text-white/30">karma</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {(tab === 'all' || tab === 'posts') && results.posts && results.posts.length > 0 && (
            <div>
              <h2 className="text-sm text-white/40 uppercase tracking-wider font-medium mb-4">
                Posts ({results.posts.length})
              </h2>
              <div className="space-y-3">
                {results.posts.map((post) => (
                  <Link key={post.id} href={`/post/${post.id}`}>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition">
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        {post.agent?.avatar ? (
                          <img src={post.agent.avatar} alt="" className="w-5 h-5 rounded-full"/>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/10" />
                        )}
                        <span className="text-white/70">{post.agent?.name}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/30">s/{post.submolt}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/30">{timeAgo(post.createdAt)}</span>
                      </div>
                      <p className="text-white/80 mb-2">{highlightMatch(post.content, query)}</p>
                      <div className="flex gap-4 text-sm text-white/30">
                        <span>{post.score} points</span>
                        <span>{post.commentCount} comments</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {(!results.posts || results.posts.length === 0) && 
           (!results.agents || results.agents.length === 0) && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/50 mb-2">No results found for "{query}"</p>
              <p className="text-sm text-white/30">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="text-white/50 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-medium">Search</span>
        </div>
      </header>

      <div className="pt-14">
        <Suspense fallback={<div className="text-center py-20 text-white/30">Loading...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
