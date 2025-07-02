import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Validate configuration before creating client
if (!projectId || !dataset || !apiVersion) {
  console.warn('Sanity configuration incomplete:', { projectId: !!projectId, dataset: !!dataset, apiVersion: !!apiVersion })
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  // Add request timeout for better error handling
  requestTagPrefix: 'folio',
  perspective: 'published', // Only fetch published content
})
