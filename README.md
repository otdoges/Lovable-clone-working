# AI HTML Generator - Build something Lovable

A Next.js application inspired by lovable.dev that lets you create beautiful HTML pages and websites by chatting with AI.

## Features

### 🚀 Core Features
- **AI-Powered HTML Generation**: Create complete HTML pages with CSS and JavaScript using natural language prompts
- **Real-time Preview**: Instantly preview your generated HTML in different device sizes (mobile, tablet, desktop)
- **Project Management**: Save, organize, and manage all your generated HTML files
- **Responsive Design**: All components are mobile-friendly and work across all devices

### 🎨 User Interface
- **Modern Design**: Clean, lovable.dev-inspired interface with gradient accents
- **Dark/Light Theme**: Automatic theme switching with manual toggle support
- **Chat Interface**: Intuitive conversation-based HTML generation
- **Code Editor**: View and copy generated HTML code with syntax highlighting
- **Project Gallery**: Organized view of all your created projects

### 🛠 Technical Features
- **Next.js 14**: Latest App Router with TypeScript support
- **Tailwind CSS**: Modern styling with CSS custom properties
- **Groq AI Integration**: Powered by moonshotai/kimi-k2-instruct model
- **Local Storage**: Persistent project storage
- **Toast Notifications**: User-friendly feedback system
- **Responsive Layout**: Works perfectly on all screen sizes

## Getting Started

### Prerequisites
- Node.js 18+ 
- A Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Creating Your First Project

1. **Start a Conversation**: Click in the chat input or use one of the example prompts
2. **Describe Your Vision**: Be specific about what you want - mention layout, colors, functionality
3. **Preview Instantly**: Your HTML will be generated and previewed in real-time
4. **Download or Save**: Save to your project library or download the HTML file

### Example Prompts

- "Create a modern landing page for a tech startup with a hero section, features, and contact form"
- "Build a dark-themed portfolio website with a project gallery and about section"
- "Design a dashboard with charts, statistics cards, and a sidebar navigation"
- "Make a blog layout with a header, article content, and sidebar widgets"

### Managing Projects

- **View All Projects**: Click "Projects" in the header to see your project gallery
- **Search and Filter**: Find projects by name or content
- **Bulk Operations**: Select multiple projects for batch download or deletion
- **Project Details**: View creation date, file size, and preview thumbnails

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/generate/      # AI generation API endpoint
│   ├── projects/          # Projects management page
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main application page
├── components/
│   ├── chat/              # Chat interface components
│   ├── layout/            # Header, sidebar components
│   ├── preview/           # HTML preview system
│   └── ui/                # Reusable UI components
├── lib/
│   ├── ai-integration.ts  # Groq AI service integration
│   ├── chat-service.ts    # Frontend API client
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## API Integration

The application uses the Groq AI platform with the `moonshotai/kimi-k2-instruct` model for HTML generation. The AI is prompted to:

1. Generate creative, descriptive filenames
2. Create complete HTML5 documents with embedded CSS and JavaScript
3. Ensure mobile-responsive design
4. Include modern styling and functionality

## Customization

### Themes
The application supports automatic dark/light theme switching. You can customize the color scheme by modifying the CSS custom properties in `src/app/globals.css`.

### AI Model
To use a different AI model, update the model name in `src/lib/ai-integration.ts`:

```typescript
model: "your-preferred-model-name"
```

### Styling
The design system is built with Tailwind CSS and CSS custom properties. Modify `src/app/globals.css` to customize the look and feel.

## Performance

- **Optimized Bundle**: Tree-shaking and code splitting for minimal bundle size
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components and routes are loaded on demand
- **Caching**: Browser caching for generated HTML previews

## Security

- **Sandboxed Previews**: HTML previews run in sandboxed iframes
- **Input Validation**: All user inputs are validated and sanitized
- **Environment Variables**: Sensitive API keys are stored securely

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by [lovable.dev](https://lovable.dev) for the user experience design
- Powered by [Groq](https://groq.com) for AI capabilities
- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)

---

**Build something Lovable!** ✨
