# Asset Guide

This folder contains images and audio used by the portfolio page. Asset paths are written relative to the project root, for example, `assets/book-cover.png`. Keep filenames and capitalization exactly as listed below; Linux-based hosting environments are case-sensitive.

## Asset Inventory

### Book Covers

| File | Usage |
| --- | --- |
| `book-cover.png` | Center book cover for the profile section. |
| `cover-left.png` | Left-side book: *The Prisoner in the Cave* (Skills). |
| `cover-right.png` | Right-side book: *Paradise Regained* (Education). |
| `cover-right2.webp` | Available in the folder, but not currently referenced by the page or scripts. |

Book order and content are configured in `js/site.js`; the initial cover markup is in `index.html`.

### Profile and Education Photos

| File | Usage |
| --- | --- |
| `profile-pic.png` | Profile photo in the interactive profile book. |
| `school-pic1.webp` | Education gallery: SDN 1 Guntung Payung Banjarbaru. |
| `school-pic2.jpg` | Education gallery: SMP Negeri 9 Banjarbaru. |
| `school-pic3.jpg` | Education gallery: SMK Telkom Banjarbaru. |

The education photo list, captions, and profile photo path are defined in `js/site.js`.

### Skill and Tool Icons

These icons appear on the Skills page inside the interactive book. Their labels and groups can be changed in `skillGroups` in `js/site.js`.

| File | Current label |
| --- | --- |
| `Skill-1.png` | HTML |
| `Skill-2.png` | CSS |
| `Skills-10.png` | JavaScript |
| `Skills-3.png` | PHP |
| `Skill-4.webp` | Laragon |
| `Skill-5.png` | Figma |
| `Skill-6.webp` | MySQL |
| `Skill-7.png` | VS Code |
| `Skill-9.webp` | GitHub |
| `Skill-8.png` | Git |

### Contact Logos

| File | Usage |
| --- | --- |
| `logo-discord.webp` | Logo on the Discord contact card. |
| `logo-github.webp` | Logo on the GitHub contact card. |
| `logo-spotify.png` | Logo on the Spotify contact card. |

Logo sources and contact links are defined in `index.html`. The Discord and GitHub markup also lists `.png` and `.jpg` fallback sources, but those fallback files are not currently present in this folder. To support browsers without WebP, add fallback files with those names or update the markup.

### Audio

The Sound Settings panel in `index.html` offers five tracks. `js/music.js` loads the selected file when a visitor presses Play and loops it until playback is stopped or another track is selected.

| File | Name in the panel |
| --- | --- |
| `sound1.mp4` | Polymerized Dreams |
| `sound2.mp4` | Temporal Scale |
| `sound3.mp4` | The Road Not Taken |
| `sound4.mp4` | Assassin's Creed 2 |
| `sound5.mp4` | Siren Song (2023) |

To replace a track, keep its filename or update the matching `data-file` attribute on the `.sound-choice` item in `index.html`. Playback starts after user interaction. If a file is missing or cannot be played, the panel displays the path that needs to be checked.

### Optional Hero Video

`hero.webm` is available in this folder, but it is not currently used by `index.html`. Adding the file alone will not display it. To use it as a hero background, add a `<video>` element to the markup, style it with CSS, and configure video loading and playback behavior as needed.

## Replacing or Adding Assets

1. Place the file in the `assets/` folder.
2. Use a path relative to the project root, such as `assets/filename.webp`.
3. Update the relevant reference:
   - Markup, audio sources, and contact links: `index.html`
   - Profile photo, education gallery, skill icons, and book content: `js/site.js`
4. Make sure the extension in the path matches the file's actual format.
5. Run the site through a local server and check the browser DevTools for 404 errors or media decoding failures.

Optimize images and audio/video before publishing to keep loading times reasonable. Do not change a file's extension without converting it to the corresponding format.

## Running the Site Locally

Run one of the following commands from the project root (the folder containing `index.html`):

```bash
node server.js
```

Or use Python's built-in server:

```bash
python -m http.server 8000
```

Open <http://localhost:8000/>. The included Node.js server uses port `8000`; if that port is already in use, stop the other service or change the `PORT` constant in `server.js`.
