# Linear Survey

An open-source, minimalistic survey builder that integrates with Linear. Create surveys, collect responses, and push them directly to Linear as issues.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/antoinepirard/linear-survey&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20for%20database%20storage&envLink=https://supabase.com/dashboard/project/_/settings/api)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/antoinepirard/linear-survey)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?referralCode=antoinepirard&template=https://github.com/antoinepirard/linear-survey)

## Features

- **Survey Builder** — Create surveys with multiple question types
- **Question Types** — Short text, long text, single choice, multiple choice, rating (1-5), email
- **Multi-Step Forms** — Group questions into steps for wizard-style surveys
- **Public Survey Links** — Share surveys via a clean, accessible URL
- **Responses Dashboard** — View all responses in a table format
- **Linear Integration** — Push responses to Linear as issues with one click
- **CSV Export** — Export responses for further analysis
- **Survey Management** — Archive or delete surveys when done
- **Multiple Database Backends** — Supabase, PostgreSQL, SQLite, or localStorage

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

#### 2. Set up Database

Choose one of the supported database backends:

**Supabase (recommended):**
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL from `schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key from Settings > API

**PostgreSQL:**
1. Create a PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. The app will auto-run migrations on first connection

**SQLite:**
1. Set `SQLITE_PATH` to your database file path (e.g., `./data/survey.db`)
2. The app will create the file and run migrations automatically

#### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:

```bash
# For Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OR for PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/linear_survey

# OR for SQLite
SQLITE_PATH=./data/survey.db

# Optional: Explicitly set adapter (auto-detected if not set)
# NEXT_PUBLIC_DATABASE_ADAPTER=supabase|postgres|sqlite|local
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

### Multi-Step Surveys

1. In the builder sidebar, add Steps using the "Add First Step" button
2. Assign questions to steps using the dropdown in each question
3. Questions assigned to steps will appear in wizard format
4. Ungrouped questions appear at the end

### Configuring Linear Integration

1. Go to Settings (gear icon in header)
2. Enter your Linear API key (get it from [Linear Settings > API](https://linear.app/settings/api))
3. In each survey builder, select your team and optionally a project
4. Set a title template for issues

### Managing Surveys

- **Archive**: Move surveys to the "Archived" tab without deleting
- **Restore**: Move archived surveys back to active
- **Delete**: Permanently delete a survey and all its responses

### Collecting Responses

Share your survey using the public link: `/s/[survey-id]`

### Pushing to Linear

1. Go to the Responses dashboard
2. Select responses you want to push
3. Click "Push to Linear" or push individually

## Database Adapters

The app supports multiple database backends through an adapter system:

| Adapter | Best For | Configuration |
|---------|----------|---------------|
| **Supabase** | Production, hosted | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **PostgreSQL** | Self-hosted, existing DB | `DATABASE_URL` |
| **SQLite** | Simple self-hosting | `SQLITE_PATH` |
| **localStorage** | Demo, development | No config needed |

The adapter is auto-detected based on which environment variables are set, or you can explicitly set `NEXT_PUBLIC_DATABASE_ADAPTER`.

## Tech Stack

- [Next.js 15](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Database (default)
- [Linear API](https://linear.app/docs/graphql) — Issue tracking integration

## Database Schema

See `schema.sql` for the complete database schema.

## Local Development (No Database)

The app includes a localStorage fallback for quick testing without a database. Just run `pnpm dev` without setting environment variables.

## License

MIT
