// Force page to load at the top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = "manual"
}

// Simple scroll to top on page load
window.addEventListener("load", () => {
  window.scrollTo(0, 0)
})

// Update copyright year
document.getElementById("current-year").textContent = new Date().getFullYear()

// Navbar scroll effect
const navbar = document.querySelector(".navbar")
let lastScrollY = window.scrollY

function updateNavbar() {
  const scrollY = window.scrollY

  if (scrollY > 100) {
    navbar.style.padding = "0.75rem 0"
    navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)"
    navbar.style.background = "rgba(8, 0, 8, 0.9)"
  } else {
    navbar.style.padding = "1rem 0"
    navbar.style.boxShadow = "none"
    navbar.style.background = "rgba(8, 0, 8, 0.8)"
  }

  lastScrollY = scrollY
}

// Update navbar on load
updateNavbar()

// Update navbar on scroll
window.addEventListener("scroll", updateNavbar)

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

// Handle image load errors
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    if (!this.src.includes("placeholder.com")) {
      const width = this.getAttribute("width") || 100
      const height = this.getAttribute("height") || 100
      this.src = `https://via.placeholder.com/${width}x${height}?text=EV`
    }
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

  // Add animation classes to elements
  const style = document.createElement("style")
  style.textContent = `
    .animate-element {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .content-card:nth-child(2) {
      transition-delay: 0.2s;
    }
    
    .content-card:nth-child(3) {
      transition-delay: 0.4s;
    }
    
    .info-item:nth-child(2) {
      transition-delay: 0.2s;
    }
    
    .info-item:nth-child(3) {
      transition-delay: 0.4s;
    }
  `
  document.head.appendChild(style)

  // Add animation classes to elements that should animate on scroll
  document
    .querySelectorAll(".section-header, .content-card, .info-item, .team-philosophy, .connect-content")
    .forEach((el) => {
      el.classList.add("animate-element")
      observer.observe(el)
    })

  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero")
  const teamLogo = document.querySelector(".team-logo")

  if (heroSection && teamLogo) {
    // Float animation is now handled by CSS
    // No need to add it here
  }
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const heroSection = document.querySelector(".hero")
  const teamLogo = document.querySelector(".team-logo")

  if (heroSection && teamLogo) {
    const scrollPosition = window.scrollY
    const heroHeight = heroSection.offsetHeight

    if (scrollPosition <= heroHeight) {
      const parallaxValue = scrollPosition * 0.2
      teamLogo.style.transform = `translateY(${-parallaxValue}px)`
    }
  }
})

// Define float animation if not already in CSS
if (!document.querySelector("#float-animation")) {
  const floatAnimation = document.createElement("style")
  floatAnimation.id = "float-animation"
  floatAnimation.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }
  `
  document.head.appendChild(floatAnimation)
}
