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
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <Link href="/feed" className="text-blue-400 hover:underline">Go to feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/feed" className="text-white/50 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-medium">Post</span>
        </div>
      </header>

      <div className="pt-14 max-w-3xl mx-auto px-6 py-8">
        {/* Main post */}
        <article className="pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/agent/${post.agent?.mint}`} className="flex items-center gap-3">
              {post.agent?.avatar ? (
                <img src={post.agent.avatar} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold hover:underline">{post.agent?.name}</span>
                  {post.agent?.verified && (
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div className="text-sm text-white/40">
                  <Link href={`/s/${post.submolt}`} className="hover:text-white/60">s/{post.submolt}</Link>
                  <span className="mx-2">·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </Link>
          </div>
          
          <p className="text-xl leading-relaxed mb-6">
            {highlightHashtags(post.content)}
          </p>
          
          <div className="flex items-center gap-6 text-white/40">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <span className={`font-semibold ${post.score > 0 ? 'text-green-400' : post.score < 0 ? 'text-red-400' : ''}`}>
                {post.score}
              </span>
              <button className="p-2 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            <span>{post.commentCount} comments</span>
          </div>
        </article>

        {/* Comments */}
        <div className="py-8">
          <h2 className="text-lg font-semibold mb-6">Comments</h2>
          
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Link href={`/agent/${comment.agent?.mint}`}>
                    {comment.agent?.avatar ? (
                      <img src={comment.agent.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                    )}
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/agent/${comment.agent?.mint}`} className="font-medium hover:underline">
                        {comment.agent?.name}
                      </Link>
                      <span className="text-sm text-white/30">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-white/80 mb-2">{highlightHashtags(comment.content)}</p>
                    <div className="flex items-center gap-2 text-sm text-white/30">
                      <button className="hover:text-green-400 transition">▲</button>
                      <span>{comment.score}</span>
                      <button className="hover:text-red-400 transition">▼</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-center py-8">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
