# Linear Survey

An open-source, minimalistic survey builder that integrates with Linear. Create surveys, collect responses, and push them directly to Linear as issues.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/antoinepirard/linear-survey&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20for%20database%20storage&envLink=https://supabase.com/dashboard/project/_/settings/api)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/antoinepirard/linear-survey)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?referralCode=antoinepirard&template=https://github.com/antoinepirard/linear-survey)

## Features

- **Survey Builder** — Create surveys with multiple question types
- **Question Types** — Short text, long text, single choice, multiple choice, rating (1-5), email
- **Public Survey Links** — Share surveys via a clean, accessible URL
- **Responses Dashboard** — View all responses in a table format
- **Linear Integration** — Push responses to Linear as issues with one click
- **CSV Export** — Export responses for further analysis

## Deploy Your Own

### Option 1: One-Click Deploy

Click one of the deploy buttons above. You'll need:

1. A [Supabase](https://supabase.com) project (free tier works)
2. Run the SQL from `schema.sql` in your Supabase SQL editor
3. Add your Supabase URL and anon key when prompted

### Option 2: Docker

```bash
# Build the image
docker build -t linear-survey \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  .

# Run the container
docker run -p 3000:3000 linear-survey
```

Or use Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  linear-survey:
    build:
      context: .
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
# Create .env file with your credentials, then:
docker-compose up -d
```

### Option 3: Manual Setup

#### 1. Clone and Install

```bash
git clone https://github.com/antoinepirard/linear-survey.git
cd linear-survey
pnpm install
```

#### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL from `schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key from Settings > API

#### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Run the App

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

## Local Development (No Database)

The app includes a localStorage fallback for quick testing without Supabase. Just run `pnpm dev` without setting environment variables.

## License

MIT
