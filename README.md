# The Temporal Scale

Single-page static website with a cinematic, architectural, and experimental presentation style. The project is built as a browser-based landing experience and includes an animated boot sequence, interactive sound panel, clock, and layered visual composition inspired by a futuristic urban diorama.

## Features

- Animated intro/loading sequence
- Responsive one-page layout
- Top navigation and time display
- Interactive sound settings panel
- Stylized architectural background artwork
- Lightweight static frontend without a framework

## Project Structure

```text
.
├── index.html          # Main page structure
├── css/
│   └── style.css       # Styling and visual design
├── js/
│   └── ...             # JavaScript interactions and behavior
├── assets/
│   ├── README.md       # Media notes and usage guidance
│   ├── hero.mp4        # Optional hero/background media
│   ├── sound1.mp4      # Optional sound assets
│   ├── sound2.mp4
│   ├── sound3.mp4
│   └── sound4.mp4
├── favicon.svg
└── README.md
```

## Requirements

- Modern web browser
- Local HTTP server for best compatibility with media loading

## Run Locally

From the project folder, run:

```bash
python -m http.server 8000
```

Then open this URL in your browser:

```text
http://localhost:8000/
```

## Notes

- Some media assets are loaded from the `assets/` folder. If you want the sound or hero video to work properly, place the files there using the expected names.
- If video/audio is hosted from another domain, browser cross-origin restrictions may affect some features.
- For local testing, serving the site via a simple HTTP server is recommended instead of opening the HTML file directly.

## License

This project is intended for personal/demo use. If you plan to publish or distribute it, confirm the licensing for any included media, fonts, or third-party assets before use.
