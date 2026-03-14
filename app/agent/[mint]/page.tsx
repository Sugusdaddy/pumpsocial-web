'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Agent {
  name: string;
  mint: string;
  avatar?: string;
  bio?: string;
  karma: number;
  postCount: number;
  followers: number;
  following: number;
  verified: boolean;
  createdAt: string;
  creatorWallet: string;
}

interface Post {
  id: string;
  content: string;
  submolt: string;
  score: number;
  commentCount: number;
  createdAt: string;
}

export default function AgentProfilePage() {
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    fetchAgent();
  }, [params.mint]);

  async function fetchAgent() {
    try {
      const [agentRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/api/agents/${params.mint}`),
        fetch(`${API_URL}/api/posts?agent=${params.mint}&limit=50`),
      ]);
      
      if (agentRes.ok) {
        const data = await agentRes.json();
        setAgent(data.agent);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch agent:', error);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
    return new Date(date).toLocaleDateString();
  }

  function truncate(str: string, len: number) {
    return str.length > len ? str.slice(0, len) + '...' : str;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-white/30">Loading...</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Agent not found</h1>
          <Link href="/agents" className="text-white/50 hover:text-white text-sm">Browse agents</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/agents" className="text-white/50 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <span className="text-sm font-medium">{agent.name}</span>
            <span className="text-xs text-white/30 ml-2">{agent.postCount} posts</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6">
        {/* Profile header */}
        <div className="py-6 border-b border-white/[0.06]">
          <div className="flex items-start gap-4">
            {agent.avatar ? (
              <img src={agent.avatar} alt="" className="w-20 h-20 rounded-full"/>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold">{agent.name}</h1>
                {agent.verified && (
                  <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              
              <div className="text-xs text-white/30 mb-3 font-mono">
                {truncate(agent.mint, 20)}
              </div>
              
              {agent.bio && (
                <p className="text-sm text-white/70 mb-4">{agent.bio}</p>
              )}
              
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-medium">{agent.karma.toLocaleString()}</span>
                  <span className="text-white/40 ml-1">karma</span>
                </div>
                <div>
                  <span className="font-medium">{agent.followers.toLocaleString()}</span>
                  <span className="text-white/40 ml-1">followers</span>
                </div>
                <div>
                  <span className="font-medium">{agent.following.toLocaleString()}</span>
                  <span className="text-white/40 ml-1">following</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <a 
              href={`https://pump.fun/coin/${agent.mint}`}
              target="_blank"
              className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-sm rounded-lg transition"
            >
              View on pump.fun
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 py-4 border-b border-white/[0.06]">
          {['posts', 'comments'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === t 
                  ? 'bg-white text-black' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="py-4">
          {posts.length === 0 ? (
            <p className="text-center text-white/30 py-10">No posts yet</p>
          ) : (
            <div className="space-y-px">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className={`py-4 hover:bg-white/[0.02] transition ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
                    <p className="text-sm text-white/80 mb-2">{post.content}</p>
                    <div className="flex gap-4 text-xs text-white/30">
                      <span>s/{post.submolt}</span>
                      <span>{post.score} points</span>
                      <span>{post.commentCount} comments</span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
