# Everechoes — The Temporal Scale

A responsive, single-page portfolio presented as an architectural archive. It combines a paper-and-ink visual style with a custom loading sequence, an illustrated building study, an interactive book, project cards, and contact links.

Built with HTML, CSS, and vanilla JavaScript. No package installation or build step is required.

## Features

- **Archive loading screen** with progress feedback, a skip control, and a left-to-right page-reveal transition into the portfolio.
- **Custom loading-screen background:** choose an MP4, WebM, JPG, or PNG in **System Settings → Visual**. The selected file is stored in the browser using IndexedDB and can be removed to restore the default background. This setting is local to the browser and is not uploaded with the website.
- **Architectural hero illustration** with interactive building highlights and an optional video visual mode.
- **Interactive profile book** with profile, education, and skills content.
- **Project archive** with project details and repository links.
- **System Settings** for visual modes and five selectable audio tracks.
- **Responsive About, Project, and Contact sections**, live clock, fixed top navigation, smooth scrolling, and scroll effects.
- Keyboard-accessible controls and support for `prefers-reduced-motion`.

## Run Locally

Run the site through a local HTTP server for the best browser compatibility, especially for media playback and loading-screen background storage.

### Node.js

The included server uses Node.js built-in modules only:

```bash
node server.js
```

Open <http://localhost:8000/>.

### Python

Alternatively, run Python's built-in server from the project root:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Customizing

- **Portfolio sections, navigation, contact links, and media controls:** `index.html`
- **Project data:** `js/project.js`
- **Profile, education, skills, and book content:** `js/site.js`
- **Audio track file paths and labels:** edit the matching `.sound-choice` entries in `index.html`
- **Architectural illustration and building interactions:** `index.html`, `css/architecture.css`, and `js/architecture.js`
- **Loading-screen background behavior:** `js/boot-background.js`
- **Visual styling:** stylesheets in `css/`; `css/style.css` is the main stylesheet entry point.

### Loading-screen background

Visitors can select `.mp4`, `.webm`, `.jpg`, `.jpeg`, or `.png` files from **System Settings → Visual**. The choice is saved in the current browser's IndexedDB storage. Use **Remove Background** in the same panel to return to the default paper-and-grid background.

The selected media is stored locally in that browser; it is not part of the repository and is not shared with other visitors. For video backgrounds, use a browser-supported MP4 or WebM encoding and test it in the target browsers.

## Project Structure

```text
.
├── index.html
├── server.js
├── favicon.svg
├── css/
│   ├── style.css                  # Main stylesheet entry point
│   ├── base.css                   # Base styles, colors, and utilities
│   ├── layout.css                 # Page layout and top navigation
│   ├── foundation.css             # Main archival visual theme
│   ├── refinements.css            # Responsive and visual refinements
│   ├── boot.css                   # Loading screen and exit transition
│   ├── boot-draft.css             # Loading-screen illustration styling
│   ├── architecture.css           # Architectural hero illustration
│   ├── architectural-details.css  # Editorial and architectural details
│   ├── book.css                   # Interactive book
│   ├── project.css                # Project archive
│   ├── scroll-animations.css      # Smooth scrolling and reveal effects
│   ├── visual-settings.css        # Settings panel and visual modes
│   └── interaction-guard.css      # Interaction safeguards
├── js/
│   ├── site.js                    # Shared page behavior and book content
│   ├── project.js                 # Project data
│   ├── architecture.js            # Building highlight interactions
│   ├── boot.js                    # Loading sequence
│   ├── boot-background.js         # Custom loading-screen media and storage
│   ├── music.js                   # Audio settings and playback
│   ├── visual-settings.js         # Visual mode controls
│   ├── scroll-animations.js       # Smooth scrolling and reveal effects
│   ├── interaction-guard.js       # Interaction safeguards
│   └── lenis.min.js               # Smooth-scroll library
└── assets/
    ├── README.md                  # Asset guide and inventory
    ├── Videos.webm                # Architectural visual-mode video
    ├── sound1.mp4 ... sound5.mp4  # Audio choices
    ├── book-cover.png, cover-left.png, cover-right.png
    ├── profile, school, and skills images
    └── contact logos and other visual assets
```

## Publishing Notes

- Preserve asset filename capitalization; GitHub Pages and other Linux-based hosts are case-sensitive.
- Test media playback and the loading screen on the actual hosting origin.
- The custom loading-screen background is a per-browser preference and is not included in a GitHub upload.
- Review the rights and licenses for bundled images, audio, video, and fonts before publishing.

## License

No explicit software license is currently included. Unless a license is added, the source code is not granted for reuse by others. Verify usage rights for third-party assets before publishing or redistributing them.
