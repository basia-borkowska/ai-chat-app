This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About App

This application is an AI Assistant Chat.

To access the app you need to log in with mocked account:

- email: test@example.com
- password: password123

Features:

1. Chat

- User can write messages
- User can use voice recording to dictate messages
- User can upload different files and send them to the chat
- Chat history is stored in session

2. Profile

- User can display account details
- User can edit all details (stored in local storage)

### Env keys

For chat feature to work, project needs local .env file with GOOGLE_API_KEY

It can be generated on https://aistudio.google.com/
