// Environment variables configuration
export const ENV = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://foody-api-xi.vercel.app',
  API_TOKEN:
    process.env.NEXT_PUBLIC_API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3NTgwMzU3ODAsImV4cCI6MTc1ODY0MDU4MH0.txII5Pj41iGdLyygtk-Dm3WVFqc8jSCNXBADbRZtbt0',
} as const;
