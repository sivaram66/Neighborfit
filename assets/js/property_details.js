// Enhanced JavaScript functionality
class RealEstateApp {
  constructor() {
    this.currentImageIndex = 0
    this.images = [
      "/placeholder.svg?height=500&width=800",
      "/placeholder.svg?height=500&width=800",
      "/placeholder.svg?height=500&width=800",
      "/placeholder.svg?height=500&width=800",
    ]
    this.isShortlisted = false
    this.currentTab = "transit"

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupImageGallery()
    this.setupTabs()
    this.setupAnimations()
    this.loadDynamicContent()
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active")
      })
    }

    // Shortlist button
    const shortlistBtn = document.getElementById("shortlist-btn")
    if (shortlistBtn) {
      shortlistBtn.addEventListener("click", () => {
        this.toggleShortlist()
      })
    }

    // Gallery navigation
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")

    if (prevBtn) prevBtn.addEventListener("click", () => this.previousImage())
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextImage())

    // Control buttons
    const photosBtn = document.getElementById("photos-btn")
    const locationBtn = document.getElementById("location-btn")

    if (photosBtn) {
      photosBtn.addEventListener("click", () => {
        this.setActiveControl("photos")
      })
    }

    if (locationBtn) {
      locationBtn.addEventListener("click", () => {
        this.setActiveControl("location")
      })
    }

    // Read more functionality
    const readMoreBtn = document.getElementById("read-more-btn")
    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", () => {
        this.toggleDescription()
      })
    }

    // Show all amenities
    const showAllAmenities = document.getElementById("show-all-amenities")
    if (showAllAmenities) {
      showAllAmenities.addEventListener("click", () => {
        this.showAllAmenities()
      })
    }

    // Contact and schedule buttons
    const contactBtn = document.querySelector(".contact-btn")
    const scheduleBtn = document.querySelector(".schedule-btn")

    if (contactBtn) {
      contactBtn.addEventListener("click", () => {
        this.showContactModal()
      })
    }

    if (scheduleBtn) {
      scheduleBtn.addEventListener("click", () => {
        this.showScheduleModal()
      })
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e)
    })

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize()
    })

    // Scroll effects
    window.addEventListener("scroll", () => {
      this.handleScroll()
    })
  }

  setupImageGallery() {
    const thumbnails = document.querySelectorAll(".thumbnail")

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        this.setActiveImage(index)
      })
    })

    // Auto-play functionality (optional)
    this.startAutoPlay()
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn")

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab")
        this.setActiveTab(tabName)
      })
    })
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "slideUp 0.6s ease-out forwards"
        }
      })
    }, observerOptions)

    // Observe all cards
    const cards = document.querySelectorAll(
      ".details-card, .price-card, .booking-card, .activity-card, .trend-card, .similar-card",
    )
    cards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      observer.observe(card)
    })
  }

  loadDynamicContent() {
    // Simulate loading dynamic content
    this.showLoading()

    setTimeout(() => {
      this.populateAmenities()
      this.populateNearbyLocations()
      this.populateSimilarProperties()
      this.updateActivityStats()
      this.hideLoading()
    }, 1000)
  }

  // Image Gallery Methods
  setActiveImage(index) {
    this.currentImageIndex = index
    const mainImage = document.getElementById("main-image")
    const thumbnails = document.querySelectorAll(".thumbnail")

    if (mainImage) {
      mainImage.src = this.images[index]
      mainImage.style.opacity = "0"

      setTimeout(() => {
        mainImage.style.opacity = "1"
      }, 150)
    }

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index)
    })
  }

  nextImage() {
    const nextIndex = (this.currentImageIndex + 1) % this.images.length
    this.setActiveImage(nextIndex)
  }

  previousImage() {
    const prevIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length
    this.setActiveImage(prevIndex)
  }

  startAutoPlay() {
    setInterval(() => {
      if (!document.querySelector(".gallery-container:hover")) {
        this.nextImage()
      }
    }, 5000)
  }

  // Control Methods
  setActiveControl(control) {
    const buttons = document.querySelectorAll(".control-btn")
    buttons.forEach((btn) => {
      btn.classList.remove("active")
    })

    const activeBtn = document.getElementById(`${control}-btn`)
    if (activeBtn) {
      activeBtn.classList.add("active")
    }
  }

  toggleShortlist() {
    this.isShortlisted = !this.isShortlisted
    const shortlistBtn = document.getElementById("shortlist-btn")
    const heartIcon = shortlistBtn.querySelector(".heart-icon")
    const shortlistText = shortlistBtn.querySelector(".shortlist-text")

    if (this.isShortlisted) {
      shortlistBtn.classList.add("active")
      heartIcon.style.fill = "currentColor"
      shortlistText.textContent = "Shortlisted"
      this.showNotification("Added to shortlist!", "success")
    } else {
      shortlistBtn.classList.remove("active")
      heartIcon.style.fill = "none"
      shortlistText.textContent = "Shortlist"
      this.showNotification("Removed from shortlist", "info")
    }
  }

  // Tab Methods
  setActiveTab(tabName) {
    this.currentTab = tabName
    const tabBtns = document.querySelectorAll(".tab-btn")

    tabBtns.forEach((btn) => {
      btn.classList.remove("active")
    })

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`)
    if (activeTab) {
      activeTab.classList.add("active")
    }

    this.updateLocationContent(tabName)
  }

  updateLocationContent(tabName) {
    const locationsContainer = document.getElementById("nearby-locations")
    const locations = this.getLocationsByTab(tabName)

    locationsContainer.innerHTML = ""

    locations.forEach((location) => {
      const locationElement = this.createLocationElement(location)
      locationsContainer.appendChild(locationElement)
    })
  }

  getLocationsByTab(tabName) {
    const locationData = {
      transit: [
        { name: "Metro Station", distance: "0.5 km", time: "5 min walk", rating: 4.5 },
        { name: "Bus Stop", distance: "0.2 km", time: "2 min walk", rating: 4.0 },
        { name: "Railway Station", distance: "2.1 km", time: "15 min drive", rating: 4.2 },
      ],
      essentials: [
        { name: "Grocery Store", distance: "0.3 km", time: "3 min walk", rating: 4.3 },
        { name: "Pharmacy", distance: "0.4 km", time: "4 min walk", rating: 4.1 },
        { name: "ATM", distance: "0.1 km", time: "1 min walk", rating: 4.0 },
      ],
      utility: [
        { name: "Hospital", distance: "1.2 km", time: "8 min drive", rating: 4.4 },
        { name: "School", distance: "0.8 km", time: "6 min drive", rating: 4.6 },
        { name: "Bank", distance: "0.6 km", time: "5 min drive", rating: 4.2 },
      ],
    }

    return locationData[tabName] || []
  }

  createLocationElement(location) {
    const div = document.createElement("div")
    div.className = "location-item"
    div.style.animation = "fadeIn 0.5s ease-out"

    div.innerHTML = `
            <div class="location-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                </svg>
            </div>
            <div class="location-content">
                <div class="location-name">${location.name}</div>
                <div class="location-details">${location.distance} • ${location.time}</div>
            </div>
            <div class="location-rating">
                <span class="rating-stars">${this.generateStars(location.rating)}</span>
            </div>
        `

    return div
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    let stars = ""

    for (let i = 0; i < fullStars; i++) {
      stars += "★"
    }

    if (hasHalfStar) {
      stars += "☆"
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars += "☆"
    }

    return stars
  }

  // Content Population Methods
  populateAmenities() {
    const amenitiesGrid = document.getElementById("amenities-grid")
    const amenities = [
      { name: "Swimming Pool", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Gym", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Parking", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Security", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Garden", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Elevator", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    ]

    amenitiesGrid.innerHTML = ""

    amenities.forEach((amenity, index) => {
      const amenityElement = document.createElement("div")
      amenityElement.className = "amenity-item"
      amenityElement.style.animationDelay = `${index * 0.1}s`

      amenityElement.innerHTML = `
                <div class="amenity-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${amenity.icon}"></path>
                    </svg>
                </div>
                <span class="amenity-name">${amenity.name}</span>
            `

      amenitiesGrid.appendChild(amenityElement)
    })
  }

  populateNearbyLocations() {
    this.updateLocationContent(this.currentTab)
  }

  populateSimilarProperties() {
    const similarContainer = document.getElementById("similar-properties")
    const properties = [
      {
        title: "2BHK Apartment in Koramangala",
        rent: "25,000",
        area: "1200 sq.ft",
        image: "/placeholder.svg?height=120&width=200",
        rating: 4.2,
        badge: "New",
      },
      {
        title: "3BHK Villa in Whitefield",
        rent: "35,000",
        area: "1800 sq.ft",
        image: "/placeholder.svg?height=120&width=200",
        rating: 4.5,
        badge: "Popular",
      },
    ]

    similarContainer.innerHTML = ""

    properties.forEach((property, index) => {
      const propertyElement = document.createElement("div")
      propertyElement.className = "similar-item"
      propertyElement.style.animationDelay = `${index * 0.2}s`

      propertyElement.innerHTML = `
                <div class="similar-image">
                    <img src="${property.image}" alt="${property.title}" class="similar-img">
                    <div class="similar-badge">${property.badge}</div>
                </div>
                <div class="similar-content">
                    <h4 class="similar-name">${property.title}</h4>
                    <div class="similar-details">
                        <span class="similar-rent">₹${property.rent}</span>
                        <span class="similar-area">${property.area}</span>
                    </div>
                    <div class="similar-rating">
                        <span class="rating-stars">${this.generateStars(property.rating)}</span>
                        <span class="rating-text">${property.rating}</span>
                    </div>
                </div>
            `

      similarContainer.appendChild(propertyElement)
    })
  }

  updateActivityStats() {
    const stats = [{ selector: ".stat-value", values: ["1,234", "89", "156"] }]

    const statElements = document.querySelectorAll(".stat-value")
    const values = ["1,234", "89", "156"]

    statElements.forEach((element, index) => {
      if (values[index]) {
        this.animateNumber(element, values[index])
      }
    })
  }

  animateNumber(element, targetValue) {
    const numericValue = Number.parseInt(targetValue.replace(/,/g, ""))
    let currentValue = 0
    const increment = numericValue / 50

    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= numericValue) {
        currentValue = numericValue
        clearInterval(timer)
      }

      element.textContent = this.formatNumber(Math.floor(currentValue))
    }, 30)
  }

  formatNumber(num) {
    return num.toLocaleString()
  }

  // Description Methods
  toggleDescription() {
    const descriptionText = document.querySelector(".description-text")
    const readMoreBtn = document.getElementById("read-more-btn")

    if (descriptionText.classList.contains("expanded")) {
      descriptionText.classList.remove("expanded")
      readMoreBtn.textContent = "Read More"
    } else {
      descriptionText.classList.add("expanded")
      readMoreBtn.textContent = "Read Less"
    }
  }

  showAllAmenities() {
    const amenitiesGrid = document.getElementById("amenities-grid")
    const showAllBtn = document.getElementById("show-all-amenities")

    // Add more amenities
    const additionalAmenities = [
      { name: "Club House", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Play Area", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Power Backup", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { name: "Water Supply", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    ]

    additionalAmenities.forEach((amenity, index) => {
      const amenityElement = document.createElement("div")
      amenityElement.className = "amenity-item"
      amenityElement.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`

      amenityElement.innerHTML = `
                <div class="amenity-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${amenity.icon}"></path>
                    </svg>
                </div>
                <span class="amenity-name">${amenity.name}</span>
            `

      amenitiesGrid.appendChild(amenityElement)
    })

    showAllBtn.style.display = "none"
  }

  // Modal Methods
  showContactModal() {
    this.showNotification("Contact form would open here", "info")
    // In a real application, this would open a contact modal
  }

  showScheduleModal() {
    this.showNotification("Schedule visit form would open here", "info")
    // In a real application, this would open a schedule modal
  }

  // Utility Methods
  showLoading() {
    const loadingOverlay = document.getElementById("loading-overlay")
    if (loadingOverlay) {
      loadingOverlay.classList.add("active")
    }
  }

  hideLoading() {
    const loadingOverlay = document.getElementById("loading-overlay")
    if (loadingOverlay) {
      loadingOverlay.classList.remove("active")
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 24px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "600",
      zIndex: "10000",
      animation: "slideDown 0.3s ease-out",
      maxWidth: "300px",
    })

    // Set background color based on type
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    }

    notification.style.backgroundColor = colors[type] || colors.info

    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease-out"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  handleKeyboardNavigation(e) {
    switch (e.key) {
      case "ArrowLeft":
        if (e.target.closest(".gallery-container")) {
          e.preventDefault()
          this.previousImage()
        }
        break
      case "ArrowRight":
        if (e.target.closest(".gallery-container")) {
          e.preventDefault()
          this.nextImage()
        }
        break
      case "Escape":
        // Close any open modals
        const mobileMenu = document.getElementById("mobile-menu")
        if (mobileMenu && mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active")
        }
        break
    }
  }

  handleResize() {
    // Handle responsive behavior
    const mobileMenu = document.getElementById("mobile-menu")
    if (window.innerWidth > 768 && mobileMenu) {
      mobileMenu.classList.remove("active")
    }
  }

  handleScroll() {
    const header = document.querySelector("header")
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)"
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new RealEstateApp()
})

// Add CSS for notifications
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    .description-text.expanded {
        max-height: none !important;
        overflow: visible !important;
    }
    
    .description-text {
        max-height: 4.5em;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }
`

document.head.appendChild(notificationStyles)
