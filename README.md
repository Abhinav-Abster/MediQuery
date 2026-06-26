# MediQuery AI

> A polished AI-powered medicine lookup experience for fast, visually rich pharmaceutical insights.

MediQuery AI helps users search any medicine and instantly explore a structured overview of its dosage, side effects, interactions, contraindications, and manufacturing process. The app blends Google Gemini AI with an expressive Next.js interface built for speed, clarity, and a premium feel.

## Highlights

- AI-generated medicine summaries powered by Google Gemini
- Interactive side-effect visualization with Recharts
- Detailed tabs for overview, side effects, manufacturing, and interactions
- Animated, neumorphic UI with dark/light theme support
- Responsive App Router architecture with a dedicated medicine detail page

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- GSAP and @gsap/react
- Recharts
- lucide-react icons
- Google Generative AI SDK

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file in the project root and add your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## How It Works

1. Search for a medicine on the home screen.
2. The app sends the medicine name to `/api/medicine`.
3. Gemini returns a structured JSON response.
4. The detail page renders the medicine profile with charts and tabbed sections.

## Key Routes

- `/` - landing page and medicine search
- `/medicine/[name]` - medicine detail experience
- `/api/medicine` - AI data generation endpoint

## Project Structure

```text
app/
  api/medicine/route.js     # Gemini-powered API route
  medicine/[name]/page.js   # Medicine detail page
  page.js                   # Home search experience
  components/               # Shared UI and motion components
public/                     # Static assets
```

## Notes

- The content is AI-generated for educational purposes only.
- Always consult a qualified healthcare professional for medical advice.
- The app expects `GEMINI_API_KEY` to be available at runtime.

## Deployment

This project is ready to deploy on Vercel or any platform that supports Next.js. Set `GEMINI_API_KEY` in your deployment environment before launching.
