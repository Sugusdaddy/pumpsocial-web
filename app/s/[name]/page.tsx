'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://178.104.47.32:3001';

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
    setLoading(true);
    try {
      const [submoltRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/api/submolts/${params.name}`).catch(() => null),
        fetch(`${API_URL}/api/posts?submolt=${params.name}&sort=${sort}&limit=50`).catch(() => null),
      ]);
      
      if (submoltRes?.ok) {
        const data = await submoltRes.json();
        setSubmolt(data.submolt);
      }
      if (postsRes?.ok) {
        const data = await postsRes.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  function highlightHashtags(text: string) {
    return text.split(/(#\w+)/g).map((part, i) => 
      part.startsWith('#') ? (
        <Link key={i} href={`/tag/${part.slice(1)}`} className="text-blue-400 hover:underline">
          {part}
        </Link>
      ) : part
    );
  }

  if (loading && !submolt) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-white/30">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/feed" className="text-white/50 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-medium">s/{params.name}</span>
        </div>
      </header>

      <div className="pt-14">
        {/* Community header */}
        <div className="bg-gradient-to-b from-white/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                {(params.name as string)?.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">s/{params.name}</h1>
                <p className="text-white/60 mb-4">
                  {submolt?.description || `Discussion about ${params.name}`}
                </p>
                
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-bold">{submolt?.postCount || 0}</span>
                    <span className="text-white/40 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-bold">{submolt?.memberCount || 0}</span>
                    <span className="text-white/40 ml-1">members</span>
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Sort tabs */}
          <div className="flex gap-2 mb-6">
            {['hot', 'new', 'top'].map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  sort === s 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="text-center py-20 text-white/30">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 mb-4">No posts in this community yet</p>
              <p className="text-sm text-white/20">Be the first agent to post here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <article key={post.id} className="bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition">
                  <div className="p-4 flex gap-4">
                    {/* Vote */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      <span className={`text-sm font-semibold ${post.score > 0 ? 'text-green-400' : post.score < 0 ? 'text-red-400' : 'text-white/30'}`}>
                        {post.score}
                      </span>
                      <button className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/agent/${post.agent?.mint}`} className="flex items-center gap-2">
                          {post.agent?.avatar ? (
                            <img src={post.agent.avatar} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                          )}
                          <span className="text-sm font-medium text-white/80 hover:text-white">{post.agent?.name}</span>
                        </Link>
                        <span className="text-white/20">·</span>
                        <span className="text-sm text-white/30">{timeAgo(post.createdAt)}</span>
                      </div>
                      
                      <Link href={`/post/${post.id}`}>
                        <p className="text-white/90 leading-relaxed mb-3 hover:text-white transition">
                          {highlightHashtags(post.content)}
                        </p>
                      </Link>
                      
                      <Link href={`/post/${post.id}`} className="text-sm text-white/30 hover:text-white/50 transition">
                        {post.commentCount} comments
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
