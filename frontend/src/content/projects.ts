import { Project } from "@/types/project";

export const ownProjects: Project[] = [
  {
    slug: "make-video-small",
    title: "Make Video Small",
    desc: "A desktop app for high-efficiency video compression, providing a clean interface over FFmpeg and Av1an.",
    summary:
      "Make Video Small wraps local AV1 encoding in a desktop app so shrinking video doesn't mean learning FFmpeg flags. It batches an entire folder, reads your own CPU and GPU to propose a sensible preset, previews the result against the source before committing to a real encode, and never uploads a single file.",
    href: "https://makevideosmall.vercel.app/",
    logo: "/assets/project-logo6.png",
    cover: "/projects/makevideosmall/cover.png",
    tags: [
      { id: 1, name: "Electron", path: "/assets/electron.svg" },
      { id: 2, name: "React.js", path: "/assets/react.svg" },
      { id: 3, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 4, name: "Python", path: "/assets/python.svg" },
    ],
    shots: [
      {
        src: "/projects/makevideosmall/01-hero.png",
        caption:
          "Local AV1 encoding for Windows: drop in files and batch-compress without uploading anything.",
      },
      {
        src: "/projects/makevideosmall/02-proof.png",
        caption:
          "A draggable before/after comparison with real SSIM and PSNR numbers, not a marketing estimate.",
      },
      {
        src: "/projects/makevideosmall/03-preview-studio.png",
        caption:
          "Visual Preview Studio previews every quality preset against the source before the real encode runs.",
      },
      {
        src: "/projects/makevideosmall/04-how-it-works.png",
        caption: "Three steps: drop a folder, let it read your hardware, walk away.",
      },
      {
        src: "/projects/makevideosmall/05-features.png",
        caption:
          "Built for people with too many files: full hardware use, nothing leaves the disk, no ceiling.",
      },
      {
        src: "/projects/makevideosmall/06-image-studio.png",
        caption: "Handles stills too, with AI upscaling and a metadata studio for EXIF cleanup.",
      },
      {
        src: "/projects/makevideosmall/07-compare.png",
        caption: "An honest comparison table against the alternatives, including where it doesn't win.",
      },
    ],
  },
  {
    slug: "ciphersprint",
    title: "CipherSprint",
    desc: "An interactive typing speed test with live 1v1 races, weak-key heatmaps, and replays.",
    summary:
      "CipherSprint is a typing test that decodes as you type, in its own amber-on-graphite Cipher theme. It has live 1v1 races with ghost carets, quick match and custom lobbies, a command palette, 51 themes, keystroke-level replays, keyboard heatmaps, friends and DMs, leaderboards, 8 languages, and an installable offline-ready PWA.",
    href: "https://ciphersprint.vercel.app/",
    logo: "/assets/project-logo1.svg",
    cover: "/projects/ciphersprint/cover.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Firebase", path: "/assets/firebase.png" },
      { id: 3, name: "Framer Motion", path: "/assets/framer.png" },
    ],
    shots: [
      {
        src: "/projects/ciphersprint/01-home-cipher-theme-and-wordmark.png",
        caption:
          "The typing test in Cipher, CipherSprint's own amber-on-graphite theme, with the live caret wordmark.",
      },
      {
        src: "/projects/ciphersprint/02-decrypt-animation-on-new-test.png",
        caption: "The signature moment: every new test arrives encrypted and decodes into words.",
      },
      {
        src: "/projects/ciphersprint/03-live-wpm-while-typing.png",
        caption: "Distraction-free typing: the nav fades away and live wpm sits beside the timer.",
      },
      {
        src: "/projects/ciphersprint/04-results-new-personal-best.png",
        caption:
          "Results with a new personal best called out (+17 over the old best), per-second chart and stats.",
      },
      {
        src: "/projects/ciphersprint/05-share-card-export.png",
        caption: "One click exports a branded share card of the result.",
      },
      {
        src: "/projects/ciphersprint/06-race-live-lanes-and-ghost-caret.png",
        caption: "Live 1v1 race: a lane per racer and the opponent's caret moving through the same text.",
      },
      {
        src: "/projects/ciphersprint/07-race-results-head-to-head.png",
        caption: "Race results side by side, with a two-line speed chart and side-by-side replays.",
      },
      {
        src: "/projects/ciphersprint/08-race-lobby-custom-rules.png",
        caption:
          "Race lobby: the host sets the rules (format, length, punctuation, language) and invites a friend.",
      },
      {
        src: "/projects/ciphersprint/09-quick-match-searching.png",
        caption: "Quick match: get paired with whoever is looking for a race right now.",
      },
      {
        src: "/projects/ciphersprint/10-race-spectator-view.png",
        caption: "Spectator view: watch both racers' carets live.",
      },
      {
        src: "/projects/ciphersprint/11-command-palette-theme-preview.png",
        caption: "Ctrl+K command palette: every action from the keyboard, with live theme preview.",
      },
      {
        src: "/projects/ciphersprint/12-theme-picker-cipher-originals.png",
        caption: "51 themes, with CipherSprint's two originals first.",
      },
      {
        src: "/projects/ciphersprint/13-analytics-keyboard-heatmap.png",
        caption: "Analytics: 10-test moving average, and a keyboard heatmap of the keys you miss.",
      },
      {
        src: "/projects/ciphersprint/14-practice-weak-keys.png",
        caption: "\"Practise weak keys\" builds a test from real words packed with your problem letters.",
      },
      {
        src: "/projects/ciphersprint/15-test-replay-player.png",
        caption: "Replay any test keystroke by keystroke, at 1x, 2x or 4x.",
      },
      {
        src: "/projects/ciphersprint/16-profile-race-record.png",
        caption: "Profiles: bests, activity and the race record, including your head-to-head.",
      },
      {
        src: "/projects/ciphersprint/17-friends-and-dm-typing-indicator.png",
        caption: "Friends and DMs in real time, with a blinking caret for \"typing\".",
      },
      {
        src: "/projects/ciphersprint/18-leaderboard-friends-filter.png",
        caption: "Leaderboards for everyone or just your friends, per mode and language.",
      },
      {
        src: "/projects/ciphersprint/19-settings-caret-sound-sync.png",
        caption: "Settings: caret style, fonts, synthesised key sounds, all synced to your account.",
      },
      {
        src: "/projects/ciphersprint/20-multi-language-spanish-test.png",
        caption: "Eight languages, from Spanish to Hinglish.",
      },
      {
        src: "/projects/ciphersprint/21-block-and-report-user.png",
        caption: "Safety: report or block anyone, with a review queue for admins.",
      },
      {
        src: "/projects/ciphersprint/22-password-reset.png",
        caption: "Password reset by email, with one-time links that sign out every other device.",
      },
      {
        src: "/projects/ciphersprint/23-offline-mode-pwa.png",
        caption: "Installable and offline-ready: results finished offline sync when you are back.",
      },
      {
        src: "/projects/ciphersprint/24-cipher-paper-light-theme.png",
        caption: "Cipher Paper, the light twin of the house theme.",
      },
      {
        src: "/projects/ciphersprint/25-mobile-typing-test.png",
        caption: "Designed for phones, not shrunk.",
      },
      {
        src: "/projects/ciphersprint/26-mobile-analytics.png",
        caption: "Analytics on mobile.",
      },
    ],
  },
  {
    slug: "gaberina",
    title: "Gaberina",
    desc: "A luxury fragrance e-commerce site built around cinematic, scroll-driven storytelling.",
    summary:
      "Gaberina is a Maison de Parfum concept built as a full e-commerce platform: a cinematic, scroll-driven homepage that opens on a macro shot of the flacon, a signature fragrance collection, and secure login, payments, and a dynamic admin panel behind the scenes.",
    href: "https://gaberina.vercel.app/",
    logo: "/assets/project-logo3.png",
    cover: "/projects/gaberina/cover.png",
    video: {
      src: "/projects/gaberina/showcase.mp4",
      poster: "/projects/gaberina/showcase-poster.jpg",
    },
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 3, name: "MongoDB", path: "/assets/mongodb.svg" },
    ],
    shots: [
      {
        src: "/projects/gaberina/01-hero.png",
        caption: "The hero: a macro shot of the flacon dissolving into the wordmark as the page loads.",
      },
    ],
  },
];
