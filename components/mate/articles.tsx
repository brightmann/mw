import { getAllArticles } from '@/lib/articles/parser';
import { ArticlePreview } from './article-preview';
import { BlogPagination } from './blog-pagination';

export const ARTICLES_PER_PAGE = 5;

export async function getArticlePages(): Promise<number> {
  const articles = await getAllArticles();
  const count = articles.filter((article) => !article.frontmatter.translated).length;
  return Math.max(1, Math.ceil(count / ARTICLES_PER_PAGE));
}

export async function Articles({ page = 1 }: { page?: number }) {
  const articles = await getAllArticles();

  // Filter non-translated articles once (server-side, so useMemo not needed)
  const nonTranslatedArticles = articles.filter((article) => !article.frontmatter.translated);
  const totalPages = Math.max(1, Math.ceil(nonTranslatedArticles.length / ARTICLES_PER_PAGE));
  const pageArticles = nonTranslatedArticles.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);

  // The newest article gets the featured hero, but only on the first page
  const featuredArticle = page === 1 ? pageArticles[0] : undefined;
  const gridArticles = page === 1 ? pageArticles.slice(1) : pageArticles;

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome to my personal blog! Here, the community, and I share our thoughts and experiences.
        </p>
      </div>

      {featuredArticle && (
        <div className="featured-section mb-8">
          <ArticlePreview
            key={featuredArticle.frontmatter.slug}
            title={featuredArticle.frontmatter.title}
            description={featuredArticle.frontmatter.description}
            date={featuredArticle.frontmatter.date}
            slug={featuredArticle.frontmatter.slug}
            author={featuredArticle.frontmatter.author}
            image={featuredArticle.frontmatter.image}
            tags={featuredArticle.frontmatter.tags}
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {gridArticles.map((article) => (
          <ArticlePreview
            key={article.frontmatter.slug}
            title={article.frontmatter.title}
            description={article.frontmatter.description}
            date={article.frontmatter.date}
            slug={article.frontmatter.slug}
            author={article.frontmatter.author}
            image={article.frontmatter.image}
            tags={article.frontmatter.tags}
          />
        ))}
      </div>

      <BlogPagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
