/**
 * Obavijest koju vidi posjetitelj dok je stranica zaustavljena.
 *
 * Napisana je kao jedan niz znakova, bez Reacta i bez dohvata podataka. Razlog:
 * ovo mora raditi i kad CMS ne odgovara. Boje su prepisane iz `globals.css` jer
 * proxy ne učitava stilove aplikacije.
 */

const TITLE = "Stranica je privremeno nedostupna";


export function suspensionPage(): string {
  return `<!doctype html>
<html lang="hr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: oklch(0.135 0.04 263);
    color: oklch(0.975 0.004 250);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  main { max-width: 34rem; text-align: center; }
  .mark {
    display: inline-block;
    padding: 8px 18px;
    border-radius: 999px;
    background: oklch(0.46 0.19 262);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  h1 {
    margin: 28px 0 0;
    font-size: clamp(1.75rem, 6vw, 2.75rem);
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  p { margin: 16px 0 0; color: oklch(0.8 0.02 255); font-size: 1.05rem; }
  a { color: oklch(0.975 0.004 250); font-weight: 700; }
</style>
</head>
<body>
<main>
  <span class="mark">SNK Moslavac</span>
  <h1>${TITLE}</h1>
</main>
</body>
</html>`;
}
