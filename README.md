Will Updated in 1.4



# The Temporal Scale

A single-page personal portfolio by Everechoes, presented as a cinematic, architectural interface. The site combines a fictional St. Pavlov Foundation boot sequence with interactive portfolio content.

## Features

- Responsive single-page layout with About, Project, and Contact sections
- Animated boot sequence with options to skip to the home page
- Live date and time display
- Interactive 3D-style book for profile, education, and skills content
- Project cards with detail dialogs and external project links
- Animated transition from the hero section to the project archive
- Sound settings panel with five selectable looping audio tracks
- Ambient particles and pointer effects, with reduced-motion preferences respected
- No frontend framework or build step required

## Project Structure

```text
.
├── index.html
├── server.js              # Optional Node.js static server on port 8000
├── favicon.svg
├── css/
│   ├── style.css          # CSS entry point; imports the styles below
│   ├── base.css           # Theme variables, reset, and shared utilities
│   ├── boot.css           # Boot sequence
│   ├── layout.css         # Page layout and responsive rules
│   ├── foundation.css     # St. Pavlov Foundation visual theme
│   ├── refinements.css    # Interaction and responsive refinements
│   └── book.css           # Interactive book
├── js/
│   ├── project.js         # Project card data
│   ├── site.js            # Clock, project cards, transitions, and book content
│   ├── boot.js            # Boot sequence behavior
│   ├── music.js           # Sound panel and audio playback
│   └── sandbox.js         # Optional Three.js scene; not loaded by index.html
└── assets/
    ├── README.md          # Asset notes
    ├── hero.webm          # Available video asset; not currently used by index.html
    ├── sound1.mp4 ... sound5.mp4
    ├── book-cover.png, cover-left.png, cover-right.png
    ├── profile-pic.png, school-pic1.webp ... school-pic3.jpg
    ├── Skill-*.png, Skill-*.webp, Skills-*.png
    └── logo-discord.webp, logo-github.webp, logo-spotify.png
```

## Run Locally

You can open `index.html` directly, but using a local HTTP server is recommended for consistent media loading.

### Node.js

The included server uses only Node.js built-in modules; no package installation is needed:

```bash
node server.js
```

Then visit <http://localhost:8000/>.

### Python

Alternatively, run Python's built-in server from the project directory:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000/>.

## Customizing Content

- Edit the `PROJECTS` array in `js/project.js` to update project titles, descriptions, tags, details, and links.
- Edit the book copy, profile details, education gallery, skills, and book captions in `js/site.js`.
- Update section markup, contact links, and sound track labels or paths in `index.html`.
- The sound panel expects `assets/sound1.mp4` through `assets/sound5.mp4`. Replace those files or update the matching `data-file` paths in `index.html`.
- `assets/hero.webm` is included but is not currently referenced by the page. To use it as a hero background, add a video element and connect it to the existing hero layout.

## Accessibility and Motion

The boot sequence and sound controls can be operated with the keyboard. The book supports keyboard interaction, including Escape to close it. Several decorative animations and the project transition respect the browser's `prefers-reduced-motion` setting.

## License

This project is intended for personal or demo use. Before publishing or redistributing it, verify the licenses for all included media, fonts, and other third-party assets.
