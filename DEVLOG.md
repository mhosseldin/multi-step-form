# Dev Log – HTML Skeleton

## Initial thoughts

Before writing any CSS or JS, I wanted the HTML structure to be clear enough on its own.

The plan was:

- One main wrapper for the whole layout
- Inside it, two parts:
  - A sidebar for steps navigation
  - The form itself

Inside the form:

- A `form-body` that holds all steps
- A `form-footer` for navigation buttons (back / next / confirm)

Each step is its own `fieldset`.  
The footer stays outside the steps so button logic stays simple later.

After finishing the first HTML skeleton, I pushed it to an **HTML-Skeleton** branch and sent it to Claude Sonnet to review it from an accessibility and performance point of view.

---

## Feedback summary

Claude’s feedback was mostly positive.

Things that were already okay:

- Using `fieldset` and `legend` correctly
- All inputs had proper labels
- ARIA wasn’t overused
- The structure of steps was clear

Things that were missing:

- No clear way to tell which step is active
- No structure for validation errors yet
- Navigation wasn’t very helpful for keyboard or screen reader users
- Some accessibility connections were missing

---

## What I changed after the review

I went through the suggestions and applied the ones that made sense for this stage of the project.

- Added a `<main>` element so the main content is easier to reach for screen readers
- Used `aria-current="step"` on the active step in the sidebar
- Added placeholders for error messages and linked them using `aria-describedby`
- Added `id` attributes to radio inputs so labels and keyboard navigation work properly
- Changed the summary add-ons from `<ul>` to `<dl>` since it’s basically name → price
- Added `autocomplete` attributes to improve form autofill
- Added `aria-label` where button text alone wasn’t clear enough
- Changed step 5 from `fieldset` to `section` since it’s not part of the form input flow
- Split navigation buttons and controlled visibility using `hidden` and `data-action`
- Marked decorative elements with `aria-hidden="true"`

---

# Dev Log – UI Implementation Check

I tried to match the UI as closely as possible based on the provided design images.

The layout and spacing are mostly there, but it’s not pixel-perfect.  
That’s expected since I’m working without the original Figma file and relying only on static screenshots.

At this point, the goal was to get the structure, proportions, and overall feel right rather than chasing exact pixels.

Next step is sending the current code to Claude Sonnet for a review to see:

- what structural or styling changes it suggests
- and which of those changes are actually worth applying
