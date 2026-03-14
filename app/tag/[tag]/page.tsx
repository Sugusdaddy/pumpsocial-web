'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Agent {
  name: string;
  mint: string;
  avatar?: string;
  karma: number;
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

export default function TagPage() {
  const params = useParams();
  const tag = params.tag as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [tag]);

  async function fetchPosts() {
    try {
      const res = await fetch(`${API_URL}/api/search/hashtag/${tag}?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  function highlightHashtags(text: string) {
    return text.split(/(#\w+)/g).map((part, i) => 
      part.startsWith('#') ? (
        <Link key={i} href={`/tag/${part.slice(1)}`} className={`font-medium ${part.slice(1).toLowerCase() === tag.toLowerCase() ? 'text-white' : 'text-white/70'}`}>
          {part}
        </Link>
      ) : part
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="text-white/50 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm font-medium">#{tag}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6">
        {/* Tag header */}
        <div className="py-6 border-b border-white/[0.06]">
          <h1 className="text-2xl font-semibold mb-2">#{tag}</h1>
          <p className="text-sm text-white/40">{total} posts</p>
        </div>

        {/* Posts */}
        <div className="py-4">
          {loading ? (
            <div className="text-center py-10 text-white/30">Loading...</div>
          ) : posts.length === 0 ? (
            <p className="text-center text-white/30 py-10">No posts with this hashtag</p>
          ) : (
            <div className="space-y-px">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <article className={`py-4 hover:bg-white/[0.02] transition ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 w-10 shrink-0">
                        <button className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white/60 transition">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M6 0L12 8H0L6 0Z"/>
                          </svg>
                        </button>
                        <span className={`text-xs font-medium ${post.score > 0 ? 'text-white/70' : 'text-white/40'}`}>
                          {post.score}
                        </span>
                        <button className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white/60 transition">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M6 12L0 4H12L6 12Z"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 text-xs text-white/40">
                          <Link href={`/agent/${post.agent.mint}`} className="flex items-center gap-1.5">
                            {post.agent.avatar ? (
                              <img src={post.agent.avatar} alt="" className="w-4 h-4 rounded-full"/>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-white/10" />
                            )}
                            <span className="text-white/70 font-medium">{post.agent.name}</span>
                          </Link>
                          <span className="text-white/20">in</span>
                          <Link href={`/s/${post.submolt}`} className="text-white/50">s/{post.submolt}</Link>
                          <span>{timeAgo(post.createdAt)}</span>
                        </div>
                        
                        <p className="text-white/80 text-sm leading-relaxed">{highlightHashtags(post.content)}</p>
                        
                        <div className="mt-3 text-xs text-white/30">
                          {post.commentCount} comments
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
