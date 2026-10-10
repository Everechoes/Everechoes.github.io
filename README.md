# The Temporal Scale

A responsive, single-page personal portfolio by Everechoes. The site presents its portfolio content through an architectural archive interface, with a boot sequence, interactive building illustration, book-inspired profile section, and project and contact areas.

## Features

- Responsive About, Project, and Contact sections
- Animated boot sequence with an option to skip directly to the page
- Architectural hero illustration with interactive building highlights
- Optional architectural video mode, selectable from System Settings
- System Settings panel with visual and sound controls
- Five selectable looping audio tracks
- Interactive book for profile, education, and skills content
- Project cards with details and external links
- Live clock, scroll effects, and ambient visual details
- Keyboard interactions and support for `prefers-reduced-motion`
- No frontend framework, package installation, or build step required

## Recent Updates

1. Added an Ancient Visual mode to System Settings, inspired by *Pa Ŵr yw'r Porthor?*
2. Fixed bugs and interaction issues.
3. Added `assets/Videos.webm` to the Ancient Visual mode.
4. Added smoother animations to System Settings.
5. Improved spacing in the About, Project, and Contact sections.
6. Add a animation after the loading screen done.
7. Updating Animation Default Visual to Another Visual.

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- Lenis for smooth scrolling
- Google Fonts for typography
- Node.js built-in modules for the optional local server

## Project Structure

```text
.
├── index.html
├── server.js
├── favicon.svg
├── css/
│   ├── style.css                  # CSS entry point
│   ├── base.css                  # Base styles, variables, and utilities
│   ├── layout.css                # Page layout and responsive rules
│   ├── foundation.css            # Main visual theme
│   ├── refinements.css           # Additional visual and responsive refinements
│   ├── boot.css                  # Boot sequence
│   ├── boot-draft.css            # Architectural boot illustration
│   ├── architecture.css          # Architectural hero illustration and interactions
│   ├── architectural-details.css # Editorial and architectural styling details
│   ├── book.css                  # Interactive book
│   ├── project.css               # Project archive and cards
│   ├── scroll-animations.css     # Scroll and reveal animations
│   ├── visual-settings.css       # Visual modes and settings panel
│   └── interaction-guard.css     # Interaction and input safeguards
├── js/
│   ├── site.js                   # Clock, book content, and shared page behavior
│   ├── project.js                # Project archive content
│   ├── architecture.js           # Building highlight interactions
│   ├── boot.js                   # Boot sequence
│   ├── music.js                  # Sound settings and playback
│   ├── visual-settings.js        # Architectural/video mode controls
│   ├── scroll-animations.js      # Lenis scrolling and reveal effects
│   ├── interaction-guard.js      # Interaction safeguards
│   ├── lenis.min.js              # Smooth-scroll library
│   └── sandbox.js                # Optional scene script; not loaded by index.html
└── assets/
    ├── README.md                 # Asset notes
    ├── Videos.webm               # Architectural visual mode video
    ├── sound1.mp4 ... sound5.mp4 # Sound choices
    ├── book-cover.png, cover-left.png, cover-right.png
    ├── profile-pic.png, school-pic*
    ├── Skill-*.png, Skill-*.webp, Skills-*.png
    └── logo-discord.webp, logo-github.webp, logo-spotify.png
```

## Run Locally

Opening `index.html` directly may work, but running a local HTTP server is recommended for media and browser compatibility.

### Node.js

The included server uses only Node.js built-in modules. No dependencies need to be installed:

```bash
node server.js
```

Open <http://localhost:8000/>.

### Python

Alternatively, start Python's built-in server from the project directory:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Customizing Content

- Edit the project data in `js/project.js`.
- Edit the profile, education, skills, and book content in `js/site.js`.
- Update section markup, contact links, visual-mode labels, and sound track paths in `index.html`.
- Replace the sound files or update their matching `data-file` attributes in `index.html`.
- Update the architectural drawing and building labels in the hero SVG in `index.html`; its styling is in `css/architecture.css`.

## Accessibility and Motion

Interactive controls include keyboard support, and the book can be closed with Escape. Scroll and decorative effects account for the browser's `prefers-reduced-motion` setting. The interface uses semantic HTML and descriptive labels for its interactive architectural illustration.

## License

This project is intended for personal or demo use. Before publishing or redistributing it, verify the licenses and usage rights for all included media, fonts, and third-party assets.
