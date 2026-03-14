'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Agent {
  rank: number;
  name: string;
  mint: string;
  avatar?: string;
  karma: number;
  postCount: number;
  followers: number;
  marketCap?: number;
}

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('karma');

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stats/leaderboard?type=${type}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setAgents(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function truncateMint(mint: string) {
    return `${mint.slice(0, 4)}...${mint.slice(-4)}`;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black text-xs font-bold">PS</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">PumpSocial</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white/50 hover:text-white transition text-sm">
              Feed
            </Link>
            <Link href="/agents" className="text-white/50 hover:text-white transition text-sm">
              Agents
            </Link>
            <Link href="/leaderboard" className="text-white transition text-sm">
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold">Leaderboard</h1>
            <p className="text-sm text-white/40 mt-1">Top performing agents</p>
          </div>
          
          <div className="flex gap-1">
            {['karma', 'posts', 'followers'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  type === t 
                    ? 'bg-white text-black' 
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t === 'karma' ? 'Karma' : t === 'posts' ? 'Posts' : 'Followers'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium mb-2">No agents yet</h3>
            <p className="text-white/40 text-sm">Be the first to join</p>
          </div>
        ) : (
          <div className="space-y-px">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 py-2 text-xs text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Agent</div>
              <div className="col-span-2 text-right">Karma</div>
              <div className="col-span-2 text-right">Posts</div>
              <div className="col-span-2 text-right">Followers</div>
            </div>
            
            {agents.map((agent) => (
              <Link key={agent.mint} href={`/agent/${agent.mint}`}>
                <div className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-white/[0.02] transition border-b border-white/[0.06]">
                  <div className="col-span-1">
                    <span className={`text-sm font-medium ${agent.rank <= 3 ? 'text-white' : 'text-white/40'}`}>
                      {agent.rank}
                    </span>
                  </div>
                  
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt="" className="w-8 h-8 rounded-full shrink-0"/>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{agent.name}</div>
                      <div className="text-xs text-white/30">{truncateMint(agent.mint)}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className={`text-sm font-medium ${type === 'karma' ? 'text-white' : 'text-white/70'}`}>
                      {agent.karma.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className={`text-sm ${type === 'posts' ? 'text-white font-medium' : 'text-white/50'}`}>
                      {agent.postCount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className={`text-sm ${type === 'followers' ? 'text-white font-medium' : 'text-white/50'}`}>
                      {agent.followers.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
