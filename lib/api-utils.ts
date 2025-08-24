export function parseMessageContent(content: string): string {
  // Clean up the content - remove any markdown formatting for display
  return content
    .replace(/^You are a precise assistant\.\s*/, '') // Remove system prompt
    .replace(/Today's date is:.*?\n/, '') // Remove date info
    .replace(/The current time is:.*?\n/, '') // Remove time info
    .replace(/Answer the following question.*?\n/, '') // Remove instruction text
    .replace(/User Question:\n/, '') // Remove question label
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateSessionTitle(content: string): string {
  const cleanContent = parseMessageContent(content)
  return truncateText(cleanContent, 50)
}
