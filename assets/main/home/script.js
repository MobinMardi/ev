// Force page to load at the top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = "manual"
}

// Simple scroll to top on page load
window.addEventListener("load", () => {
  window.scrollTo(0, 0)
})

// Navbar scroll effect (colors/padding live in CSS via the .scrolled class,
// so JS and CSS can never drift out of sync)
const navbar = document.querySelector(".navbar")
let ticking = false

function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 100)
  ticking = false
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateNavbar)
    ticking = true
  }
}

// Update navbar on load
updateNavbar()

// Update navbar on scroll (rAF-throttled so it doesn't run more than once per frame)
window.addEventListener("scroll", onScroll, { passive: true })

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      const navbarHeight = navbar.offsetHeight
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Logo: smooth-scroll to top instead of a hard page reload when already home
const logoLink = document.getElementById("logo-link")
if (logoLink) {
  logoLink.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Handle image load errors with a local inline fallback (no third-party dependency)
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    if (this.dataset.fallbackApplied) return
    this.dataset.fallbackApplied = "true"
    const width = this.getAttribute("width") || this.width || 100
    const height = this.getAttribute("height") || this.height || 100
    this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%25" height="100%25" fill="%231b1032"/><text x="50%25" y="50%25" fill="%23c4c9df" font-family="sans-serif" font-size="14" text-anchor="middle" dominant-baseline="middle">EV</text></svg>`
  })
})

// Prevent context menu on images
document.querySelectorAll("img, svg").forEach((element) => {
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    return false
  })
})

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  // Update copyright year
  const currentYearSpan = document.getElementById("current-year")
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Add animation classes to elements that should animate on scroll
  // (.animate-element / .animate-in / transition-delay rules already live in styles.css)
  document
    .querySelectorAll(".section-header, .content-card, .info-item, .team-philosophy, .connect-content")
    .forEach((el) => {
      el.classList.add("animate-element")
      observer.observe(el)
    })
})
