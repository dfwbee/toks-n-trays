# Toks 'N' Trays — Website (Phase 1: Home · Phase 2: Menu)

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production
```bash
npm run build
```
Output goes to `dist/`.

## Project structure
```
src/
  components/    -> one file per UI piece (Navbar, Hero, MenuCard, etc.)
  pages/         -> HomePage.jsx, MenuPage.jsx (one per route)
  layouts/       -> Layout.jsx (Navbar + Footer wrap every page)
  context/       -> UIContext.jsx (shared toast/notify state)
  data/          -> menuData.js holds the FULL pizza/soup/stew catalog + prices
  App.jsx        -> React Router setup (routes: "/" and "/menu")
  App.css        -> all styling (design tokens as CSS variables at top)
  main.jsx       -> React entry point
```

## Routes
- `/` — Home page
- `/menu` — Full menu: search bar + category tabs (Pizza / Soup Bowls / Stew
  Collection), all 28 items from your price lists. Tap a card to expand and
  see every size/price.

## Notes
- Cart/Account buttons and "Add" on menu items currently show a "coming in
  next phase" toast — real cart logic, product detail modal, checkout, and
  Paystack integration land in later build phases.
- Food images are pulled live from Unsplash by URL; each has a graceful
  fallback (soft gradient) if an image fails to load.
- Colors, fonts, and spacing are defined as CSS variables at the top of
  App.css — change them there to restyle the whole site at once.
