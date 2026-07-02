import React from 'react';
import { Download, Asterisk, TrendingUp, TrendingDown, Users, Clock, Eye, ArrowRight, CheckCircle2, Image as ImageIcon, MessageSquare, UploadCloud, Edit3, ArrowUpCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Dummy data for charts
const pageViewsData = [
  { value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 700 }, { value: 650 }, { value: 800 }
];

const uniqueVisitorsData = [
  { value: 200 }, { value: 350 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }, { value: 750 }
];

const readTimeData = [
  { value: 4 }, { value: 3.8 }, { value: 4.2 }, { value: 3.5 }, { value: 3.2 }, { value: 3.4 }, { value: 3.1 }
];

const activeEditorsData = [
  { value: 20 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 47 }
];

const performanceData = [
  { id: 1, headline: 'Global Markets Rally as Tech Sector Rebounds', author: 'S. Jenkins', viewsPerMin: '4,250', totalViews: '142.5K', engRate: '68%', trend: 'up', status: 'red' },
  { id: 2, headline: 'New Climate Accord Reached After Marathon Talks', author: 'M. Al-Fayed', viewsPerMin: '3,120', totalViews: '89.2K', engRate: '72%', trend: 'up', status: 'green' },
  { id: 3, headline: 'Op-Ed: The Future of Urban Mobility', author: 'L. Chen', viewsPerMin: '1,845', totalViews: '45.1K', engRate: '41%', trend: 'neutral', status: 'gray' },
  { id: 4, headline: 'Local Elections: Key Districts to Watch', author: 'T. Barnes', viewsPerMin: '950', totalViews: '12.4K', engRate: '55%', trend: 'up', status: 'gray' },
  { id: 5, headline: 'Restaurant Review: The Hidden Gem in Downtown', author: 'C. Davis', viewsPerMin: '420', totalViews: '28.9K', engRate: '32%', trend: 'down', status: 'gray' },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* SECTION 1: Data Dashboard */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-serif mb-1">Morning Edition Data Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Live sync active
              </span>
              <span>•</span>
              <span>Last updated: Just now</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm shadow-red-100">
              <Asterisk className="w-4 h-4 text-red-600" /> Breaking Event
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Page Views */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Page Views (1H)</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900 leading-none mb-2">2.4M</div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                  <ArrowRight className="w-3 h-3 -rotate-45" /> 12.4%
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViewsData}>
                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unique Visitors (1H)</span>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900 leading-none mb-2">842K</div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                  <ArrowRight className="w-3 h-3 -rotate-45" /> 5.2%
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={uniqueVisitorsData}>
                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Avg Read Time */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Read Time</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900 leading-none mb-2">3m 12s</div>
                <div className="flex items-center gap-1 text-sm font-bold text-red-500">
                  <ArrowRight className="w-3 h-3 rotate-45" /> 2.1%
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readTimeData}>
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Editors */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Editors</span>
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900 leading-none mb-2">47</div>
                <div className="text-sm font-medium text-gray-500">
                  Currently online
                </div>
              </div>
              <div className="h-12 w-24 flex items-end justify-end gap-1 pb-1">
                {activeEditorsData.map((d, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 rounded-t-sm ${i === activeEditorsData.length - 1 || i === activeEditorsData.length - 2 ? 'bg-[#c8232c]' : 'bg-gray-200'}`}
                    style={{ height: `${(d.value / 50) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-gray-900">Real-Time Article Performance</h2>
            </div>
            <div className="flex items-center bg-gray-50 p-1 rounded-md border border-gray-200">
              <button className="px-4 py-1 text-sm font-medium bg-white shadow-sm border border-gray-200 rounded text-gray-900">Last Hour</button>
              <button className="px-4 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">Today</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Headline</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Views/Min</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Views</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Eng. Rate</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {performanceData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4 text-sm text-gray-500 font-medium">{row.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          row.status === 'red' ? 'bg-red-500' : 
                          row.status === 'green' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        <span className="font-medium text-gray-900 line-clamp-1">{row.headline}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{row.author}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium text-right">{row.viewsPerMin}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 text-right whitespace-nowrap">{row.totalViews}</td>
                    <td className="py-4 px-4 text-sm text-right">
                      <span className={`${row.engRate.startsWith('6') || row.engRate.startsWith('7') ? 'text-green-600 font-medium' : row.engRate.startsWith('3') || row.engRate.startsWith('4') ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {row.engRate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {row.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" strokeWidth={2.5} />}
                        {row.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" strokeWidth={2.5} />}
                        {row.trend === 'neutral' && <ArrowRight className="w-4 h-4 text-gray-400" strokeWidth={2.5} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full" />

      {/* SECTION 2: Editorial Desk */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-serif mb-1">Editorial Desk</h1>
            <p className="text-gray-500 text-lg">Manage the news flow, review drafts, and track live content.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Asterisk className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold leading-tight">Breaking News</div>
                <div className="text-xs text-gray-500 leading-tight">Push an alert</div>
              </div>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold leading-tight">Media Hub</div>
                <div className="text-xs text-gray-500 leading-tight">Upload assets</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Needs Review Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Needs Review</h2>
                <button className="text-sm font-bold text-red-600 hover:text-red-700">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow group cursor-pointer">
                  <div className="h-40 bg-gray-900 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#e8e4db] text-gray-900 text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-sm">IN REVIEW</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-xs font-medium text-gray-500">Politics</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-4">New Policy Shift Announced Ahead of Upcoming Electi...</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-sm text-gray-600 font-medium">Sarah Jenkins</span>
                      </div>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow group cursor-pointer">
                  <div className="h-40 bg-gray-900 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#e8e4db] text-gray-900 text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-sm">IN REVIEW</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-medium text-gray-500">Economy</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-4">Markets React to Surprise Interest Rate Adjustment</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60" alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-sm text-gray-600 font-medium">David Chen</span>
                      </div>
                      <span className="text-xs text-gray-400">4h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Drafts Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Drafts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                  <div className="mb-3">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">DRAFT</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">The Future of Urban Transit Systems</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">Exploring the upcoming investments in public transportation infrastructure across...</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Last edited yesterday</span>
                    <button className="text-sm font-bold text-red-600 hover:text-red-700">Resume Editing</button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                  <div className="mb-3">
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">CHANGES REQUESTED</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">Tech Giant Unveils New Sustainability Plan</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">A deep dive into the recent environmental commitments announced by industry...</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Last edited 3 days ago</span>
                    <button className="text-sm font-bold text-red-600 hover:text-red-700">View Comments</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Live Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Live Activity</h2>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              
              <div className="space-y-6 flex-1">
                {/* Activity Item 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-bold text-gray-900">Editor in Chief</span> approved <span className="italic">Global Climate Summit Wrap-up</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">10 mins ago • Scheduled for 2:00 PM</p>
                  </div>
                </div>
                
                {/* Activity Item 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-bold text-gray-900">Michael T.</span> created a new draft <span className="italic">Weekend Arts Guide</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">45 mins ago • Culture Desk</p>
                  </div>
                </div>
                
                {/* Activity Item 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-bold text-gray-900">Copy Desk</span> left 3 comments on <span className="italic">Local Election Results</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hr ago • Needs revision</p>
                  </div>
                </div>
                
                {/* Activity Item 4 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <ArrowUpCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-bold text-gray-900">System</span> published <span className="italic">Morning Briefing</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hrs ago • Front Page</p>
                  </div>
                </div>
                
                {/* Activity Item 5 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-bold text-gray-900">Photo Team</span> uploaded 12 new assets to <span className="italic">Mayoral Debate Gallery</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">3 hrs ago</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 mt-6 border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                View Full Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
