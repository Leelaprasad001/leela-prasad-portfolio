export const OPEN_ENGINEERING_CHAT_EVENT = 'open-engineering-intelligence-chat'

function isChatbotEnabled(): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  return document.documentElement.dataset.showChatbot === '1'
}

function goToContactSection() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '#contact')
    return
  }

  window.location.hash = '#contact'
}

export function openEngineeringChat() {
  if (typeof window === 'undefined') {
    return
  }

  if (!isChatbotEnabled()) {
    goToContactSection()
    return
  }

  window.dispatchEvent(new CustomEvent(OPEN_ENGINEERING_CHAT_EVENT))
}
