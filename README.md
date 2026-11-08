# Diwali Dhamaka 🪔

A responsive React + Vite Diwali surprise website with:
- Suspense intro, funny meme-caption reveal, and personalized greeting
- Original desi/Bhojpuri-comedy-inspired text (not copied Ravi Kishan photos or movie clips)
- Synthesized festive melody and funny sound effects using Web Audio (no external audio files)
- Personalized URL using `?to=Name`
- WhatsApp share and copy-link actions

## Run locally
1. Install Node.js (LTS).
2. Extract this folder and open a terminal inside it.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL shown by Vite.

## Build for hosting
Run `npm run build`. Upload the generated `dist` folder to Netlify, Vercel, or another static host.

## Personalize
- The opening screen lets you enter a recipient's name.
- WhatsApp sharing generates a link with that name in the URL.
- To use real Ravi Kishan meme images, add only images you have permission to use; this project deliberately uses original emoji-and-caption meme cards instead of embedding unlicensed photos or movie clips.

Audio starts only after a user taps the Music button because browsers block autoplay.
