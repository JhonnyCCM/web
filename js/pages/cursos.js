class CursosManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.courses = []
    this.filteredCourses = []
    this.currentFilter = "all"
    this.searchTerm = ""
    this.editingCourseId = null
    this.courseToDelete = null
    this.calendar = undefined // Declare the calendar variable

    this.init()
  }

  init() {
    this.createInitialData()
    this.loadCourses()
    this.loadMentors()
    this.loadProgress()
    this.setupEventListeners()
    this.updateUserInfo()
    this.checkUserPermissions()
    this.initializeCalendar()
  }

  createInitialData() {
    const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")

    if (existingCourses.length === 0) {
      const initialCourses = [
        {
          id: "course_1",
          title: "UI/UX Designer",
          description: "Un curso online para aquellos que quieren profundizar en el diseño UI/UX",
          price: 1600,
          originalPrice: null,
          discount: null,
          image: "/placeholder.svg?height=200&width=300",
          category: "design",
          tags: ["UI/UX", "Web"],
          rating: 5.0,
          startDate: "2023-11-15",
          endDate: "2024-01-17",
          instructor: "John Wilson",
          students: 245,
          duration: "8 weeks",
          level: "Intermediate",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: "course_2",
          title: "Python from scratch",
          description: "Este curso proporciona una introducción completa al lenguaje de programación Python",
          price: 2000,
          originalPrice: 2400,
          discount: 17,
          image: "/placeholder.svg?height=200&width=300",
          category: "development",
          tags: ["Python", "Development"],
          rating: 4.7,
          startDate: "2023-11-15",
          endDate: "2024-01-30",
          instructor: "Sofia Harris",
          students: 189,
          duration: "10 weeks",
          level: "Beginner",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: "course_3",
          title: "Test Engineer",
          description: "El curso proporciona formación práctica en metodologías y técnicas de testing",
          price: 1800,
          originalPrice: null,
          discount: null,
          image: "/placeholder.svg?height=200&width=300",
          category: "engineering",
          tags: ["Engineering", "Testing"],
          rating: 4.1,
          startDate: "2024-01-05",
          endDate: "2024-02-15",
          instructor: "Daniel Hill",
          students: 156,
          duration: "6 weeks",
          level: "Advanced",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: "course_4",
          title: "Digital Marketing Mastery",
          description: "Aprende los fundamentos del marketing digital y haz crecer tu presencia online",
          price: 1200,
          originalPrice: 1500,
          discount: 20,
          image: "/placeholder.svg?height=200&width=300",
          category: "marketing",
          tags: ["Marketing", "Digital", "SEO"],
          rating: 4.8,
          startDate: "2023-12-01",
          endDate: "2024-01-15",
          instructor: "Eva Smith",
          students: 312,
          duration: "6 weeks",
          level: "Beginner",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: "course_5",
          title: "Brand Identity Design",
          description: "Crea identidades de marca convincentes que resuenen con tu audiencia objetivo",
          price: 1400,
          originalPrice: null,
          discount: null,
          image: "/placeholder.svg?height=200&width=300",
          category: "brand",
          tags: ["Brand", "Identity", "Design"],
          rating: 4.6,
          startDate: "2023-12-10",
          endDate: "2024-02-10",
          instructor: "John Wilson",
          students: 198,
          duration: "8 weeks",
          level: "Intermediate",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: "course_6",
          title: "Illustration Fundamentals",
          description: "Domina el arte de la ilustración digital con técnicas profesionales",
          price: 1100,
          originalPrice: null,
          discount: null,
          image: "/placeholder.svg?height=200&width=300",
          category: "illustration",
          tags: ["Illustration", "Digital Art", "Creative"],
          rating: 4.9,
          startDate: "2024-01-20",
          endDate: "2024-03-20",
          instructor: "Eva Smith",
          students: 267,
          duration: "9 weeks",
          level: "Beginner",
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ]

      localStorage.setItem("courses", JSON.stringify(initialCourses))
    }

    // Crear datos de mentores si no existen
    const existingMentors = JSON.parse(localStorage.getItem("mentors") || "[]")
    if (existingMentors.length === 0) {
      const initialMentors = [
        {
          id: "mentor_1",
          name: "John Wilson",
          role: "UI/UX Designer",
          experience: "6 yr",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.9,
          students: 245,
        },
        {
          id: "mentor_2",
          name: "Daniel Hill",
          role: "Test Engineer",
          experience: "5 yr",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.7,
          students: 189,
        },
        {
          id: "mentor_3",
          name: "Sofia Harris",
          role: "Python Developer",
          experience: "8 yr",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          students: 312,
        },
        {
          id: "mentor_4",
          name: "Eva Smith",
          role: "Motion Designer",
          experience: "4 yr",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.6,
          students: 198,
        },
      ]

      localStorage.setItem("mentors", JSON.stringify(initialMentors))
    }
  }

  setupEventListeners() {
    // Filtros de categoría
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => this.handleCategoryFilter(e))
    })

    // Búsqueda
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e))
    }

    // Formulario de curso
    const courseForm = document.getElementById("courseForm")
    if (courseForm) {
      courseForm.addEventListener("submit", (e) => this.handleCourseSubmit(e))
    }
  }

  loadCourses() {
    this.courses = JSON.parse(localStorage.getItem("courses") || "[]")
    this.filteredCourses = [...this.courses]
    this.renderCourses()
  }

  renderCourses() {
    const coursesGrid = document.getElementById("coursesGrid")
    if (!coursesGrid) return

    if (this.filteredCourses.length === 0) {
      coursesGrid.innerHTML = `
        <div class="no-courses">
          <div class="no-courses-icon">📚</div>
          <h3>No se encontraron cursos</h3>
          <p>No hay cursos disponibles para los filtros seleccionados.</p>
        </div>
      `
      return
    }

    coursesGrid.innerHTML = this.filteredCourses.map((course) => this.createCourseCard(course)).join("")
  }

  createCourseCard(course) {
    const discountBadge = course.discount ? `<div class="discount-badge">-${course.discount}%</div>` : ""

    const priceDisplay = course.originalPrice
      ? `
      <div class="price-container">
        <span class="original-price">$${course.originalPrice}</span>
        <span class="current-price">$${course.price}</span>
      </div>
    `
      : `
      <div class="price-container">
        <span class="current-price">$${course.price}</span>
      </div>
    `

    const stars = "★".repeat(Math.floor(course.rating)) + (course.rating % 1 ? "☆" : "")

    const actionButtons = this.canEditCourse()
      ? `
      <div class="course-actions">
        <button class="action-btn edit-btn" onclick="cursosManager.editCourse('${course.id}')" title="Editar">
          ✏️
        </button>
        <button class="action-btn delete-btn" onclick="cursosManager.deleteCourse('${course.id}')" title="Eliminar">
          🗑️
        </button>
      </div>
    `
      : ""

    return `
      <div class="course-card" data-category="${course.category}">
        ${discountBadge}
        ${actionButtons}
        <div class="course-image">
          <img src="${course.image}" alt="${course.title}" loading="lazy">
          <div class="course-overlay">
            <button class="view-course-btn" onclick="cursosManager.viewCourse('${course.id}')">
              Ver Curso
            </button>
          </div>
        </div>
        <div class="course-content">
          <div class="course-header">
            <h3 class="course-title">${course.title}</h3>
            <div class="course-rating">
              <span class="stars">${stars}</span>
              <span class="rating-value">${course.rating}</span>
            </div>
          </div>
          <p class="course-description">${course.description}</p>
          <div class="course-meta">
            <div class="course-tags">
              ${course.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <div class="course-info">
              <span class="course-duration">${course.duration}</span>
              <span class="course-level">${course.level}</span>
            </div>
          </div>
          <div class="course-footer">
            <div class="course-instructor">
              <span class="instructor-label">Instructor:</span>
              <span class="instructor-name">${course.instructor}</span>
            </div>
            ${priceDisplay}
          </div>
          <div class="course-dates">
            <span class="start-date">Inicio: ${this.formatDate(course.startDate)}</span>
          </div>
        </div>
      </div>
    `
  }

  handleCategoryFilter(e) {
    const category = e.target.dataset.category
    this.currentFilter = category

    // Actualizar UI de filtros
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active")
    })
    e.target.classList.add("active")

    this.applyFilters()
  }

  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase()
    this.applyFilters()
  }

  applyFilters() {
    this.filteredCourses = this.courses.filter((course) => {
      const matchesCategory = this.currentFilter === "all" || course.category === this.currentFilter
      const matchesSearch =
        !this.searchTerm ||
        course.title.toLowerCase().includes(this.searchTerm) ||
        course.description.toLowerCase().includes(this.searchTerm) ||
        course.tags.some((tag) => tag.toLowerCase().includes(this.searchTerm))

      return matchesCategory && matchesSearch && course.isActive
    })

    this.renderCourses()
  }

  loadMentors() {
    const mentors = JSON.parse(localStorage.getItem("mentors") || "[]")
    const mentorsList = document.getElementById("mentorsList")

    if (!mentorsList) return

    mentorsList.innerHTML = mentors
      .map(
        (mentor) => `
      <div class="mentor-item">
        <div class="mentor-avatar">
          <img src="${mentor.avatar}" alt="${mentor.name}">
        </div>
        <div class="mentor-info">
          <h4 class="mentor-name">${mentor.name}</h4>
          <p class="mentor-role">${mentor.role}</p>
          <span class="mentor-experience">Exp. ${mentor.experience}</span>
        </div>
      </div>
    `,
      )
      .join("")
  }

  loadProgress() {
    const progressList = document.getElementById("progressList")
    if (!progressList) return

    const progressData = [
      { name: "Python Developer", progress: 80, color: "#10b981" },
      { name: "Test Engineer", progress: 60, color: "#8b5cf6" },
      { name: "UI/UX Designer", progress: 45, color: "#f59e0b" },
    ]

    progressList.innerHTML = progressData
      .map(
        (item) => `
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-name">${item.name}</span>
          <span class="progress-percentage">${item.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${item.progress}%; background-color: ${item.color}"></div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  updateUserInfo() {
    const userNameElement = document.getElementById("userName")
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.fullName
    }
  }

  checkUserPermissions() {
    const addCourseBtn = document.getElementById("addCourseBtn")
    if (addCourseBtn) {
      const canAdd = this.canEditCourse()
      addCourseBtn.style.display = canAdd ? "flex" : "none"
    }
  }

  canEditCourse() {
    return this.currentUser && (this.currentUser.role === "admin" || this.currentUser.role === "instructor")
  }

  initializeCalendar() {
    if (typeof this.calendar !== "undefined" && document.getElementById("calendar-container")) {
      // El calendario ya está inicializado desde calendar.js
      console.log("Calendario ya inicializado")
    }
  }

  // CRUD Operations
  async handleCourseSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const courseData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number.parseInt(formData.get("price")),
      category: formData.get("category"),
      rating: Number.parseFloat(formData.get("rating")) || 4.0,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      image: formData.get("image") || "/placeholder.svg?height=200&width=300",
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim()),
      instructor: this.currentUser.fullName,
      students: 0,
      duration: this.calculateDuration(formData.get("startDate"), formData.get("endDate")),
      level: "Beginner",
      isActive: true,
    }

    try {
      if (this.editingCourseId) {
        await this.updateCourse(this.editingCourseId, courseData)
      } else {
        await this.createCourse(courseData)
      }

      this.closeCourseModal()
      this.loadCourses()
      this.showNotification("Curso guardado exitosamente", "success")
    } catch (error) {
      this.showNotification("Error al guardar el curso", "error")
    }
  }

  async createCourse(courseData) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const newCourse = {
      id: `course_${Date.now()}`,
      ...courseData,
      createdAt: new Date().toISOString(),
    }

    courses.push(newCourse)
    localStorage.setItem("courses", JSON.stringify(courses))
  }

  async updateCourse(courseId, courseData) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const courseIndex = courses.findIndex((c) => c.id === courseId)

    if (courseIndex !== -1) {
      courses[courseIndex] = {
        ...courses[courseIndex],
        ...courseData,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("courses", JSON.stringify(courses))
    }
  }

  editCourse(courseId) {
    const course = this.courses.find((c) => c.id === courseId)
    if (!course) return

    this.editingCourseId = courseId

    // Llenar el formulario
    document.getElementById("courseTitle").value = course.title
    document.getElementById("courseDescription").value = course.description
    document.getElementById("coursePrice").value = course.price
    document.getElementById("courseCategory").value = course.category
    document.getElementById("courseRating").value = course.rating
    document.getElementById("courseStartDate").value = course.startDate
    document.getElementById("courseEndDate").value = course.endDate
    document.getElementById("courseImage").value = course.image
    document.getElementById("courseTags").value = course.tags.join(", ")

    document.getElementById("modalTitle").textContent = "Editar Curso"
    document.getElementById("submitBtnText").textContent = "Actualizar Curso"

    this.openCourseModal()
  }

  deleteCourse(courseId) {
    this.courseToDelete = courseId
    document.getElementById("deleteModal").style.display = "flex"
  }

  confirmDelete() {
    if (!this.courseToDelete) return

    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const updatedCourses = courses.filter((c) => c.id !== this.courseToDelete)

    localStorage.setItem("courses", JSON.stringify(updatedCourses))

    this.closeDeleteModal()
    this.loadCourses()
    this.showNotification("Curso eliminado exitosamente", "success")
  }

  viewCourse(courseId) {
    const course = this.courses.find((c) => c.id === courseId)
    if (!course) return

    // Aquí podrías implementar una vista detallada del curso
    this.showNotification(`Viendo curso: ${course.title}`, "info")
  }

  // Modal Management
  openCourseModal() {
    document.getElementById("courseModal").style.display = "flex"
  }

  closeCourseModal() {
    document.getElementById("courseModal").style.display = "none"
    document.getElementById("courseForm").reset()
    this.editingCourseId = null
    document.getElementById("modalTitle").textContent = "Agregar Nuevo Curso"
    document.getElementById("submitBtnText").textContent = "Crear Curso"
  }

  closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none"
    this.courseToDelete = null
  }

  // Utility Functions
  calculateDuration(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} weeks`
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }
}

// Global Functions
function openCourseModal() {
  if (window.cursosManager) {
    window.cursosManager.openCourseModal()
  }
}

function closeCourseModal() {
  if (window.cursosManager) {
    window.cursosManager.closeCourseModal()
  }
}

function closeDeleteModal() {
  if (window.cursosManager) {
    window.cursosManager.closeDeleteModal()
  }
}

function confirmDelete() {
  if (window.cursosManager) {
    window.cursosManager.confirmDelete()
  }
}

function toggleUserMenu() {
  // Implementar menú de usuario
  console.log("Toggle user menu")
}

function showDownloadModal() {
  // Implementar modal de descarga
  console.log("Show download modal")
}

function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("rememberMe")
  window.location.href = "../index.html"
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cursosManager = new CursosManager()
})
