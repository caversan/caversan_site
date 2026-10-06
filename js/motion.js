"use strict";

// Progressive enhancement: content stays visible if animation APIs are unavailable.
(() => {
 const main = document.querySelector("main");
 if (!main || !("IntersectionObserver" in window)) return;
 const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
 // Local development is an animation preview; production follows OS preferences.
 const animationSetting = new URLSearchParams(window.location.search).get("animations");
 const localPreview = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
 const preview = animationSetting === "on" || (localPreview && animationSetting !== "off");
 if (preview) document.documentElement.classList.add("motion-preview");
 const shouldReduce = () => reducedMotion.matches && !preview;
 const desktop = window.matchMedia("(min-width: 901px)");
 const header = document.querySelector(".header");
 const selector = ".hero > div > *, .hero-note, main > section > .eyebrow, main > section > h2, .section-heading, .project, .gallery-group > h3, .gallery-item, .skill-card, .about > *, .experience-row, .degree, .publication-card, #publications > p, #contact > *";
 const prepared = new WeakSet();
 const pending = new Set();
 let activeMedia = new Set();
 const activeScroll = new Set();
 const scrollOffsets = new WeakMap();
 const scrollTargets = new Set();
 let frame = 0;

 const reveal = element => {
  element.classList.remove("motion-pending");
  element.classList.add("motion-visible");
  pending.delete(element);
  entrances.unobserve(element);
 };
 const entrances = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
 }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });

 const media = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) activeMedia.add(entry.target);
   else activeMedia.delete(entry.target);
  });
  schedule();
 });
 const scrolling = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) activeScroll.add(entry.target);
   else activeScroll.delete(entry.target);
  });
  schedule();
 }, { rootMargin: "80px 0px" });

 function updateParallax() {
  frame = 0;
  const enabled = !shouldReduce();
  const intensity = desktop.matches ? 1 : .55;
  if (header) {
   const range = document.documentElement.scrollHeight - window.innerHeight;
   const progress = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0;
   header.style.setProperty("--page-progress", enabled ? progress.toFixed(4) : "0");
  }
  // Read geometry first, then write styles to avoid repeated layout work.
  const mediaPositions = Array.from(activeMedia, element => [element, element.getBoundingClientRect()]);
  const scrollPositions = Array.from(activeScroll, element => [element, element.getBoundingClientRect()]);
  mediaPositions.forEach(([element, rect]) => {
   if (!element.isConnected) { activeMedia.delete(element); return; }
   const progress = (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight;
   const distance = Math.max(-28, Math.min(28, progress * 90)) * intensity;
   element.style.setProperty("--parallax-y", `${enabled ? distance : 0}px`);
  });
  scrollPositions.forEach(([element, rect]) => {
   if (!element.isConnected) { activeScroll.delete(element); return; }
   const viewport = Math.max(1, window.innerHeight);
   const center = rect.top + rect.height / 2 - (scrollOffsets.get(element) || 0);
   const position = Math.max(-1, Math.min(1, (viewport / 2 - center) / (viewport / 2 + rect.height / 2)));
   const distance = enabled ? position * 40 * intensity : 0;
   scrollOffsets.set(element, element.matches(".text-art strong") ? distance : 0);
   element.style.setProperty("--scroll-y", `${distance.toFixed(2)}px`);
   // The light follows the viewport through even very tall sections.
   const light = Math.max(0, Math.min(100, (viewport / 2 - rect.top) / Math.max(1, rect.height) * 100));
   element.style.setProperty("--scroll-light", `${light.toFixed(2)}%`);
  });
 }
 function schedule() { if (!frame) frame = requestAnimationFrame(updateParallax); }

 function prepare() {
  scrollTargets.forEach(element => {
   if (!element.isConnected) {
    scrolling.unobserve(element);
    scrollTargets.delete(element);
    activeScroll.delete(element);
   }
  });
  // Remove detached cards after a language change.
  pending.forEach(element => {
   if (!element.isConnected) { entrances.unobserve(element); pending.delete(element); }
  });
  main.querySelectorAll(selector).forEach(element => {
   if (prepared.has(element) || shouldReduce()) return;
   // Children of closed details are observed again naturally when expanded.
   prepared.add(element);
   const siblings = Array.from(element.parentElement.children);
   const index = siblings.indexOf(element);
   element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 80}ms`);
   element.classList.add("motion-reveal", "motion-pending");
   pending.add(element);
   entrances.observe(element);
  });
  main.querySelectorAll(".project .media-link img, .hero-note").forEach(element => {
   if (element.classList.contains("motion-parallax")) return;
   if (element.tagName === "IMG" && !element.parentElement.classList.contains("media-viewport")) {
    // Clip the moving image separately so it cannot overlap the action below.
    const viewport = document.createElement("span");
    viewport.className = "media-viewport";
    element.before(viewport);
    viewport.append(element);
   }
   element.classList.add("motion-parallax");
   media.observe(element);
  });
  main.querySelectorAll("main > section:not(.hero), .text-art strong").forEach(element => {
   if (scrollTargets.has(element)) return;
   scrollTargets.add(element);
   element.classList.add("motion-scroll");
   scrolling.observe(element);
  });
 }

 main.addEventListener("focusin", event => {
  // Keyboard focus must never land inside an invisible card.
  pending.forEach(element => { if (element.contains(event.target)) reveal(element); });
 });
 document.addEventListener("portfolio:language-changed", () => {
  main.querySelectorAll(selector).forEach(element => {
   entrances.unobserve(element);
   pending.delete(element);
   prepared.delete(element);
   element.classList.remove("motion-visible", "motion-pending");
  });
  prepare();
  // Commit the reset even when another language is selected mid-animation.
  void main.offsetWidth;
  pending.forEach(element => {
   if (element.contains(document.activeElement)) reveal(element);
  });
  schedule();
 });
 new MutationObserver(() => prepare()).observe(main, { childList: true, subtree: true });
 window.addEventListener("scroll", schedule, { passive: true });
 window.addEventListener("resize", schedule, { passive: true });
 desktop.addEventListener("change", schedule);
 reducedMotion.addEventListener("change", () => {
  if (shouldReduce()) pending.forEach(reveal);
  else prepare();
  schedule();
 });
 prepare();
})();
