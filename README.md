# Athena - Your Personal AI Assistant

A futuristic AI assistant frontend built with Next.js 14, Tailwind CSS, and ShadCN UI. Athena connects to your n8n backend via webhook for seamless AI interactions.

![Athena AI Assistant](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🤖 AI Chat Interface**: ChatGPT-style UI with real-time messaging
- **🎤 Voice Input**: Record and send voice messages using Web Audio API
- **📱 Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **🌙 Dark Theme**: Futuristic dark theme with neon accents
- **📝 Markdown Support**: Rich text rendering for AI responses
- **🔄 Session Management**: Persistent chat sessions with history
- **⚡ Real-time**: Smooth animations and instant feedback
- **🔐 Authentication**: Simple login system with token-based auth

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- n8n backend with webhook endpoint

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd athena-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### n8n Webhook Setup

The app is configured to send requests to:
```
https://n8n.showcasehq.xyz/webhook/eca1a5a6-e16c-467c-88d8-1580c13db783
```

**Text Message Format:**
```json
{
  "type": "text",
  "data": "user message",
  "session_id": "unique-session-id"
}
```

**Voice Message Format:**
```
Multipart form-data:
- data: audio file (webm format)
- type: "voice"
- session_id: "unique-session-id"
```

**Headers:**
```
Authorization: Basic <your-auth-token>
Content-Type: application/json (for text) / multipart/form-data (for voice)
```

### Authentication

Currently uses a simple token-based system:
- Enter any email and password in the login form
- The password is used as the authorization token
- Tokens are stored in localStorage

## 📁 Project Structure

```
athena-ai-assistant/
├── app/                    # Next.js 14 App Router
│   ├── chat/              # Chat page
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── chat/             # Chat-specific components
│   │   ├── AudioRecorder.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── InputBar.tsx
│   │   ├── MessageBubble.tsx
│   │   └── SidebarHistory.tsx
│   └── ui/               # ShadCN UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── lib/                  # Utility functions
│   ├── api.ts           # API service functions
│   └── utils.ts         # Common utilities
└── public/              # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Neon blue (#00d4ff)
- **Secondary**: Neon purple (#8b5cf6)
- **Accent**: Neon pink (#ec4899)
- **Success**: Neon green (#10b981)
- **Background**: Dark gradient with animated particles

### Components
- **Glass Effect**: Translucent backgrounds with backdrop blur
- **Neon Glow**: Subtle glow effects on interactive elements
- **Gradient Text**: Multi-color text gradients
- **Smooth Animations**: Framer Motion powered transitions

## 🔌 API Integration

### Chat History APIs

**Get All Chat Sessions:**
```typescript
GET /api/chat/history
// Returns list of all chat sessions for sidebar
```

**Get Session Messages:**
```typescript
GET /api/chat/history/[sessionId]
// Returns all messages for a specific session
```

### Text Messages
```typescript
const response = await sendTextMessage(
  "Hello, how are you?",
  "session-123",
  "your-auth-token"
);
```

### Voice Messages
```typescript
const audioBlob = await recordAudio();
const response = await sendVoiceMessage(
  audioBlob,
  "session-123", 
  "your-auth-token"
);
```

### Chat History Functions
```typescript
// Get all chat sessions
const sessions = await getChatHistory();

// Get messages for specific session
const messages = await getSessionMessages("session-id");
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Your app will be available at `https://your-app.vercel.app`

### Environment Variables

Create a `.env.local` file for production:
```env
NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-webhook-url
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Components**: Add to `components/` directory
2. **New Pages**: Add to `app/` directory following Next.js 14 conventions
3. **New API Functions**: Add to `lib/api.ts`
4. **Styling**: Use Tailwind CSS classes and custom CSS variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [n8n](https://n8n.io/) - Workflow automation platform

---

Built with ❤️ for the future of AI interaction
