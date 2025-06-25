# Server

A simple Node.js Express server with TypeScript support.

## Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the server in development mode:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/test` - Test API endpoint

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (defualt: development)
