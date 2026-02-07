# Multi-Step Form

A responsive, accessible multi-step form built with vanilla HTML, CSS, and JavaScript.

This project focuses on building a realistic user onboarding flow while handling state, validation, accessibility, and edge cases.

## 🎯 Why This Project Exists

Many web apps require users to fill complex forms.
Instead of collecting everything at once, this project breaks the process into clear steps to improve usability and reduce friction.

The goal was not just to build a form UI, but to understand how multi-step flows behave in real applications:
navigation, validation, state updates, and summary rendering.

## 🚀 Live Demo

🔗 https://mhosseldin.github.io/multi-step-form/

> The live demo reflects the full multi-step flow, including validation, dynamic pricing, and summary updates.

## 🛠️ Tech Stack

- **HTML** – semantic structure and accessibility
- **CSS** – responsive layout and UI styling
- **Vanilla JavaScript** – state management, validation, and UI logic

No frameworks were used on purpose, to focus on core browser APIs and problem-solving.

## ✨ Key Features

- Step-by-step navigation with clear progress indication
- Validation per step (personal info, plan selection)
- Monthly / yearly billing toggle with dynamic pricing
- Optional add-ons reflected in the summary
- Editable summary with a “Change” shortcut
- Keyboard and screen-reader friendly navigation
- Client-side persistence using `localStorage`

## 📊 Performance & Accessibility

The project was audited using Lighthouse on both desktop and mobile.
Since this is a single-page, multi-step form, the audit focuses on the
initial entry point (Step 1), which represents the main page load.

Lighthouse scores:

- Performance: 100
- Accessibility: 96
- Best Practices: 100
- SEO: 90

Additional accessibility testing was done manually across all steps,
including keyboard navigation, focus management, and ARIA attributes.

## 🏗️ Architecture & Decisions

- A single `formState` object is used as the source of truth for all steps.
- Navigation updates the state first, then re-renders the UI.
- Event delegation is used instead of multiple listeners.
- UI updates are split into small helper functions for clarity.
- Summary rendering was designed to be resilient to missing DOM elements.

This approach keeps the code predictable and easier to debug as the form grows.

## 🧠 Challenges & Learnings

Some real issues showed up during development:

- Handling 1-based steps vs 0-based array indices caused early bugs.
- Managing `aria-current` correctly when the sidebar steps didn’t match all form steps.
- Fixing a billing toggle bug where prices didn’t update due to missing change listeners.
- Debugging a tricky summary bug caused by DOM elements not always being available when navigating between steps.

The final solution used partial rendering to update only the available summary sections instead of failing the entire render.

## ⚠️ Limitations & Future Improvements

- No backend or real submission handling
- `localStorage` is used for basic persistence only
- No animations between steps
- Could be refactored further toward a fully state-driven rendering model

## 📄 Run Locally

Open `index.html` in your browser.
No build steps or dependencies required.
