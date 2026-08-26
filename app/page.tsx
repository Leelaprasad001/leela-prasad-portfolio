import App from '@/components/app'

export default function Page() {
  const showChatbot = process.env.SHOW_CHATBOT === '1'

  return <App showChatbot={showChatbot} />
}
