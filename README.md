# 🧠 JS Quiz App - Interactive Skill Challenge

A breathtaking, modern JavaScript quiz application built with a premium glassmorphic interface. Fully optimized for search engine visibility (SEO) and rigorously crafted to meet **WCAG 2.1 AA Accessibility (a11y)** guidelines.

🚀 **[Play the Live Quiz Here!](https://mahmoud202202766-creator.github.io/Quiz-App/)**

---

## 🌟 Key Features

*   **🎨 Premium Glassmorphic Design:** An elegant dark-mode visual framework incorporating harmonic color schemes, responsive overlays (`backdrop-filter`), glowing success/failure gradients, and fluid micro-animations.
*   **♿ Full WCAG 2.1 AA Accessibility:**
    *   **Keyboard Navigable:** Option selectors are engineered using native HTML `<button>` elements, allowing effortless navigation via the `Tab` key and selection via `Enter` or `Space`.
    *   **Live Announcements:** Programmed with dynamic `aria-live` regions to announce changes in questions, status updates, and scores to screen readers.
    *   **Focus States:** Custom visual focus indicators highlight focused elements clearly without default browser borders.
*   **📡 Robust Offline Support & CORS Fallback:** Dynamic `fetch()` requests are often blocked locally under the `file://` protocol due to browser CORS policies. This app includes a built-in static database fallback, enabling it to run seamlessly on your desktop by simply double-clicking `index.html`.
*   **🔄 Unlocked Answer Review:** Complete the 10-question assessment to see your final score, percentage, and custom feedback. Enter Review Mode to inspect your correct/wrong options with active **Back** and **Next** controls unlocked!
*   **🚫 Smart Submission Validation:** The Submit button on the final question is dynamically disabled until you actively choose an answer, preventing premature submissions.
*   **🌎 High-Performance Relative Paths:** All assets are mapped using fully relative routes (e.g., `window.location.href = "js.html"`, relative background images), making the project immediately ready for subdirectory hosting (like GitHub Pages).

---

## 📁 File Structure

```text
quiz-app/
├── CSS/
│   ├── index.css        # Glassmorphic landing page styling
│   └── js.css           # Premium high-contrast quiz states & transitions
├── images/              # Project backgrounds and graphic assets
├── index.html           # SEO-optimized landing page
├── js.html              # Semantic, ARIA-equipped quiz stage
├── questions.json       # Dynamic questions database
├── quiz.js              # Advanced application state & navigation logic
├── README.md            # Repository documentation
└── eslint.config.mjs    # Developer code-quality config
```

---

## ⚙️ How to Run Locally

You can launch and interact with the application in two ways:

### 1. Direct Launch (Offline Support)
Simply double-click the `index.html` file on your system. The app automatically detects the local filesystem protocol and falls back to loading questions from its built-in database to bypass CORS limits.

### 2. Local Development Server
For dynamic JSON loading, run a local development server in the repository directory:
```bash
# Using VS Code:
Right-click index.html -> Click 'Open with Live Server'

# Or using Node.js:
npx live-server
```

---

## 🛠️ Built With

*   **HTML5:** Structured using strict semantic elements (`<main>`, `<header>`, `role="radiogroup"`) for structural readability.
*   **CSS3:** Styled with raw CSS variables, glassmorphic filters, and animated focus frames.
*   **Vanilla JavaScript:** Clean state management and event handling, utilizing async fetches, optional chaining protections, and functional score calculators.
