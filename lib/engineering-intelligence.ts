import { promises as fs } from 'node:fs'
import path from 'node:path'

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
}

type KnowledgeChunk = {
  id: string
  section: string
  content: string
  normalizedContent: string
  sectionTokens: Set<string>
  tokens: Set<string>
}

type RetrievedChunk = {
  id: string
  section: string
  content: string
  score: number
}

export type KnowledgeLink = {
  label: string
  url: string
}

const KNOWLEDGE_PATH = path.join(process.cwd(), 'knowledge', 'knowledge.txt')
const MAX_CHUNK_CHARS = 900
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'into',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'with',
  'you',
  'your',
  'me',
  'my',
  'this',
  'those',
  'these',
  'what',
  'which',
  'who',
  'when',
  'where',
  'how',
])

let chunkCache: KnowledgeChunk[] | null = null
let rawKnowledgeCache: string | null = null

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokenize(input: string): Set<string> {
  const normalized = normalizeText(input)
  const tokens = normalized.split(' ').filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  return new Set(tokens)
}

function splitIntoSections(knowledge: string): Array<{ section: string; content: string }> {
  const lines = knowledge.split(/\r?\n/)
  const sections: Array<{ section: string; content: string }> = []

  let currentSection = 'Portfolio Knowledge Base'
  let currentLines: string[] = []

  const flushSection = () => {
    const content = currentLines.join('\n').trim()
    if (content) {
      sections.push({ section: currentSection, content })
    }
  }

  for (const line of lines) {
    const headingMatch = line.match(/^##+\s+(.*)$/)
    if (headingMatch) {
      flushSection()
      currentSection = headingMatch[1].trim()
      currentLines = []
      continue
    }

    currentLines.push(line)
  }

  flushSection()
  return sections
}

function chunkSection(section: string, content: string): KnowledgeChunk[] {
  const paragraphs = content
    .split(/\n\s*\n/g)
    .map((value) => value.trim())
    .filter(Boolean)

  const chunks: KnowledgeChunk[] = []
  let buffer = ''

  const pushBuffer = () => {
    const trimmed = buffer.trim()
    if (!trimmed) {
      return
    }

    chunks.push({
      id: '',
      section,
      content: trimmed,
      normalizedContent: normalizeText(trimmed),
      tokens: tokenize(trimmed),
      sectionTokens: tokenize(section),
    })

    buffer = ''
  }

  for (const paragraph of paragraphs) {
    if (!buffer) {
      buffer = paragraph
      continue
    }

    if ((buffer.length + 2 + paragraph.length) > MAX_CHUNK_CHARS) {
      pushBuffer()
      buffer = paragraph
      continue
    }

    buffer += `\n\n${paragraph}`
  }

  pushBuffer()

  return chunks
}

async function readChunks(): Promise<KnowledgeChunk[]> {
  if (chunkCache) {
    return chunkCache
  }

  const raw = await readKnowledgeRaw()
  const sections = splitIntoSections(raw)

  const allChunks: KnowledgeChunk[] = []
  for (const section of sections) {
    allChunks.push(...chunkSection(section.section, section.content))
  }

  chunkCache = allChunks.map((chunk, index) => ({
    ...chunk,
    id: `K${index + 1}`,
  }))

  return chunkCache
}

async function readKnowledgeRaw(): Promise<string> {
  if (rawKnowledgeCache !== null) {
    return rawKnowledgeCache
  }

  rawKnowledgeCache = await fs.readFile(KNOWLEDGE_PATH, 'utf8')
  return rawKnowledgeCache
}

function toNormalizedUrl(label: string, value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const normalizedLabel = label.toLowerCase()
  if (normalizedLabel === 'portfolio') {
    return `https://${trimmed}`
  }

  if (normalizedLabel === 'linkedin') {
    return `https://www.linkedin.com/in/${trimmed}`
  }

  if (normalizedLabel === 'github') {
    return `https://github.com/${trimmed}`
  }

  if (normalizedLabel === 'leetcode') {
    return `https://leetcode.com/${trimmed}`
  }

  if (normalizedLabel === 'geeksforgeeks') {
    return `https://www.geeksforgeeks.org/${trimmed}`
  }

  if (normalizedLabel === 'instagram') {
    return `https://www.instagram.com/${trimmed}`
  }

  return null
}

export async function getKnowledgeProfessionalLinks(): Promise<KnowledgeLink[]> {
  const raw = await readKnowledgeRaw()
  const lines = raw.split(/\r?\n/)
  const links: KnowledgeLink[] = []

  let inProfessionalLinksSection = false

  for (const line of lines) {
    const headingMatch = line.match(/^##+\s+(.*)$/)
    if (headingMatch) {
      inProfessionalLinksSection = headingMatch[1].trim().toLowerCase() === 'professional links'
      continue
    }

    if (!inProfessionalLinksSection) {
      continue
    }

    const pairMatch = line.match(/^([A-Za-z][A-Za-z\s]+):\s*(.+)$/)
    if (!pairMatch) {
      continue
    }

    const label = pairMatch[1].trim()
    const value = pairMatch[2].trim()
    const url = toNormalizedUrl(label, value)
    if (!url) {
      continue
    }

    links.push({ label, url })
  }

  return links
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let overlap = 0
  for (const token of a) {
    if (b.has(token)) {
      overlap += 1
    }
  }

  return overlap
}

function scoreChunk(chunk: KnowledgeChunk, query: string, queryTokens: Set<string>): number {
  let score = 0

  const literalBoost = normalizeText(query)
  if (literalBoost && chunk.normalizedContent.includes(literalBoost)) {
    score += 8
  }

  score += overlapScore(chunk.tokens, queryTokens) * 2
  score += overlapScore(chunk.sectionTokens, queryTokens) * 3

  return score
}

export async function retrieveKnowledge(messages: ChatMessage[]): Promise<RetrievedChunk[]> {
  const chunks = await readChunks()
  const recentUserMessages = messages
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => message.content.trim())
    .filter(Boolean)

  const query = recentUserMessages.join(' ')
  const queryTokens = tokenize(query)

  if (!query || queryTokens.size === 0) {
    return []
  }

  const scored = chunks
    .map((chunk) => ({
      id: chunk.id,
      section: chunk.section,
      content: chunk.content,
      score: scoreChunk(chunk, query, queryTokens),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 6)
}

export function buildContextBlock(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return 'No relevant context was retrieved from portfolio knowledge.'
  }

  return chunks
    .map((chunk) => `[${chunk.id}] Section: ${chunk.section}\n${chunk.content}`)
    .join('\n\n---\n\n')
}

export function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return []
  }

  const sanitized = input
    .filter((entry) => {
      return (
        typeof entry === 'object' &&
        entry !== null &&
        'role' in entry &&
        'content' in entry &&
        (entry as { role?: string }).role !== undefined &&
        (entry as { content?: string }).content !== undefined
      )
    })
    .map((entry) => {
      const role: ChatRole = (entry as { role: string }).role === 'assistant' ? 'assistant' : 'user'
      const content = String((entry as { content: string }).content).trim().slice(0, 1600)
      return { role, content }
    })
    .filter((message) => message.content.length > 0)

  return sanitized.slice(-16)
}

export function extractCitedSourceIds(answer: string, allowedSourceIds: Set<string>): string[] {
  const matches = answer.match(/\[K\d+\]/g)
  if (!matches) {
    return []
  }

  const deduped = Array.from(new Set(matches))
  return deduped.filter((id) => allowedSourceIds.has(id.replace('[', '').replace(']', '')))
}

export function getKnowledgePath(): string {
  return KNOWLEDGE_PATH
}
