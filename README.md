# UdyamSakhi

UdyamSakhi is a comprehensive platform designed to empower women entrepreneurs in India through AI-powered business planning, financial guidance, and skill development.

## Features

- AI-powered business plan generation
- Financial empowerment suite
- Legal & compliance assistance
- Market access tools
- Skilling & mentorship hub

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB
- NextAuth.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (platform)/        # Protected platform routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and configurations
├── models/               # MongoDB models
└── types/                # TypeScript types
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.
