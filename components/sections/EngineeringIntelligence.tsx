'use client'

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Loader2, MessageCircle, RefreshCcw, Send, Trash2, X } from 'lucide-react'
import { OPEN_ENGINEERING_CHAT_EVENT } from '@/lib/chat-events'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: Role
  content: string
}

type ApiMessage = {
  role: Role
  content: string
}

const INPUT_MAX_CHARS = 800
const SUGGESTED_QUESTIONS = [
  'What is Leela Prasad currently building at Recordent?',
  'Which technologies are used in the Credit Risk Service?',
  'Summarize the Recordent AI Chatbot responsibilities.',
  'What are the key outcomes of CropQ?',
  'What did Leela deliver during the IIPE internship?',
]

const INITIAL_MESSAGE: ChatMessage = {
  id: 'intro-assistant',
  role: 'assistant',
  content:
    'Hi, I am AI Assistant. I can answer professional questions about Leela Prasad Bantu using the portfolio knowledge base.',
}

function toApiMessages(messages: ChatMessage[]): ApiMessage[] {
  return messages.map((message) => ({ role: message.role, content: message.content }))
}

function createMessage(role: Role, content: string): ChatMessage {
  const randomId = Math.random().toString(36).slice(2)
  return {
    id: `${Date.now()}-${randomId}`,
    role,
    content,
  }
}

function renderMessageWithBold(content: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const [fullMatch, boldText] = match
    const startIndex = match.index

    if (startIndex > lastIndex) {
      nodes.push(content.slice(lastIndex, startIndex))
    }

    nodes.push(
      <strong key={`${keyPrefix}-bold-${startIndex}`}>
        {boldText}
      </strong>,
    )

    lastIndex = startIndex + fullMatch.length
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [content]
}

function addLinksFromText(input: string, prefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const pieces = input.split(urlRegex)

  pieces.forEach((piece, index) => {
    if (!piece) {
      return
    }

    if (/^https?:\/\//.test(piece)) {
      nodes.push(
        <a key={`${prefix}-url-${index}`} href={piece} target="_blank" rel="noreferrer">
          {piece}
        </a>,
      )
      return
    }

    nodes.push(piece)
  })

  return nodes
}

function renderMessageContent(content: string): ReactNode {
  const nodes: ReactNode[] = []
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g

  let lastIndex = 0
  let markdownMatch: RegExpExecArray | null

  while ((markdownMatch = markdownLinkRegex.exec(content)) !== null) {
    const [fullMatch, label, href] = markdownMatch
    const startIndex = markdownMatch.index

    if (startIndex > lastIndex) {
      const segment = content.slice(lastIndex, startIndex)
      const boldNodes = renderMessageWithBold(segment, `segment-${startIndex}`)

      boldNodes.forEach((node, nodeIndex) => {
        if (typeof node === 'string') {
          nodes.push(...addLinksFromText(node, `segment-${startIndex}-${nodeIndex}`))
          return
        }

        nodes.push(node)
      })
    }

    nodes.push(
      <a key={`md-link-${startIndex}`} href={href} target="_blank" rel="noreferrer">
        {label}
      </a>,
    )

    lastIndex = startIndex + fullMatch.length
  }

  if (lastIndex < content.length) {
    const trailing = content.slice(lastIndex)
    const boldNodes = renderMessageWithBold(trailing, 'tail')

    boldNodes.forEach((node, nodeIndex) => {
      if (typeof node === 'string') {
        nodes.push(...addLinksFromText(node, `tail-${nodeIndex}`))
        return
      }

      nodes.push(node)
    })
  }

  return nodes
}

export function EngineeringIntelligence() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryPayload, setRetryPayload] = useState<ApiMessage[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const endRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading, error])

  useEffect(() => {
    const openFromCta = () => {
      setIsOpen(true)
      window.setTimeout(() => {
        inputRef.current?.focus()
      }, 120)
    }

    window.addEventListener(OPEN_ENGINEERING_CHAT_EVENT, openFromCta)

    return () => {
      window.removeEventListener(OPEN_ENGINEERING_CHAT_EVENT, openFromCta)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onDocumentPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) {
        return
      }

      if (panelRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    document.addEventListener('mousedown', onDocumentPointerDown)
    return () => {
      document.removeEventListener('mousedown', onDocumentPointerDown)
    }
  }, [isOpen])

  const canSend = useMemo(() => {
    return !isLoading && input.trim().length > 0 && input.trim().length <= INPUT_MAX_CHARS
  }, [input, isLoading])

  const sendConversation = async (conversation: ChatMessage[]) => {
    setIsLoading(true)
    setError(null)

    const payloadMessages = toApiMessages(conversation)
    setRetryPayload(payloadMessages)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      })

      const payload = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error || 'Something went wrong while generating a response.')
      }

      setMessages((previous) => [...previous, createMessage('assistant', payload.answer as string)])
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to send message.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const submitFromInput = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || trimmed.length > INPUT_MAX_CHARS) {
      return
    }

    const userMessage = createMessage('user', trimmed)
    const nextConversation = [...messages, userMessage]
    setMessages(nextConversation)
    setInput('')
    await sendConversation(nextConversation)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please enter a question.')
      return
    }

    if (trimmed.length > INPUT_MAX_CHARS) {
      setError(`Please keep your question under ${INPUT_MAX_CHARS} characters.`)
      return
    }

    const userMessage = createMessage('user', trimmed)
    const nextConversation = [...messages, userMessage]
    setMessages(nextConversation)
    setInput('')
    await sendConversation(nextConversation)
  }

  const askSuggestedQuestion = async (question: string) => {
    if (isLoading) {
      return
    }

    const userMessage = createMessage('user', question)
    const nextConversation = [...messages, userMessage]
    setMessages(nextConversation)
    setInput('')
    await sendConversation(nextConversation)
  }

  const handleRetry = async () => {
    if (!retryPayload || isLoading) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: retryPayload }),
      })

      const payload = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error || 'Retry failed.')
      }

      setMessages((previous) => [...previous, createMessage('assistant', payload.answer as string)])
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Retry failed.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    if (isLoading) {
      return
    }

    setMessages([INITIAL_MESSAGE])
    setInput('')
    setError(null)
    setRetryPayload(null)
  }

  const openChat = () => {
    setIsOpen(true)
    window.setTimeout(() => {
      inputRef.current?.focus()
    }, 120)
  }

  return (
    <div className="chatbot-dock" aria-live="polite">
      {isOpen && (
        <section ref={panelRef} className="chatbot-panel" role="dialog" aria-label="AI Assistant chat" aria-modal="false">
          <header className="chatbot-panel-head">
            <div className="chatbot-panel-title-wrap">
              <span className="chatbot-panel-icon">
                <Bot size={14} />
              </span>
              <div>
                <h2>AI Assistant</h2>
                <p>Grounded answers from portfolio knowledge</p>
              </div>
            </div>
            <div className="chatbot-panel-actions">
              <button className="chatbot-clear" type="button" onClick={clearChat} disabled={isLoading}>
                <Trash2 size={14} />
              </button>
              <button className="chatbot-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                <X size={16} />
              </button>
            </div>
          </header>

          <div className="chatbot-suggestions" aria-label="Suggested questions">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button key={question} type="button" onClick={() => void askSuggestedQuestion(question)} disabled={isLoading}>
                {question}
              </button>
            ))}
          </div>

          <div className="chatbot-thread">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chatbot-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
                aria-live={message.role === 'assistant' ? 'polite' : undefined}
              >
                <span className="chatbot-role">{message.role === 'assistant' ? 'AI Assistant' : 'You'}</span>
                <p>{renderMessageContent(message.content)}</p>
              </article>
            ))}

            {isLoading && (
              <div className="chatbot-thinking-inline" aria-live="polite">
                <Loader2 size={14} className="spinner" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {error && (
            <div className="chatbot-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => void handleRetry()} disabled={isLoading || !retryPayload}>
                <RefreshCcw size={14} /> Retry
              </button>
            </div>
          )}

          <form className="chatbot-form" onSubmit={(event) => void handleSubmit(event)}>
            <label htmlFor="engineering-intelligence-input" className="sr-only">
              Ask a question
            </label>
            <textarea
              ref={inputRef}
              id="engineering-intelligence-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void submitFromInput()
                }
              }}
              placeholder="Ask about experience, projects, skills, or dates..."
              rows={3}
              maxLength={INPUT_MAX_CHARS}
              disabled={isLoading}
            />
            <div className="chatbot-form-row">
              <span>{input.trim().length}/{INPUT_MAX_CHARS}</span>
              <button type="submit" disabled={!canSend}>
                <Send size={14} /> Send
              </button>
            </div>
          </form>
        </section>
      )}

      {!isOpen && (
        <button className="chatbot-fab" type="button" onClick={openChat} aria-label="Open AI Assistant chatbot">
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  )
}
