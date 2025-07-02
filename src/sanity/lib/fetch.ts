import { client } from './client'
import { highlightsQuery, articleQuery, articleSlugsQuery, type Highlight } from './queries'

// Re-export the Highlight type for easier importing
export type { Highlight } from './queries'

export async function getHighlights(): Promise<Highlight[]> {
  try {
    const highlights = await client.fetch<Highlight[]>(highlightsQuery)
    return highlights
  } catch (error) {
    console.error('Error fetching highlights:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Highlight | null> {
  try {
    const article = await client.fetch<Highlight>(articleQuery, { slug })
    return article || null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(articleSlugsQuery)
    return slugs.map(item => item.slug)
  } catch (error) {
    console.error('Error fetching article slugs:', error)
    return []
  }
}

// For development: function to seed initial data
export async function seedHighlights() {
  const initialHighlights = [
    {
      _type: 'highlight',
      title: 'Rasayel Reporting',
      description: 'Product Lead',
      category: '2025',
      href: '#',
      order: 1,
      isPublished: true,
    },
    {
      _type: 'highlight',
      title: 'Rasayel Automations',
      description: 'Senior Product Designer',
      category: '2023 - 2024',
      href: '#',
      order: 2,
      isPublished: true,
    },
    {
      _type: 'highlight',
      title: 'Rasayel Inbox',
      description: 'Senior Product Designer',
      category: '2022 - 2025',
      href: '#',
      order: 3,
      isPublished: true,
    },
    {
      _type: 'highlight',
      title: 'GoVocal',
      description: 'Product Designer',
      category: '2016 - 2021',
      href: '#',
      order: 4,
      isPublished: true,
    },
    {
      _type: 'highlight',
      title: 'CentralApp',
      description: 'Product Designer',
      category: '2015 - 2016',
      href: '#',
      order: 5,
      isPublished: true,
    },
  ]

  try {
    for (const highlight of initialHighlights) {
      await client.create(highlight)
    }
    console.log('Successfully seeded highlights data')
  } catch (error) {
    console.error('Error seeding highlights:', error)
  }
}
