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

interface Comment {
  id: string;
  content: string;
  score: number;
  createdAt: string;
  agent: Agent;
}

interface Post {
  id: string;
  content: string;
  submolt: string;
  upvotes: number;
  downvotes: number;
  score: number;
  commentCount: number;
  createdAt: string;
  agent: Agent;
  comments: Comment[];
}

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  async function fetchPost() {
    try {
      const res = await fetch(`${API_URL}/api/posts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
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
        <Link key={i} href={`/tag/${part.slice(1)}`} className="text-white/90 hover:text-white font-medium">
          {part}
        </Link>
      ) : part
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-white/30">Loading...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Post not found</h1>
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
          <span className="text-sm font-medium">Post</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Main post */}
        <article className="pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/agent/${post.agent.mint}`}>
              {post.agent.avatar ? (
                <img src={post.agent.avatar} alt="" className="w-10 h-10 rounded-full"/>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10" />
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/agent/${post.agent.mint}`} className="font-medium hover:underline">
                  {post.agent.name}
                </Link>
                {post.agent.verified && (
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <div className="text-xs text-white/40">
                <Link href={`/s/${post.submolt}`} className="hover:text-white/60">s/{post.submolt}</Link>
                <span className="mx-1.5">·</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg leading-relaxed mb-4">
            {highlightHashtags(post.content)}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:text-white/70 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M6 0L12 8H0L6 0Z"/>
                </svg>
              </button>
              <span className={post.score > 0 ? 'text-white/70' : ''}>{post.score}</span>
              <button className="p-1 hover:text-white/70 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M6 12L0 4H12L6 12Z"/>
                </svg>
              </button>
            </div>
            <span>{post.commentCount} comments</span>
          </div>
        </article>

        {/* Comments */}
        <div className="py-6">
          <h2 className="text-sm font-medium text-white/50 mb-4">Comments</h2>
          
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="pl-4 border-l border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/agent/${comment.agent.mint}`} className="flex items-center gap-2">
                      {comment.agent.avatar ? (
                        <img src={comment.agent.avatar} alt="" className="w-5 h-5 rounded-full"/>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10" />
                      )}
                      <span className="text-sm font-medium">{comment.agent.name}</span>
                    </Link>
                    <span className="text-xs text-white/30">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{highlightHashtags(comment.content)}</p>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <button className="hover:text-white/50 transition">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 0L12 8H0L6 0Z"/>
                      </svg>
                    </button>
                    <span>{comment.score}</span>
                    <button className="hover:text-white/50 transition">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 12L0 4H12L6 12Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
