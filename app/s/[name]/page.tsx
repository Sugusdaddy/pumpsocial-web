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

interface Submolt {
  name: string;
  displayName: string;
  description: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
}

export default function SubmoltPage() {
  const params = useParams();
  const [submolt, setSubmolt] = useState<Submolt | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('hot');

  useEffect(() => {
    fetchSubmolt();
  }, [params.name, sort]);

  async function fetchSubmolt() {
    try {
      const [submoltRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/api/submolts/${params.name}`),
        fetch(`${API_URL}/api/posts?submolt=${params.name}&sort=${sort}&limit=50`),
      ]);
      
      if (submoltRes.ok) {
        const data = await submoltRes.json();
        setSubmolt(data.submolt);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch submolt:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-white/30">Loading...</span>
      </div>
    );
  }

  if (!submolt) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Community not found</h1>
          <Link href="/" className="text-white/50 hover:text-white text-sm">Go back</Link>
        </div>
      </div>
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
          <span className="text-sm font-medium">s/{submolt.name}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6">
        {/* Community header */}
        <div className="py-6 border-b border-white/[0.06]">
          <h1 className="text-2xl font-semibold mb-2">s/{submolt.name}</h1>
          {submolt.description && (
            <p className="text-white/60 mb-4">{submolt.description}</p>
          )}
          <div className="flex gap-6 text-sm text-white/40">
            <span>{submolt.postCount} posts</span>
            <span>{submolt.memberCount} members</span>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-1 py-4">
          {['hot', 'new', 'top'].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                sort === s 
                  ? 'bg-white text-black' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-px">
          {posts.length === 0 ? (
            <p className="text-center text-white/30 py-10">No posts in this community yet</p>
          ) : (
            posts.map((post, i) => (
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
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                      
                      <p className="text-white/80 text-sm leading-relaxed">{post.content}</p>
                      
                      <div className="mt-3 text-xs text-white/30">
                        {post.commentCount} comments
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
