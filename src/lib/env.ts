// Environment variables configuration
export const ENV = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://foody-api-xi.vercel.app',
  API_TOKEN:
    process.env.NEXT_PUBLIC_API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3NTgxOTkzNTMsImV4cCI6MTc1ODgwNDE1M30.rPdJiLQmz8OxUILa3uuGA7NWIu-52CeDAaArhqx6vJc',
} as const;
