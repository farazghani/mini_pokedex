# Mini Pokedex

Mini Pokedex is an Angular app for browsing Pokémon and managing teams in a separate section of the app.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock server

The Teams feature uses the local JSON GraphQL server backed by `db.js`.

```bash
npm run mock:graphql
```

The mock server runs on `http://127.0.0.1:4000`.

### 3. Start the Angular app

```bash
npm start
```

Open `http://localhost:4200` in your browser.

## Architecture

- `src/app/pokedex` contains the Pokémon browsing flow, including search, filters, table, and detail drawer.
- `src/app/teams` contains the team list, team builder, store, selectors, and validator logic.
- `src/app/common` contains shared UI components such as async loading/error state.
- `src/app/core` contains the Apollo client setup and GraphQL routing configuration.
- Pokémon data comes from the public PokeAPI GraphQL endpoint.
- Team data comes from the local `json-graphql-server` instance on `127.0.0.1:4000`.

The app uses a shared shell in `src/app/app.html` and `src/app/app.scss` for the red and yellow Pokémon-themed navbar and footer.

## Scripts

- `npm start` - run the Angular dev server
- `npm run build` - build the app for production
- `npm run watch` - build in watch mode
- `npm test` - run the unit tests
- `npm run mock:graphql` - start the mock GraphQL server on port `4000`

## What I Would Improve With More Time

- Add more focused unit tests around edge cases in the Pokémon and team stores.
- Add end-to-end coverage for creating, deleting, and selecting teams.
- Improve empty-state and error-state UX for slower network conditions.
- Add local image fallbacks and caching for more resilient sprite loading.
- Replace the current mock dataset with seeded fixtures and a reset flow for safer manual testing.
