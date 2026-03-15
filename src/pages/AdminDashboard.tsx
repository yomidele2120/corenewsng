import { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "@/lib/mockData";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles, PenLine, Send, ChevronRight } from "lucide-react";

const mockAISuggestions = [
  {
    id: "ai-1",
    headline: "ECOWAS Summit: West African Leaders Agree on Common Currency Timeline",
    summary: "Leaders from 15 West African nations have agreed to a revised timeline for the introduction of the ECO, a single currency for the region, with implementation now set for 2028.",
    source: "Reuters, AFP",
    category: "World",
    confidence: 92,
  },
  {
    id: "ai-2",
    headline: "Nigerian Fintech Sector Processes ₦12 Trillion in Q1 2026",
    summary: "Nigeria's financial technology sector has processed over ₦12 trillion in transactions during the first quarter of 2026, marking a 45% increase year-over-year.",
    source: "Bloomberg, TechCabal",
    category: "Technology",
    confidence: 88,
  },
  {
    id: "ai-3",
    headline: "Lagos State Unveils $500M Urban Rail Extension Plan",
    summary: "The Lagos State Government has unveiled plans for a $500 million extension of the Blue Line rail system, connecting key economic zones across the megacity.",
    source: "Channels TV, The Guardian Nigeria",
    category: "Nigeria",
    confidence: 95,
  },
];

const AdminDashboard = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pulse" | "published">("pulse");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin header */}
      <header className="bg-background border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl font-bold">
              Core<span className="text-primary">News</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-l border-border pl-4">
              Admin Dashboard
            </span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("pulse")}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "pulse" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI News Pulse
            </span>
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "published" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            Published Stories
          </button>
        </div>

        {activeTab === "pulse" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* AI Suggestions List */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  AI Suggestions
                </h2>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-green-500"
                  />
                  <span className="text-xs text-muted-foreground">Live · Updates every 10 min</span>
                </div>
              </div>

              <div className="space-y-0">
                {mockAISuggestions.map((s) => (
                  <motion.div
                    key={s.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedSuggestion(s.id)}
                    className={`border-b border-border py-4 cursor-pointer transition-colors ${
                      selectedSuggestion === s.id ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="category-tag text-[10px]">{s.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.confidence >= 90
                          ? "bg-green-100 text-green-800"
                          : s.confidence >= 80
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {s.confidence}% confidence
                      </span>
                    </div>
                    <h3 className="text-sm font-serif font-semibold leading-snug">{s.headline}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.summary}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Sources: {s.source}</p>
                  </motion.div>
                ))}
              </div>

              <button className="ghost-button mt-4 w-full flex items-center justify-center gap-2">
                <RefreshCw className="h-3 w-3" />
                Refresh Suggestions
              </button>
            </div>

            {/* Editor Panel */}
            <div className="lg:col-span-7 border-l-0 lg:border-l border-border lg:pl-8">
              {selectedSuggestion ? (
                (() => {
                  const suggestion = mockAISuggestions.find((s) => s.id === selectedSuggestion);
                  if (!suggestion) return null;
                  return (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">
                        Story Editor
                      </h2>

                      {/* AI Actions */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        <button className="ghost-button flex items-center gap-2 text-xs">
                          <Sparkles className="h-3 w-3" />
                          Generate Headlines
                        </button>
                        <button className="ghost-button flex items-center gap-2 text-xs">
                          <PenLine className="h-3 w-3" />
                          Journalistic Rewrite
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Headline</label>
                          <input
                            defaultValue={suggestion.headline}
                            className="w-full border border-border px-3 py-2 text-sm font-serif font-semibold focus:outline-none focus:border-foreground transition-colors bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Category</label>
                          <select
                            defaultValue={suggestion.category}
                            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
                          >
                            <option>Nigeria</option>
                            <option>World</option>
                            <option>Business & Economy</option>
                            <option>Technology</option>
                            <option>Investigations</option>
                            <option>Opinions</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Article Body</label>
                          <textarea
                            rows={10}
                            defaultValue={suggestion.summary}
                            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors bg-background resize-none leading-relaxed"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Featured Image</label>
                          <div className="border border-dashed border-border p-8 text-center">
                            <p className="text-sm text-muted-foreground">Drop image here or click to upload</p>
                          </div>
                        </div>
                        <button className="bg-foreground text-background px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-foreground/90 transition-colors flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Publish Story
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                  <div className="text-center">
                    <ChevronRight className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select a story suggestion to begin editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "published" && (
          <div className="space-y-0">
            {articles.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border py-4">
                <div className="flex-1">
                  <span className="category-tag text-[10px] mb-1 block">{a.category}</span>
                  <h3 className="text-sm font-serif font-semibold">{a.title}</h3>
                  <span className="meta-text text-xs">{a.author} · {a.date}</span>
                </div>
                <Link to={`/article/${a.id}`} className="ghost-button text-xs ml-4">View</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
