import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { parseMessageContent } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const client = await pool.connect()
    
    try {
      // Get all messages for the specific session
      const query = `
        SELECT id, session_id, message
        FROM n8n_chat_histories 
        WHERE session_id = $1 
        ORDER BY id ASC
      `
      
      const result = await client.query(query, [sessionId])
      
      // Transform the data to match frontend format
      const messages = result.rows.map((row) => {
        const messageData = typeof row.message === 'string' 
          ? JSON.parse(row.message)
          : row.message
        
        return {
          id: row.id.toString(),
          content: parseMessageContent(messageData.content),
          role: messageData.type === 'human' ? 'user' : 'assistant',
          timestamp: new Date(), // We'll need to add timestamp column to DB later
          sessionId: row.session_id
        }
      })
      
      return NextResponse.json(messages)
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session messages' },
      { status: 500 }
    )
  }
}
