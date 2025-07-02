'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getArticleBySlug, type Highlight } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Highlight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticleBySlug(slug);
        if (data) {
          setArticle(data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="text-slate-500">Loading article...</div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Custom components for PortableText
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => (
        <div className="my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ''}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-slate-500 mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      ),
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6 first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-slate-700 leading-relaxed mb-4">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-200 pl-6 my-6 italic text-slate-600">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-slate-900">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }: any) => (
        <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          className="text-blue-600 hover:text-blue-700 underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span className="uppercase tracking-wide">{article.category}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            {article.title}
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            {article.description}
          </p>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-12">
            <Image
              src={urlFor(article.featuredImage).url()}
              alt={article.featuredImage.alt || article.title}
              width={1200}
              height={600}
              className="rounded-lg w-full h-auto shadow-lg"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        {article.content && (
          <div className="prose prose-slate max-w-none">
            <PortableText 
              value={article.content} 
              components={portableTextComponents}
            />
          </div>
        )}

        {/* External Link */}
        {article.href && (
          <div className="mt-12 p-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              View Project
            </h3>
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              Visit External Link →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
