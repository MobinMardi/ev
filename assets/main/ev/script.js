// Force page to load at the top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = "manual"
}

// Simple scroll to top on page load
window.addEventListener("load", () => {
  window.scrollTo(0, 0)
})

let lastFocusedElement = null

// Function to open the pop-up with the player's agent information
function showPopup(agents, triggerEl) {
  const agentsContainer = document.getElementById("agents-container")
  agentsContainer.innerHTML = "" // Clear previous content

  agents.forEach((agent) => {
    const agentInfo = document.createElement("div")
    agentInfo.classList.add("agent-info")
    agentInfo.innerHTML = `
            <img src="${agent.icon}" alt="${agent.name}" loading="lazy" width="48" height="48">
            <p>${agent.name}</p>
        `
    agentsContainer.appendChild(agentInfo)
  })

  const popup = document.getElementById("popup")
  const popupContent = document.querySelector(".popup-content")
  lastFocusedElement = triggerEl || document.activeElement
  popup.style.display = "flex"
  popupContent.classList.remove("fade-out")
  document.body.classList.add("body-no-scroll")

  // Move focus into the dialog for keyboard/screen-reader users
  popupContent.setAttribute("tabindex", "-1")
  popupContent.focus()
}

// Function to close the pop-up
function closePopup() {
  const popup = document.getElementById("popup")
  if (popup.style.display !== "flex") return

  const popupContent = document.querySelector(".popup-content")
  popupContent.classList.add("fade-out")
  setTimeout(() => {
    popup.style.display = "none"
    popupContent.classList.remove("fade-out")
    document.body.classList.remove("body-no-scroll")
    if (lastFocusedElement) lastFocusedElement.focus()
  }, 250)
}

// Event listeners for player boxes and popup
document.addEventListener("DOMContentLoaded", (event) => {
  // Update copyright year
  const currentYearSpan = document.getElementById("current-year")
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  const popup = document.getElementById("popup")
  const popupContent = document.querySelector(".popup-content")
  popup.setAttribute("role", "dialog")
  popup.setAttribute("aria-modal", "true")

  // Close popup when clicking outside
  popup.addEventListener("mousedown", (event) => {
    if (event.target === popup) {
      closePopup()
    }
  })

  // Close popup with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.style.display === "flex") {
      closePopup()
    }
  })

  // Add click / keyboard event to player boxes
  const playerBoxes = document.querySelectorAll(".player-box")
  playerBoxes.forEach((box) => {
    // Make cards keyboard-focusable and announce their purpose
    box.setAttribute("tabindex", "0")
    box.setAttribute("role", "button")
    const playerName = box.querySelector("h3") ? box.querySelector("h3").innerText : "player"
    box.setAttribute("aria-label", `View ${playerName}'s signature agents`)

    box.addEventListener("click", (e) => {
      const agents = JSON.parse(box.getAttribute("data-agents"))
      showPopup(agents, box)
    })

    // Keyboard activation (Enter / Space)
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const agents = JSON.parse(box.getAttribute("data-agents"))
        showPopup(agents, box)
      }
    })

    // Variables for touch handling
    let touchStartY = 0
    let touchEndY = 0
    const minSwipeDistance = 10 // Minimum distance to consider it a scroll, not a tap

    // Touch start event
    box.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.changedTouches[0].screenY
      },
      { passive: true },
    )

    // Touch end event with improved detection
    box.addEventListener("touchend", (e) => {
      touchEndY = e.changedTouches[0].screenY
      const verticalDistance = Math.abs(touchEndY - touchStartY)

      // Only trigger popup if it's a tap (minimal vertical movement)
      if (verticalDistance < minSwipeDistance) {
        e.preventDefault()
        const agents = JSON.parse(box.getAttribute("data-agents"))
        showPopup(agents, box)
      }
    })
  })
})

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

// Prevent context menu on images and svgs
document.querySelectorAll("img, svg").forEach((element) => {
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    return false
  })
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
