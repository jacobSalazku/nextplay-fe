# 🏀 NextPlay Frontend 

**NextPlay** is an all-in-one platform designed for basketball coaches and youth players to manage training sessions, track performance, and gain valuable game insights. Developed as a graduation project, it aims to simplify team management while helping young athletes improve their skills.

NextPlay enables players to monitor their personal progress, while giving coaches the tools to schedule training sessions, track player statistics, organize team communication, and share tactical plays—all in one place.


## 🚀 Features

- 📊 Individual player statistics (points, assists, rebounds, steals, blocks, etc.)
- 🧠 Performance insights highlighting each player's strengths and areas for improvement
- 🏋️ Training management with attendance tracking
- 🔄 Visual playbook for sharing plays and team strategies
- 👥 Team and player management


## 🛠 Tech Stack

- **Next.js** – React framework for the frontend
- **GraphQL** – API for efficient data fetching
- **Tailwind CSS** – Utility-first CSS framework
- **NextAuth.js** – Authentication
- **TypeScript** – End-to-end type safety


## Testing

**Stack:** Vitest + `@testing-library/react` + `user-event` + `jest-dom`
(`jsdom` env), with **MSW** faking the GraphQL backend at the `fetch` layer.
Specs are `*.test.ts(x)` next to the source.

```bash
pnpm test          # run once
pnpm test:watch    # watch mode
```

### Every test is AAA — Arrange, Act, Assert

Three blocks, a blank line between each.

```tsx
it('shows a success toast after creating a gameplan', async () => {
  // Arrange — render with only what this test needs
  server.use(mockCreateGamePlan({ ok: true }));
  render(<GamePlanForm {...props} />);

  // Act — do what a user would do
  await user.type(screen.getByLabelText(/name/i), 'Zone attack');
  await user.click(screen.getByRole('button', { name: /save/i }));

  // Assert — one visible outcome
  expect(await screen.findByText(/successfully created/i)).toBeVisible();
});
```

### Rules

- **Test behaviour, not implementation** — query by role/label/text and assert
  what the user sees, never component internals or state.
- **Name tests as sentences**: `it('disables submit while saving')`.
- **One reason to fail per test.**
- **Isolated** — reset MSW handlers and the query client between tests.
- **Factories over fixtures** — `makeGamePlan({ opponent: 'Hawks' })`.
- Use `user-event`, not `fireEvent`; `findBy*` for anything async;
  `getByRole` over `getByTestId`.
- **Don't test** types (tsc covers them), framework internals, or third-party libs.
- **Don't unit-test async Server Components** — extract their logic into plain
  functions and test those; cover full pages with a Playwright e2e later.
- **Coverage is a diagnostic, not a target.** Priority: `gqlRequest` error
  handling → hooks → interactive components → critical flows.

