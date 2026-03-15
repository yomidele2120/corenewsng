import Layout from "@/components/layout/Layout";
import ArticleCard from "@/components/news/ArticleCard";
import NewsletterSignup from "@/components/news/NewsletterSignup";
import { articles, categories } from "@/lib/mockData";
import { Link } from "react-router-dom";

const Index = () => {
  const heroArticle = articles.find((a) => a.isFeatured && a.isBreaking);
  const featuredArticles = articles.filter((a) => a.isFeatured && a.id !== heroArticle?.id).slice(0, 2);
  const trendingArticles = articles.filter((a) => a.isTrending).slice(0, 5);
  const latestArticles = articles.slice(0, 6);

  return (
    <Layout>
      {/* Hero + Trending */}
      <section className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Hero */}
          <div className="lg:col-span-8 border-r-0 lg:border-r border-border lg:pr-8">
            {heroArticle && <ArticleCard article={heroArticle} variant="hero" />}
          </div>

          {/* Trending sidebar */}
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

      {/* Featured Stories */}
      <section className="border-t border-border">
        <div className="container py-8 md:py-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border">
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="border-t border-border">
        <div className="container py-8 md:py-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="ghost-button">Load More Stories</button>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
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

      {/* Newsletter */}
      <NewsletterSignup />
    </Layout>
  );
};

export default Index;
