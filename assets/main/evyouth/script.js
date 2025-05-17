// Function to open the pop-up with the player's agent information
function showPopup(agents) {
  const agentsContainer = document.getElementById("agents-container")
  agentsContainer.innerHTML = "" // Clear previous content

  agents.forEach((agent) => {
    const agentInfo = document.createElement("div")
    agentInfo.classList.add("agent-info")
    agentInfo.innerHTML = `
            <img src="${agent.icon}" alt="${agent.name}">
            <p>${agent.name}</p>
        `
    agentsContainer.appendChild(agentInfo)
  })

  const popup = document.getElementById("popup")
  const popupContent = document.querySelector(".popup-content")
  popup.style.display = "block"
  popupContent.classList.remove("fade-out")
  document.body.classList.add("body-no-scroll")
}

// Function to close the pop-up
function closePopup() {
  const popupContent = document.querySelector(".popup-content")
  popupContent.classList.add("fade-out")
  setTimeout(() => {
    document.getElementById("popup").style.display = "none"
    popupContent.classList.remove("fade-out")
    document.body.classList.remove("body-no-scroll")
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

  // Close popup when clicking outside
  popup.addEventListener("mousedown", (event) => {
    if (event.target === popup) {
      closePopup()
    }
  })

  // Add click event to player boxes
  const playerBoxes = document.querySelectorAll(".player-box")
  playerBoxes.forEach((box) => {
    if (!box.querySelector("h3").innerText.includes("Coach")) {
      // Use click for desktop
      box.addEventListener("click", (e) => {
        const agents = JSON.parse(box.getAttribute("data-agents"))
        showPopup(agents)
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
          showPopup(agents)
        }
      })
    }
  })
})

// Handle image load errors
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    if (!this.src.includes("placeholder.com")) {
      this.src = `https://via.placeholder.com/${this.width}x${this.height}`
    }
  })
})

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
