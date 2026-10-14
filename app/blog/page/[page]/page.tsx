import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { memo, Suspense } from 'react';
import { ArticlePreviewSkeleton } from '@/components/mate/article-preview.skeleton';
import { Articles, getArticlePages } from '@/components/mate/articles';
import { Main } from '@/components/mate/main';
import { PageHeader } from '@/components/mate/page-header';
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema';
import meta from '@/lib/config/metadata';

export async function generateStaticParams(): Promise<{ page: string }[]> {
  const totalPages = await getArticlePages();
  // Page 1 lives at /blog; only pages 2..N get their own route
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog - Page ${page} - Technical Articles & Tutorials`,
    description: `Where can I find ${meta.author.name}'s blog posts? Page ${page} of technical articles about Node.js testing, TypeScript, Next.js, AI engineering, and modern web development.`,
  };
}

const Header = memo(({ page }: { page: number }) => (
  <PageHeader
    title="Articles"
    subtitle="Articles written with ❤️ by me and the Community."
    asHeading
    breadcrumbItems={[
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: `Page ${page}`,
        href: `/blog/page/${page}`,
      },
    ]}
  />
));

const ArticlesContent = memo(({ page }: { page: number }) => (
  <div className="space-y-8">
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticlePreviewSkeleton />
          <ArticlePreviewSkeleton />
          <ArticlePreviewSkeleton />
        </div>
      }
    >
      <Articles page={page} />
    </Suspense>
  </div>
));

export default async function BlogPagedPage({ params }: { params: Promise<{ page: string }> }): Promise<JSX.Element> {
  const { page } = await params;
  const pageNum = Number.parseInt(page, 10);
  const totalPages = await getArticlePages();

  if (!Number.isInteger(pageNum) || pageNum < 2 || pageNum > totalPages) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Blog', href: '/blog' }]} />
      <Header page={pageNum} />
      <Main>
        <ArticlesContent page={pageNum} />
      </Main>
    </>
  );
}
