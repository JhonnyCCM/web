class InicioManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.currentSlide = 0
    this.totalSlides = 0
    this.autoSlideInterval = null
    this.init()
  }

  init() {
    this.loadFeaturedCourses()
    this.updateUserInfo()
    this.setupAnimations()
    this.loadUserStats()
    this.setupCarousel()
    this.startAutoSlide()
  }

  loadFeaturedCourses() {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const featuredCourses = courses.slice(0, 6) // Mostrar 6 cursos en el carrusel

    const carouselTrack = document.getElementById("carouselTrack")
    if (!carouselTrack) return

    if (featuredCourses.length === 0) {
      carouselTrack.innerHTML = `
        <div class="no-courses">
          <div class="no-courses-icon">📚</div>
          <h3>No hay cursos disponibles</h3>
          <p>Pronto tendremos cursos increíbles para ti.</p>
        </div>
      `
      return
    }

    carouselTrack.innerHTML = featuredCourses.map((course) => this.createCarouselCard(course)).join("")

    this.totalSlides = Math.ceil(featuredCourses.length / this.getVisibleSlides())
    this.createIndicators()
    this.updateCarousel()
  }

  createCarouselCard(course) {
    const discountBadge = course.discount ? `<div class="course-discount-badge">-${course.discount}%</div>` : ""

    const priceDisplay = course.originalPrice
      ? `
        <div class="carousel-price">
          <span class="carousel-original-price">$${course.originalPrice}</span>
          <span class="carousel-current-price">$${course.price}</span>
        </div>
      `
      : `
        <div class="carousel-price">
          <span class="carousel-current-price">$${course.price}</span>
        </div>
      `

    const stars = "★".repeat(Math.floor(course.rating))
    const halfStar = course.rating % 1 ? "☆" : ""

    return `
      <div class="carousel-course-card" onclick="inicioManager.viewCourse('${course.id}')">
        ${discountBadge}
        <div class="carousel-course-image">
          <img src="${course.image}" alt="${course.title}" loading="lazy">
        </div>
        <div class="carousel-course-content">
          <div class="carousel-course-header">
            <h3 class="carousel-course-title">${course.title}</h3>
            <div class="carousel-course-rating">
              <span class="rating-stars">${stars}${halfStar}</span>
              <span class="rating-number">${course.rating}</span>
            </div>
          </div>
          <p class="carousel-course-description">${course.description}</p>
          <div class="carousel-course-tags">
            ${course.tags.map((tag) => `<span class="carousel-course-tag">${tag}</span>`).join("")}
          </div>
          <div class="carousel-course-meta">
            <span>${course.duration}</span>
            <span>${course.level}</span>
          </div>
          <div class="carousel-course-footer">
            <div class="carousel-instructor">
              Instructor: <span class="carousel-instructor-name">${course.instructor}</span>
            </div>
            ${priceDisplay}
          </div>
          <div class="carousel-course-start">
            Inicio: ${this.formatDate(course.startDate)}
          </div>
        </div>
      </div>
    `
  }

  setupCarousel() {
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.prevSlide())
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextSlide())
    }

    // Touch/swipe support
    const carouselTrack = document.getElementById("carouselTrack")
    if (carouselTrack) {
      let startX = 0
      let currentX = 0
      let isDragging = false

      carouselTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX
        isDragging = true
        this.pauseAutoSlide()
      })

      carouselTrack.addEventListener("touchmove", (e) => {
        if (!isDragging) return
        currentX = e.touches[0].clientX
      })

      carouselTrack.addEventListener("touchend", () => {
        if (!isDragging) return
        isDragging = false

        const diff = startX - currentX
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.nextSlide()
          } else {
            this.prevSlide()
          }
        }

        this.startAutoSlide()
      })
    }
  }

  getVisibleSlides() {
    const width = window.innerWidth
    if (width < 480) return 1
    if (width < 768) return 1
    if (width < 1024) return 2
    return 3
  }

  createIndicators() {
    const indicatorsContainer = document.getElementById("carouselIndicators")
    if (!indicatorsContainer) return

    indicatorsContainer.innerHTML = ""
    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("div")
      indicator.className = `carousel-indicator ${i === 0 ? "active" : ""}`
      indicator.addEventListener("click", () => this.goToSlide(i))
      indicatorsContainer.appendChild(indicator)
    }
  }

  updateCarousel() {
    const carouselTrack = document.getElementById("carouselTrack")
    const indicators = document.querySelectorAll(".carousel-indicator")

    if (carouselTrack) {
      const slideWidth = 100 / this.getVisibleSlides()
      const translateX = -this.currentSlide * slideWidth
      carouselTrack.style.transform = `translateX(${translateX}%)`
    }

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide)
    })
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides
    this.updateCarousel()
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1
    this.updateCarousel()
  }

  goToSlide(index) {
    this.currentSlide = index
    this.updateCarousel()
    this.pauseAutoSlide()
    this.startAutoSlide()
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide()
    }, 5000) // Cambiar cada 5 segundos
  }

  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval)
      this.autoSlideInterval = null
    }
  }

  updateUserInfo() {
    const userNameElement = document.getElementById("userName")
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.fullName
    }
  }

  setupAnimations() {
    // Animación de entrada para las tarjetas
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observar elementos para animaciones
    document.querySelectorAll(".stat-card, .benefit-card, .testimonial-card").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = "all 0.6s ease"
      observer.observe(el)
    })

    // Animación de números contadores
    this.animateCounters()
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current))
      }, 16)
    })
  }

  loadUserStats() {
    // Simular carga de estadísticas del usuario
    const stats = {
      progress: 75,
      certificates: 3,
      studyTime: 24.5,
      streak: 12,
    }

    // Actualizar progreso
    const progressFill = document.querySelector(".progress-fill")
    if (progressFill) {
      setTimeout(() => {
        progressFill.style.width = `${stats.progress}%`
      }, 500)
    }
  }

  viewCourse(courseId) {
    // Redirigir a la página de cursos con el curso específico
    window.location.href = `cursos.html?course=${courseId}`
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  // Cleanup cuando se destruye la instancia
  destroy() {
    this.pauseAutoSlide()
  }
}

// Funciones globales
function showDemoVideo() {
  // Implementar modal de video demo
  alert("¡Próximamente! Video demo del curso.")
}

function toggleUserMenu() {
  console.log("Toggle user menu")
}

function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("rememberMe")
  window.location.href = "../index.html"
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  window.inicioManager = new InicioManager()
})

// Cleanup cuando se sale de la página
window.addEventListener("beforeunload", () => {
  if (window.inicioManager) {
    window.inicioManager.destroy()
  }
})

// Responsive carousel update
window.addEventListener("resize", () => {
  if (window.inicioManager) {
    const newTotalSlides = Math.ceil(6 / window.inicioManager.getVisibleSlides())
    if (newTotalSlides !== window.inicioManager.totalSlides) {
      window.inicioManager.totalSlides = newTotalSlides
      window.inicioManager.currentSlide = 0
      window.inicioManager.createIndicators()
      window.inicioManager.updateCarousel()
    }
  }
})
