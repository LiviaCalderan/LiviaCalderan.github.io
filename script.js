// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileNav = document.getElementById("mobileNav")

mobileMenuBtn.addEventListener("click", () => {
  mobileMenuBtn.classList.toggle("active")
  mobileNav.classList.toggle("active")
})

// Close mobile menu when clicking on links
const mobileNavLinks = document.querySelectorAll(".nav-link-mobile")
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuBtn.classList.remove("active")
    mobileNav.classList.remove("active")
  })
})

// Header scroll effect
const header = document.getElementById("header")
const lastScrollY = window.scrollY

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]')
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const headerHeight = header.offsetHeight
      const targetPosition = targetSection.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Accordion functionality
const accordionHeaders = document.querySelectorAll(".accordion-header")

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const accordionItem = header.parentElement
    const isActive = accordionItem.classList.contains("active")

    // Close all accordion items
    document.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Open clicked item if it wasn't active
    if (!isActive) {
      accordionItem.classList.add("active")
    }
  })
})

// Keyboard navigation for accordion
accordionHeaders.forEach((header) => {
  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      header.click()
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
const animatedElements = document.querySelectorAll(".about-card, .accordion-item")
animatedElements.forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Download button functionality
const downloadBtn = document.querySelector(".btn-primary")
downloadBtn.addEventListener("click", () => {
  const link = document.createElement('a');
  link.href = 'Cartilha.pdf';
  link.download = 'Cartilha.pdf'
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})

// Add loading state to download button
downloadBtn.addEventListener("click", function () {
  const originalText = this.innerHTML
  this.innerHTML = '<span class="btn-icon">⏳</span>Preparing download...'
  this.disabled = true

  // Simulate download preparation
  setTimeout(() => {
    this.innerHTML = originalText
    this.disabled = false
  }, 2000)
})

// Accessibility improvements
document.addEventListener("DOMContentLoaded", () => {
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.textContent = "Skip to main content"
  skipLink.className = "sr-only"
  skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `

  // Show skip link on focus
  skipLink.addEventListener("focus", () => {
    skipLink.style.cssText = `
            position: absolute;
            left: 6px;
            top: 7px;
            z-index: 999999;
            padding: 8px 16px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;
        `
  })

  skipLink.addEventListener("blur", () => {
    skipLink.style.cssText = `
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `
  })

  document.body.insertBefore(skipLink, document.body.firstChild)

  // Add main content ID
  const mainContent = document.querySelector("main")
  if (mainContent) {
    mainContent.id = "main-content"
  }
})

// Prefers reduced motion
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.scrollBehavior = "auto"
}

// Handle focus management for accordion
accordionHeaders.forEach((header, index) => {
  header.addEventListener("keydown", (e) => {
    let targetIndex

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        targetIndex = index + 1
        if (targetIndex >= accordionHeaders.length) targetIndex = 0
        accordionHeaders[targetIndex].focus()
        break
      case "ArrowUp":
        e.preventDefault()
        targetIndex = index - 1
        if (targetIndex < 0) targetIndex = accordionHeaders.length - 1
        accordionHeaders[targetIndex].focus()
        break
      case "Home":
        e.preventDefault()
        accordionHeaders[0].focus()
        break
      case "End":
        e.preventDefault()
        accordionHeaders[accordionHeaders.length - 1].focus()
        break
    }
  })
})

// Add ARIA attributes for better accessibility
accordionHeaders.forEach((header, index) => {
  const content = header.nextElementSibling
  const headerId = `accordion-header-${index}`
  const contentId = `accordion-content-${index}`

  header.setAttribute("id", headerId)
  header.setAttribute("aria-controls", contentId)
  header.setAttribute("aria-expanded", "false")

  content.setAttribute("id", contentId)
  content.setAttribute("aria-labelledby", headerId)
  content.setAttribute("role", "region")
})

// Update ARIA attributes when accordion state changes
const accordionObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const item = mutation.target
      const header = item.querySelector(".accordion-header")
      const isActive = item.classList.contains("active")

      if (header) {
        header.setAttribute("aria-expanded", isActive.toString())
      }
    }
  })
})

document.querySelectorAll(".accordion-item").forEach((item) => {
  accordionObserver.observe(item, { attributes: true })
})
