# TRI STATION — landing page

Single-page marketing site for **TRI STATION**, a marketplace app for buying/selling triathlon gear (bikes, running, swimming, accessories) in Brazil. Client-side only — plain HTML/CSS/JS, no build step, no dependencies.

## Preview locally

Just open `index.html` in a browser, or serve it:

```
npx serve .
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — the site will be published at `https://<username>.github.io/<repo>/`.

## Notes

- The "Baixar para iOS/Android" buttons are intentionally non-functional placeholders — the app isn't published on the stores yet. They show a small "em breve" toast on click.
- Colors, logo, and copy match the real app (`tristation-app`): primary `#FB4600`, secondary `#064DF5`, background `#F4F5F7`, foreground `#111318`.
- Phone-screen mockups and feature icons are custom-built (HTML/CSS/inline SVG), not real screenshots or stock photography.
