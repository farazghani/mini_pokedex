# Mini Pokedex

Mini Pokedex is an Angular app for browsing Pokémon and managing teams in a separate section of the app.

## Submission Checklist

- Clean conventional-commit history using messages such as `fix(pokedex): ...` and `feat(teams): ...`
- README with setup instructions, mock server setup, short architecture note, and a short "what I would improve" section
- Minimum 3 unit tests covering:
  - one store method with optimistic rollback
  - one selector or computed value
  - one form validator
- App runs with `ng serve` and the mock server runs on port `4000`

## Screenshots

Pokédex view:

![Pokédex view](screenshot/Screenshot%202026-08-02%20at%2011.23.44%E2%80%AFPM.png)

Teams view:

![Teams view](screenshot/Screenshot%202026-08-02%20at%2011.23.52%E2%80%AFPM.png)

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

The mock server must run on `http://127.0.0.1:4000`.

### 3. Start the Angular app

```bash
npm start
```

Open `http://localhost:4200` in your browser. If port `4200` is busy, Angular will prompt for another port.

## Architecture

- `src/app/pokedex` contains the Pokémon browsing flow, including search, filters, table, and detail drawer.
- `src/app/teams` contains the team list, team builder, store, selectors, and validator logic.
- `src/app/common` contains shared UI components such as async loading/error state.
- `src/app/core` contains the Apollo client setup and GraphQL routing configuration.
- `src/app/app.html` and `src/app/app.scss` define the shared shell, including the navbar and footer.
- State is handled with custom RxJS stores using `BehaviorSubject`, derived selectors, `signal()`, `computed()`, `effect()`, and `toSignal()`.
- Pokémon data comes from the public PokeAPI GraphQL endpoint.
- Team data comes from the local `json-graphql-server` instance on `127.0.0.1:4000`.

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
- Add deployment instructions for the frontend and mock server separately.
