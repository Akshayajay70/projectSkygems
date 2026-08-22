gsap.registerPlugin(ScrollTrigger);

const scenes = 8;
const gem = document.querySelector("#heroGem");
const copies = gsap.utils.toArray(".scene-copy");
const dots = document.querySelector("#dots");

// Build the progress indicators once. Scene changes are driven by the master timeline below;
// there are no competing gsap.to() calls fighting ScrollTrigger.
for (let i = 0; i < scenes; i++) {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dots.appendChild(dot);
}
const dotEls = [...dots.children];

// Initial states.
gsap.set(copies, { autoAlpha: 0, y: 35, filter: "blur(8px)" });
gsap.set(copies[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
gsap.set(
  ".gem-cut, .gem-core, .facet-lines, .gem-facet, .gem-flare, .origin-map, .macro-field, .orbit-system, .portfolio-pieces",
  { autoAlpha: 0 },
);
gsap.set(".gem-rough", { autoAlpha: 1 });
gsap.set(".light-rays", { autoAlpha: 0, scale: 0.65, rotation: -15 });
gsap.set(".gem", { rotationX: 0, rotationY: 0, scale: 0.82 });
gsap.set(".gem-halo", { scale: 0.7, rotation: 0 });

const sceneVisuals = [
  // 0 — rough crystal in darkness
  (tl) =>
    tl
      .to(".gem-rough", { autoAlpha: 1, duration: 0.35 })
      .to(
        ".spotlight",
        { opacity: 0.55, scale: 0.85, x: -10, y: -30, duration: 0.65 },
        "<",
      )
      .to(".gem", { scale: 0.86, rotationY: 24, duration: 0.9 }, "<"),

  // 1 — precision cuts appear
  (tl) =>
    tl
      .to(".gem-cut", { autoAlpha: 1, duration: 0.45 })
      .to(".facet-lines", { autoAlpha: 0.85, scale: 1.04, duration: 0.55 }, "<")
      .to(
        ".gem",
        { rotationY: 180, rotationX: 5, scale: 0.92, duration: 1.0 },
        "<",
      )
      .to(".gem-facet", { autoAlpha: 0.65, xPercent: 100, duration: 0.9 }, "<"),

  // 2 — first light / blue refraction
  (tl) =>
    tl
      .to(".gem-core", { autoAlpha: 1, duration: 0.35 })
      .to(
        ".light-rays",
        { autoAlpha: 1, scale: 1.2, rotation: 5, duration: 0.8 },
        "<",
      )
      .to(".gem-flare", { autoAlpha: 1, xPercent: 80, duration: 0.55 }, "<")
      .to(
        ".gem",
        { rotationY: 360, rotationX: 12, scale: 1.03, duration: 1.1 },
        "<",
      )
      .to(
        ".spotlight",
        { opacity: 0.95, scale: 1.2, x: 45, y: -5, duration: 0.8 },
        "<",
      ),

  // 3 — origin map appears behind the stone
  (tl) =>
    tl
      .to(".origin-map", { autoAlpha: 1, duration: 0.55 })
      .to(".map-route", { scaleX: 1, duration: 0.7, stagger: 0.12 }, "<")
      .to(
        ".gem",
        { rotationY: 500, rotationX: 2, scale: 0.94, duration: 1 },
        "<",
      )
      .to(".spotlight", { opacity: 0.5, x: -20, y: 35, duration: 0.8 }, "<"),

  // 4 — macro: enlarge the stone and reveal inclusions
  (tl) =>
    tl
      .to(".origin-map", { autoAlpha: 0, duration: 0.35 })
      .to(".macro-field", { autoAlpha: 1, scale: 1.15, duration: 0.55 }, "<")
      .to(".inclusions", { autoAlpha: 1, duration: 0.45 }, "<")
      .to(
        ".gem",
        { scale: 1.55, rotationY: 620, rotationX: -4, duration: 1.1 },
        "<",
      )
      .to(".gem-halo", { scale: 1.6, duration: 1 }, "<"),

  // 5 — gem galaxy / orbit system
  (tl) =>
    tl
      .to(".macro-field", { autoAlpha: 0, duration: 0.35 })
      .to(".orbit-system", { autoAlpha: 1, duration: 0.45 })
      .to(".orbit-system", { rotation: 25, duration: 1.0 }, "<")
      .to(
        ".orbit-gem",
        { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.06 },
        "<",
      )
      .to(
        ".gem",
        { scale: 0.9, rotationY: 780, rotationX: 8, duration: 1.0 },
        "<",
      ),

  // 6 — portfolio split / cards rise around the hero
  (tl) =>
    tl
      .to(".orbit-system", { autoAlpha: 0.2, duration: 0.4 })
      .to(".portfolio-pieces", { autoAlpha: 1, duration: 0.45 })
      .to(
        ".portfolio-pieces > div",
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, stagger: 0.08 },
        "<",
      )
      .to(
        ".gem",
        { scale: 0.78, rotationY: 920, rotationX: 0, duration: 1.0 },
        "<",
      )
      .to(
        ".spotlight",
        { opacity: 0.65, scale: 0.9, x: 0, y: -10, duration: 0.8 },
        "<",
      ),

  // 7 — final hold
  (tl) =>
    tl
      .to(".portfolio-pieces", { autoAlpha: 0, duration: 0.4 })
      .to(
        ".gem",
        { scale: 1.08, rotationY: 1080, rotationX: 0, duration: 1.15 },
        "<",
      )
      .to(".gem-halo", { scale: 1.9, opacity: 0.85, duration: 1 }, "<")
      .to(".spotlight", { opacity: 0.9, scale: 1.15, duration: 1 }, "<"),
];

// The single source of truth for the cinematic sequence.
const master = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: ".story",
    start: "top top",
    end: "bottom bottom",
    pin: ".story-pin",
    pinSpacing: false,
    scrub: 1.1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const index = Math.min(scenes - 1, Math.floor(self.progress * scenes));
      dotEls.forEach((dot, i) => dot.classList.toggle("active", i === index));
    },
  },
});

// Each scene occupies exactly one unit. Visual timelines are inserted at explicit
// positions so they never depend on the duration of the previous scene.
for (let i = 0; i < scenes; i++) {
  const start = i;

  if (i > 0) {
    master
      .to(
        copies[i - 1],
        { autoAlpha: 0, y: -30, filter: "blur(8px)", duration: 0.22 },
        start,
      )
      .to(
        copies[i],
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.28 },
        start + 0.08,
      );
  }

  const visual = gsap.timeline();
  sceneVisuals[i](visual);
  master.add(visual, start);
}

// The timeline is exactly eight scene units long. ScrollTrigger scrubs this
// timeline rather than letting independent tweens compete with it.
master.duration(scenes);

// Small non-conflicting interactions: cursor changes the spotlight only.
window.addEventListener("pointermove", (e) => {
  const x = (e.clientX / innerWidth - 0.5) * 35;
  const y = (e.clientY / innerHeight - 0.5) * 25;
  gsap.to(".cursor-glow", {
    x: e.clientX,
    y: e.clientY,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
  });
  gsap.to(".spotlight", {
    xPercent: x,
    yPercent: y,
    duration: 0.7,
    ease: "power2.out",
    overwrite: true,
  });
});

const stones = [
  ["Royal Ceylon Sapphire", "12.84 ct", "Sri Lanka", "Certified", "24,800"],
  ["Muzo Emerald", "8.52 ct", "Colombia", "GIA Certified", "18,600"],
  ["Mogok Pigeon Ruby", "6.21 ct", "Myanmar", "GIA Certified", "32,400"],
  ["Imperial Topaz", "14.37 ct", "Brazil", "IGI Certified", "16,900"],
  ["Welo Fire Opal", "9.11 ct", "Ethiopia", "GIA Certified", "8,750"],
];

document.querySelector("#vaultGrid").innerHTML = stones
  .map(
    (s) => `
<article class="stone-card">
  <div class="stone-image"><div class="stone-shape"></div></div>
  <h3>${s[0]}</h3><div class="meta">${s[1]} · ${s[2]}<br>${s[3]}</div><div class="price">$ ${s[4]}</div>
</article>`,
  )
  .join("");

gsap.utils
  .toArray(".trust article,.quote-grid blockquote,.stone-card")
  .forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });
gsap.from(".manifesto h2", {
  y: 80,
  opacity: 0,
  duration: 1,
  scrollTrigger: { trigger: ".manifesto", start: "top 70%", once: true },
});
gsap.from(".map", {
  scale: 0.9,
  opacity: 0,
  duration: 1,
  scrollTrigger: { trigger: ".origin", start: "top 70%", once: true },
});
gsap.to(".final-gem", {
  rotation: 360,
  scale: 1.2,
  duration: 18,
  repeat: -1,
  ease: "none",
});

window.addEventListener("load", () => {
  gsap.from(".nav", { y: -30, opacity: 0, duration: 1 });
  ScrollTrigger.refresh();
});
