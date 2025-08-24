const WEBHOOK_URL = 'https://n8n.showcasehq.xyz/webhook/eca1a5a6-e16c-467c-88d8-1580c13db783'

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  sessionId: string
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export async function sendTextMessage(
  message: string,
  sessionId: string,
  authToken: string
): Promise<string> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify({
        type: 'text',
        data: message,
        session_id: sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.response || data.message || 'No response received'
  } catch (error) {
    console.error('Error sending text message:', error)
    throw error
  }
}

export async function sendVoiceMessage(
  audioBlob: Blob,
  sessionId: string,
  authToken: string
): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('data', audioBlob, 'audio.webm')
    formData.append('type', 'voice')
    formData.append('session_id', sessionId)

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.response || data.message || 'No response received'
  } catch (error) {
    console.error('Error sending voice message:', error)
    throw error
  }
}

// Real API functions for chat history
export async function getChatHistory(): Promise<ChatSession[]> {
  try {
    const response = await fetch('/api/chat/history')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const sessions = await response.json()
    console.log('API Response - Chat History:', sessions) // Debug log
    return sessions
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return []
  }
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`/api/chat/history/${sessionId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const messages = await response.json()
    console.log('API Response - Session Messages:', messages) // Debug log
    return messages
  } catch (error) {
    console.error('Error fetching session messages:', error)
    return []
  }
}
