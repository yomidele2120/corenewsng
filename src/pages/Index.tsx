import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ArticleCard from "@/components/news/ArticleCard";
import HeroSlideshow from "@/components/news/HeroSlideshow";
import NewsletterSignup from "@/components/news/NewsletterSignup";
import { supabase } from "@/integrations/supabase/client";
import { articles as mockArticles, categories } from "@/lib/mockData";
import { type Article } from "@/lib/mockData";
import { Link } from "react-router-dom";

const Index = () => {
  const [dbArticles, setDbArticles] = useState<Article[]>([]);
  const [heroArticles, setHeroArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        const mapped: Article[] = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          summary: a.summary || "",
          content: a.content || "",
          category: a.category,
          author: a.author || "CoreNews Staff",
          date: a.published_at ? new Date(a.published_at).toLocaleDateString() : "",
          imageUrl: a.image_url || "",
          readTime: a.read_time || "5 min",
          isBreaking: a.is_breaking || false,
          isFeatured: a.is_featured || false,
          isTrending: a.is_trending || false,
          isOpinion: a.is_opinion || false,
        }));
        setDbArticles(mapped);

        // Hero articles: hero_enabled and not expired
        const now = new Date().toISOString();
        const heroes = data
          .filter((a: any) => a.hero_enabled && (!a.hero_expires_at || a.hero_expires_at > now))
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            summary: a.summary || "",
            content: a.content || "",
            category: a.category,
            author: a.author || "CoreNews Staff",
            date: a.published_at ? new Date(a.published_at).toLocaleDateString() : "",
            imageUrl: a.image_url || "",
            readTime: a.read_time || "5 min",
            isBreaking: a.is_breaking || false,
            isFeatured: a.is_featured || false,
            isTrending: a.is_trending || false,
            isOpinion: a.is_opinion || false,
          }));
        setHeroArticles(heroes);
      }
    };

    fetchArticles();

    const channel = supabase
      .channel("homepage-articles")
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, () => {
        fetchArticles();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Merge: DB articles first, then mock as fallback
  const allArticles = dbArticles.length > 0 ? [...dbArticles, ...mockArticles] : mockArticles;

  // If no hero articles from DB, use featured articles for slideshow
  const slideshowArticles = heroArticles.length > 0
    ? heroArticles
    : allArticles.filter((a) => a.isFeatured).slice(0, 4);

  // Nigeria-focused: prioritize Nigeria category on homepage
  const nigeriaArticles = allArticles.filter((a) => a.category === "Nigeria").slice(0, 4);
  const trendingArticles = allArticles.filter((a) => a.isTrending).slice(0, 5);
  const latestArticles = allArticles.filter((a) => !heroArticles.some((h) => h.id === a.id)).slice(0, 6);

  return (
    <Layout>
      {/* Hero Slideshow */}
      {slideshowArticles.length > 0 && (
        <HeroSlideshow articles={slideshowArticles} />
      )}

      {/* Nigeria Focus Section */}
      {nigeriaArticles.length > 0 && (
        <section className="border-t border-border">
          <div className="container py-8 md:py-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nigeria News
              </h2>
              <Link to="/nigeria" className="text-xs text-primary hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nigeriaArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 border-r-0 lg:border-r border-border lg:pr-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border">
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border">
              Trending Now
            </h2>
            <div className="space-y-0">
              {trendingArticles.map((a, i) => (
                <div key={a.id} className="flex gap-3 items-start card-editorial py-4">
                  <span className="font-serif text-3xl font-bold text-muted-foreground/30 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link to={`/article/${a.id}`} className="group flex-1">
                    <span className="category-tag text-[10px] mb-1 block">{a.category}</span>
                    <h3 className="text-sm font-serif font-semibold leading-snug headline-hover">
                      {a.title}
                    </h3>
                    <span className="meta-text text-xs mt-1 block">{a.readTime}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/50">
        <div className="container py-8 md:py-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border">
            Explore Sections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="border border-border bg-background p-4 text-center hover:border-foreground transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-accent transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </Layout>
  );
};

export default Index;
