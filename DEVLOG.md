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

## Dev Log – CSS Refactor

After reading the CSS review, I decided to take the full refactor instead of fixing small things one by one.

The CSS before was working, but there were parts that would probably cause problems later:

- selectors were too deep and hard to follow
- spacing in the form depended on fragile values
- the desktop layout didn’t feel right compared to the design

---

## What changed

- Reduced selector nesting and relied more on direct class selectors.
- Adjusted the desktop layout so the form content is vertically centered instead of stuck at the top.
- Added a max width for the form content so inputs don’t get too wide on large screens.
- Removed `nth-of-type` spacing and replaced it with simpler spacing rules that work for any number of fields.
- Cleaned up button styles and separated behavior for:
  - Back
  - Next
  - Submit
- Changed how step indicators are centered (using flex instead of line-height).
- Added a subtle shadow to the mobile card so it stands out from the background.

---

This refactor didn’t change the overall idea or structure.  
It mainly made the CSS cleaner and easier to continue working on.

Next step is styling steps 2–5.

---

### CSS completed

Finished the full CSS for the multi-step form.  
Next step is sending the code for a senior review and iterating based on feedback.

Senior review received.

Went through the feedback and noted a few things that need fixing (step visibility, addon defaults, focus handling, and button states).
Next step is applying the fixes and cleaning up the CSS.

---

### JavaScript – Step Navigation & Core Logic

Started working on the JavaScript logic for the multi-step form.

I focused first on step navigation before touching validation or pricing:

- show step 1 by default
- hide all other steps
- move forward with Next
- move backward with Back

I selected the main DOM elements (steps, sidebar items, buttons, and the form) and used a single event listener on the form with event delegation to keep things simple and scalable.

One early challenge was handling step indexing:
the form steps are 1-based, while JS arrays are 0-based.
After fixing a few off-by-one mistakes, step transitions started behaving correctly.

I added helper functions to:

- switch steps
- update `aria-current` in the sidebar
- control button visibility (Back / Next / Submit)

Then I moved to validation:

- Step 1: name, email, phone
- Step 2: plan selection

Each validation updates the UI and saves valid data into a single `formState` object.

Billing toggle logic was handled using `data-*` attributes to update plan and addon prices without hardcoding values.

Add-ons selection and summary logic are in place:
the structure works, but the summary still needs some cleanup and refinement.

Overall, the core JS structure is now solid.
Next step is reviewing the code and fixing the weak points.

---

### JavaScript – Applying Review Feedback

After finishing the main logic, I reviewed feedback from a senior code review.

The review highlighted a few gaps that I missed in the first pass, especially around accessibility, UX details, and some state handling issues.

Based on the feedback, I implemented the following changes:

- Fixed a bug where the billing toggle (Monthly / Yearly) did not update the UI because change events were missing.
- Added `aria-invalid="true"` for invalid inputs instead of relying on alerts.
- Removed `alert()` usage and switched to inline error messages.
- Removed the shared `errorMsgs` array and used specific error elements by ID.
- Implemented navigation back to Step 2 when clicking the "Change" button in the Summary.
- Added focus management when moving between steps by focusing the step heading.
- Implemented the final submit flow by showing the Step 5 "Thank you" screen.
- Removed `formState.totalPrice` and moved total price calculation into the summary rendering logic.

After these changes, the flow felt more consistent and closer to real-world usage.

---

### JavaScript – Summary Bug & Partial Rendering

While finishing the JavaScript logic, I ran into an annoying bug in the Summary step.

The problem showed up when moving from Step 4 (Summary) back to Step 3, then going to Step 4 again.
Sometimes the app crashed, and other times the prices just didn’t show up.

At first, the error message made it look like `periodText` was the issue.
After debugging, I realized the real problem was simpler:
some Summary DOM elements were not always available when `renderSummary()` was running.

I tried adding defensive checks, but my first attempt stopped the whole render if _any_ element was missing.
That fixed the crash, but caused the UI to stop updating completely.

The final solution was switching to partial rendering.
Instead of exiting early, each part of the Summary now updates only if its DOM element exists.
This way, missing elements don’t block the rest of the UI from rendering.

This approach fixed both the crash and the missing prices issue,
and made the Summary step stable when navigating back and forth between steps.

At this point, the full form flow is working as expected.
