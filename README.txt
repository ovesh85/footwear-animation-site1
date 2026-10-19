STRYDA — animated footwear storefront (static prototype)
========================================================
Open with a local server (video + image sequences need HTTP):
  npx http-server . -p 8080      then visit http://localhost:8080

Sections
 1. Preloader — 0-100 counter, STRYDA letters, 4-colour paint wipe.
 2. Hero slider (recreates the reference video) — 5 looks: Step Into Your Vibe / Own Your Edge Now /
    Make Every Step Count / Fresh Fit Fresh Kick / Built To Bounce Back. Each change re-themes the whole
    hero (paint strokes, blob, buttons, script gradient), repaints brush strokes, swaps the model with a
    blur/scale "smart animate", splits the headline letters. Autoplay 6.5s, thumbnail rail, arrows,
    swipe, keyboard ←/→, mouse parallax, colour paint trail that follows the cursor.
 3. Crossing marquees (speed reacts to scroll velocity).
 4. Anatomy of Bounce — scroll-scrubbed 124-frame film: the Flux sneaker explodes into 5 layers, callouts.
 5. Flux 01 colourway switcher — circle colour flood from the swatch, shoe swap, 3D tilt, sizes, add to bag.
 6. Shop grid — 8 products, filters, 3D tilt cards, wishlist, fly-to-bag + bag drawer.
 7. Moods in motion — 3 expanding video cards (Splash / Pop / Sun).
 8. MOVE LOUD — campaign video inside giant letters that zoom to full screen on scroll.
 9. Drop countdown + notify form, USP strip, footer with animated gradient wordmark.

Editing: SLIDES / PRODUCTS / FLUX arrays at the top of assets/js/app.js.
Libraries (bundled locally in assets/vendor): GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. Fonts: Google Fonts.
Images/videos: AI-generated, unbranded. Videos have desktop (.mp4) and mobile (-m.mp4) versions.

WooCommerce port: PRODUCTS -> WC products; addToBag() -> POST /wc/store/v1/cart/add-item;
notify form -> Mailchimp/CF7. Hero slides can be ACF repeater rows.
