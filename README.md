# RAG Writing Assistant

A powerful writing assistant that uses RAG (Retrieval-Augmented Generation) to help you write in your unique voice.

## Project Structure

```
rag-writing-assistant/
├── docs/                    # Documentation
│   ├── planning/           # Planning documents
│   │   ├── PRD.md         # Product Requirements Document
│   │   ├── marketanalysis.md
│   │   └── implementationplan.md
│   ├── technical/         # Technical documentation
│   │   ├── setupguide    # Development setup guide
│   │   └── todo.md       # Development tasks
│   ├── design/           # Design documentation
│   │   ├── UIdesignsystem
│   │   ├── landingpagedesign.md
│   │   └── userflow.md
│   └── project-management/
│       └── projectstatus.md
├── src/                    # Source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── lib/              # Utility functions
└── public/                # Static assets
```

## Quick Links

- [Project Status](docs/project-management/projectstatus.md)
- [Setup Guide](docs/technical/setupguide)
- [Product Requirements](docs/planning/PRD.md)
- [Implementation Plan](docs/planning/implementationplan.md)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the root directory with the following content:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   JWT_SECRET=your_secret_key
   ```
4. Replace `your_api_key_here` with your actual Anthropic API key (or leave as-is to use mock responses)
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## API Configuration

The application can work in two modes:
- **Mock Mode**: Uses pre-defined responses (default if no API key is provided)
- **API Mode**: Connects to Anthropic's Claude API for enhanced responses

To use API mode, obtain an API key from [Anthropic's website](https://www.anthropic.com/) and add it to your `.env.local` file.

## Contributing

Please read our [Setup Guide](docs/technical/setupguide) for detailed information about contributing to this project.

## License

[MIT](LICENSE)
