# 🤡 #MAFIN — Clown Cloe Dubois

> _500.000+ clicks from fans across the world._  
> A fan-made interactive tribute for the _Sueños de Libertad_ fandom — built with Vanilla JS, Firebase, and a lot of tomatoes.

---

## 🔗 Links

- **Live Site:** [View Live Demo](https://mafinclowncloe.netlify.app/)
- **Code:** [View GitHub Repository](https://github.com/altindaselif/mafin-clown-cloe)

---

## 📸 Screenshots

- [View Desktop Version](./desktop-screenshot.png)
- [View Mobile Version](./mobile-screenshot.png)

---

## 🎭 What Is This?

This is a fan interaction page built for the _#Mafin_ fandom of the Spanish series _Sueños de Libertad_. Users click the ¡DALE! button to "throw tomatoes" at the fictional villain Cloe Dubois — and their hit count is synced in real-time with every other fan around the world via Firebase.

The page accumulated over **500,000 global hits** organically through fandom sharing, with zero paid promotion.

---

## 💡 Key Features

- **🍅 Progressive Clown Transformation:** Cloe slowly gets dressed as a clown as you click — makeup appears at 10 hits, wig at 20, bowtie at 30, and the nose at 40. At 50, the tomatoes start flying.
- **🎯 Canvas Tomato Splatter:** After 50 hits, each tomato is animated in flight via `requestAnimationFrame` and lands as a hand-drawn splat rendered on an HTML Canvas.
- **🔤 Tomato Pattern Engine:** Tomatoes don't land randomly — they spell out words. Users can switch between four patterns (FINA, MARTA, MAFIN, ♥️) and the splats form those letters across Cloe's face, coordinate by coordinate.
- **🌍 Real-Time Global Counter:** Hit counts are synced across all users worldwide using Firebase Realtime Database transactions, ensuring atomic increments without race conditions.
- **🔊 Dynamic Audio:** Clown music starts playing on the first click and its playback rate increases slightly with each hit, building tension. At 50 hits, it cuts out and a tomato squash sound plays instead.
- **🌐 Bilingual Support (ES / EN):** Full Spanish/English i18n system using `data-i18n` attributes and a `translations` object, with preference saved to `localStorage`.
- **🃏 Marta Flip Card:** A CSS 3D flip card in the corner pays tribute to the actress Marta Belmonte, flipping on click to reveal a message from the fandom.
- **🎬 Video Modal with Slider:** A speech bubble on Cloe's photo opens a modal with a playlist of sarcastic Fina video clips, navigable with prev/next buttons.
- **🔒 Bot Protection:** Clicks are rate-limited to 80ms intervals and `e.isTrusted` is checked, so only real user interactions count toward the global total.
- **♿ Accessibility:** `aria-label` attributes on interactive controls, `type="button"` on all non-submit buttons, and keyboard-navigable UI.

---

## 🛠️ Technical Implementation

### Canvas Tomato Splatter

Each splat is drawn manually with the Canvas 2D API: a red ellipse with randomized radius and rotation, three smaller satellite droplets, and two pale seed-shaped highlights on top. No images, no libraries — just `ctx.ellipse()` and `ctx.arc()`.

### Pattern Coordinate System

`patterns.js` stores each word (FINA, MARTA, MAFIN, ♥️) as an array of `{ x, y }` percentage-based coordinates. `getNextPatternCoordinate()` converts these to pixel positions relative to the canvas dimensions on each call, making the layout fully responsive. Switching patterns resets the index and clears the canvas.

### Firebase Realtime Database with Atomic Transactions

Global hit counts use `globalHitsRef.transaction(v => (v || 0) + 1)` instead of a simple `set()`. This prevents lost writes when multiple users click simultaneously — Firebase guarantees the transaction is retried until it succeeds against the latest server value.

### Progressive Audio Escalation

The clown music `playbackRate` increments by `0.02` on each click, capped implicitly by the browser's maximum rate. This creates a subtle but noticeable sense of mounting chaos. Once the full clown costume is assembled at 50 hits, the music cuts and each subsequent click spawns a cloned `Audio` object for the squash sound, so rapid clicking doesn't get blocked by a single audio element's playback state.

### Canvas Resize Preservation

The `resizeCanvas()` function reads the canvas's current pixel content with `getImageData` before resizing and restores it with `putImageData` after, so existing tomato splatters survive window resize events.

---

## 🧰 Built With

- **Vanilla JavaScript (ES6+)**
- **HTML Canvas API**
- **CSS3 (Custom Properties, 3D Transforms, Keyframe Animations)**
- **Firebase Realtime Database** — global hit counter with atomic transactions
- **Firebase App Check** (reCAPTCHA Enterprise) — bot protection
- **Firebase Analytics** — milestone event tracking
- **Web Audio API** (native `<audio>` with dynamic cloning)

---

## ✍️ Author

- **LinkedIn:** [Elif Altındaş](https://www.linkedin.com/in/elifaltindas/)
- **Frontend Mentor:** [@altindaselif](https://www.frontendmentor.io/profile/altindaselif)
- **GitHub:** [@altindaselif](https://github.com/altindaselif)

---

_Disclaimer: This page is aimed solely at the fictional character Cloe Dubois, not the actress Antea Rodríguez._
