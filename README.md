## Restaurant App (Next.js)

A demo food ordering UI built with Next.js App Router that consumes the Foody API. It showcases restaurant discovery, recommended lists, detail pages, cart/checkout flows, profile orders, and reviews.

### Features

- Home: Hero, category shortcuts, Recommended list (uses sample menu images when available)
- Category: Filters (distance, price, rating), restaurant cards with place · distance, thumbnails prefer first menu image
- Detail: Restaurant info, gallery, menu tabs (All/Food/Drink), add-to-cart, reviews with pagination
- Auth examples (login/register), profile orders, and review submission with redirect back to restaurant detail

### Tech Stack

- Next.js 15 (App Router)
- TypeScript, Tailwind CSS
- Axios for API calls, Redux for cart state

### Getting Started

1. Install dependencies

```
npm install
```

2. Environment variables
   Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_BASE_URL="https://foody-api-xi.vercel.app"
# Optional public API token used when user token is not present
NEXT_PUBLIC_API_TOKEN="<your-public-api-token>"
```

Notes:

- The app will prefer a user token from `localStorage` if present. When absent, it uses `NEXT_PUBLIC_API_TOKEN` as a fallback to avoid 401s.
- If you want to test protected endpoints (e.g., recommended with auth), ensure a valid bearer token is stored under `localStorage.token` after login.

3. Image configuration
   This project allows remote images from `foodish-api.com`. If your API returns images from other domains, add them to `next.config.ts` → `images.domains` or `remotePatterns`.

4. Run the dev server

```
npm run dev
```

Open the app at `http://localhost:3000`.

### Key UX Details

- Place · distance: On Home Recommended and Category cards, place and distance are shown in one line (smaller font). When the API does not provide `distance`, a small simulated value (1–5 km) is used.
- Recommended card image: Prefers `sampleMenus[].image`; falls back to `images[0]` or logo.
- Category card image: Background fetch grabs the first menu image per restaurant from the detail endpoint (`limitMenu=10`). If found, it is used as the thumbnail. Otherwise, falls back to `images[0]` or logo.
- Detail page: Gallery uses `detail.images`; each menu card uses its own `menu.image`.
- Image fallback: A custom `ImageWithFallback` component replaces any failing image with a local placeholder to avoid broken thumbnails.
- Reviews: After pressing Send on the review page, the app redirects to the restaurant’s detail page.

### Scripts

```
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
```

### Project Structure (selected)

```
src/
  app/
    home/page.tsx            # Home + Recommended
    category/page.tsx        # Restaurant listing + filters
    detail/page.tsx          # Restaurant details, gallery, menus, reviews
    review/page.tsx          # Give Review screen (redirects to detail on success)
  components/
    ui/ImageWithFallback.tsx # Image component with onError fallback
  lib/
    axios.ts                 # Axios client with token fallback and 401 handling
    imageUtils.ts            # Image helpers (prefer menu images where possible)
    env.ts, config.ts        # API base URL and endpoints
  services/                  # API services (restaurant, review, cart, etc.)
```

### API Endpoints (Foody API)

- List restaurants: `GET /api/resto?page=1&limit=20`
- Recommended: `GET /api/resto/recommended` (may require bearer)
- Detail: `GET /api/resto/:id?limitMenu=10&limitReview=6`

Example curl:

```
curl -X GET "https://foody-api-xi.vercel.app/api/resto?page=1&limit=20" -H "accept: application/json"
curl -X GET "https://foody-api-xi.vercel.app/api/resto/recommended" -H "accept: application/json" -H "Authorization: Bearer <TOKEN>"
```

### Troubleshooting

- 401 Unauthorized in console
  - Ensure a valid user token exists in `localStorage.token` OR set `NEXT_PUBLIC_API_TOKEN` in `.env.local`. The Axios client uses the fallback token when no user token is found and clears bad user tokens on 401.
- Images 404 or incorrect
  - Confirm `foodish-api.com` is allowed in `next.config.ts`. If using other domains, add them.
  - Category thumbnails fetch the first menu image from the detail endpoint; if your API does not return menu images, only `images[0]`/logo will be used.
- Review submit does not redirect
  - The review page expects `transactionId` and `restaurantId` in the query. On success it will `router.push(/detail?id=...)`.

### License

MIT

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
