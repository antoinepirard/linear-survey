import { groq } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'

// Define the Highlight type to match our schema
export interface Highlight {
  _id: string
  title: string
  slug: {
    current: string
  }
  description: string
  category: string
  featuredImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  content?: PortableTextBlock[]
  href?: string
  order: number
  isPublished: boolean
}

// GROQ query to fetch published highlights ordered by display order (for homepage)
export const highlightsQuery = groq`
  *[_type == "highlight" && isPublished == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    featuredImage {
      asset->,
      alt
    },
    href,
    order,
    isPublished
  }
`

// GROQ query to fetch a single article by slug
export const articleQuery = groq`
  *[_type == "highlight" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    featuredImage {
      asset->,
      alt
    },
    content,
    href,
    order,
    isPublished
  }
`

// GROQ query to get all article slugs for static generation
export const articleSlugsQuery = groq`
  *[_type == "highlight" && isPublished == true && defined(slug.current)] {
    "slug": slug.current
  }
`
