import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { generateSessionTitle, truncateText } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Get all unique sessions with their latest message info
      const query = `
        SELECT 
          session_id,
          MAX(id) as last_message_id,
          COUNT(*) as message_count
        FROM n8n_chat_histories 
        GROUP BY session_id 
        ORDER BY last_message_id DESC
      `
      
      const result = await client.query(query)
      
      // Get the latest message content for each session
      const sessions = await Promise.all(
        result.rows.map(async (row) => {
          const messageQuery = `
            SELECT message 
            FROM n8n_chat_histories 
            WHERE id = $1
          `
          const messageResult = await client.query(messageQuery, [row.last_message_id])
          const messageData = typeof messageResult.rows[0].message === 'string' 
            ? JSON.parse(messageResult.rows[0].message)
            : messageResult.rows[0].message
          
          return {
            id: row.session_id,
            title: generateSessionTitle(messageData.content),
            lastMessage: truncateText(messageData.content, 100),
            timestamp: new Date(), // We'll need to add timestamp column to DB later
            messageCount: parseInt(row.message_count)
          }
        })
      )
      
      return NextResponse.json(sessions)
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}
