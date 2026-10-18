import type { RichNode } from './rich-content'
export interface PriceOption {
  id: string
  label: string
  description: string
  price: number
}
export interface SiteSettings {
  email: string
  name: string
  nip: string
  tagline: string
  availability: string
  phone: string
  streetAddress: string
  postalCode: string
  addressLocality: string
  googleMapsUrl: string
  projects: PriceOption[]
  extras: PriceOption[]
  monthly: PriceOption[]
  designs: PriceOption[]
  productImports: PriceOption[]
}
export interface QuoteInput {
  project: string
  extras: string[]
  monthly: string[]
  pages: number
  languages: number
  urgent: boolean
  design?: string
  productRange?: string
  productEntry?: 'self' | 'makoto' | 'unsure'
  appPurpose?: string
}
export interface QuoteBrief {
  goal: 'landing' | 'website' | 'store' | 'application' | 'unsure'
  undecided: string[]
}
export interface QuoteResult {
  total: number
  monthly: number
  lines: { label: string; price: number }[]
  monthlyLines: { label: string; price: number }[]
  weeks: string
  requiresIndividual?: boolean
  individualReasons?: string[]
  selections?: { label: string; value: string }[]
}
export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  city: string
  originPage: string
  source: 'contact' | 'calculator'
  status: 'new' | 'contacted' | 'proposal' | 'won' | 'closed'
  brief?: QuoteBrief | null
  quote: (QuoteResult & { configuration: QuoteInput }) | null
  notes: string
  createdAt: string
  updatedAt: string
}
export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  document?: RichNode
  category: string
  cover: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  html?: string
}
export interface Project {
  slug: string
  title: string
  category: string
  description: string
  image: string
  color: string
  technologies: string[]
  url?: string
  detail: string
  document?: RichNode
}
