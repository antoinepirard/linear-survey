# Linear Survey

An open-source, minimalistic survey builder that integrates with Linear. Create surveys, collect responses, and push them directly to Linear as issues.

## Features

- **Survey Builder** — Create surveys with multiple question types
- **Question Types** — Short text, long text, single choice, multiple choice, rating (1-5), email
- **Public Survey Links** — Share surveys via a clean, accessible URL
- **Responses Dashboard** — View all responses in a table format
- **Linear Integration** — Push responses to Linear as issues with one click
- **CSV Export** — Export responses for further analysis

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/antoinepirard/linear-survey.git
cd linear-survey
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL from `schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key from Settings > API

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the App

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001)

## Usage

### Creating a Survey

1. Click "New Survey" on the home page
2. Add a title and description
3. Add questions using the "+ Add Question" buttons
4. Configure each question (title, description, required, etc.)
5. Save your survey

### Configuring Linear Integration

1. In the survey builder, click "Linear" in the header
2. Enter your Linear API key (get it from [Linear Settings > API](https://linear.app/settings/api))
3. Select your team and optionally a project
4. Set a title template for issues

### Collecting Responses

Share your survey using the public link: `/s/[survey-id]`

### Pushing to Linear

1. Go to the Responses dashboard
2. Select responses you want to push
3. Click "Push to Linear" or push individually

## Tech Stack

- [Next.js 15](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Database
- [Linear API](https://linear.app/docs/graphql) — Issue tracking integration

## Database Schema

See `schema.sql` for the complete database schema.

## License

MIT

