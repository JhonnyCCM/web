/**
 * PerfilManager - Clase para gestionar la vista de perfil
 */
class PerfilManager {
  constructor() {
    // Referencias a elementos del DOM
    this.profileNameEl = document.getElementById("profileName")
    this.profileTitleEl = document.getElementById("profileTitle")
    this.bioTextEl = document.getElementById("bio-text")
    this.skillsContainerEl = document.getElementById("skillsContainer")
    this.activityListEl = document.getElementById("activityList")
    this.certificatesGridEl = document.getElementById("certificatesGrid")
    this.currentCoursesEl = document.getElementById("currentCourses")
    this.goalsListEl = document.getElementById("goalsList")
    this.streakInfoEl = document.getElementById("streakInfo")
    this.contactInfoEl = document.getElementById("contactInfo")
    this.userNameEl = document.getElementById("userName")

    // Modales
    this.editProfileBtn = document.getElementById("edit-profile-btn")
    this.editBioBtn = document.getElementById("edit-bio-btn")
    this.editProfileModal = document.getElementById("edit-profile-modal")
    this.cancelEditBtn = document.getElementById("cancel-edit")
    this.saveProfileBtn = document.getElementById("save-profile")

    // Estado
    this.userData = this.loadUserData()

    // Inicializar
    this.init()
  }

  /**
   * Inicializa la página
   */
  init() {
    this.updateUserInfo()
    this.setupEventListeners()
    this.renderProfileData()

    // Escuchar eventos del sidebar
    window.addEventListener("sidebar:toggled", (event) => {
      // Ajustar la vista cuando cambia el estado del sidebar
      this.adjustLayoutForSidebar(event.detail.collapsed)
    })

    // Inicializar el estado del sidebar
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true"
    this.adjustLayoutForSidebar(sidebarCollapsed)

    console.log("Perfil inicializado")
  }

  /**
   * Actualiza la información del usuario
   */
  updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (this.userNameEl && currentUser.name) {
      this.userNameEl.textContent = currentUser.name
    }
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Botones de edición
    if (this.editProfileBtn) {
      this.editProfileBtn.addEventListener("click", () => this.openEditProfileModal())
    }

    if (this.editBioBtn) {
      this.editBioBtn.addEventListener("click", () => this.openEditBioModal())
    }

    // Modales
    if (this.cancelEditBtn) {
      this.cancelEditBtn.addEventListener("click", () => this.closeEditProfileModal())
    }

    if (this.saveProfileBtn) {
      this.saveProfileBtn.addEventListener("click", () => this.saveProfileChanges())
    }

    // Cerrar modal con X
    const closeButtons = document.querySelectorAll(".modal-close")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeAllModals()
      })
    })
  }

  /**
   * Ajusta el layout cuando cambia el estado del sidebar
   */
  adjustLayoutForSidebar(collapsed) {
    // Aquí puedes ajustar elementos específicos si es necesario
    console.log("Sidebar collapsed:", collapsed)
  }

  /**
   * Carga los datos del usuario
   */
  loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const defaultData = {
      name: "Usuario",
      title: "Estudiante",
      bio: "No hay información disponible.",
      skills: [
        { name: "JavaScript", level: 75 },
        { name: "HTML & CSS", level: 90 },
        { name: "React", level: 60 },
        { name: "Node.js", level: 45 },
      ],
      activity: [],
      certificates: [],
      courses: [],
      goals: [],
      streak: 0,
      contact: {},
    }

    return { ...defaultData, ...currentUser }
  }

  /**
   * Renderiza los datos del perfil
   */
  renderProfileData() {
    // Información básica
    if (this.profileNameEl) this.profileNameEl.textContent = this.userData.name
    if (this.profileTitleEl) this.profileTitleEl.textContent = this.userData.title
    if (this.bioTextEl) this.bioTextEl.textContent = this.userData.bio

    // Habilidades
    this.renderSkills()

    // Actividad reciente
    this.renderActivity()

    // Certificados
    this.renderCertificates()

    // Cursos actuales
    this.renderCurrentCourses()

    // Metas de aprendizaje
    this.renderGoals()

    // Racha de estudio
    this.renderStreak()

    // Información de contacto
    this.renderContactInfo()
  }

  /**
   * Renderiza las habilidades
   */
  renderSkills() {
    if (!this.skillsContainerEl) return

    let html = ""
    this.userData.skills.forEach((skill) => {
      html += `
                <div class="skill-item">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                    <div class="skill-level">${skill.level}%</div>
                </div>
            `
    })

    this.skillsContainerEl.innerHTML = html
  }

  /**
   * Renderiza la actividad reciente
   */
  renderActivity() {
    if (!this.activityListEl) return

    if (this.userData.activity && this.userData.activity.length > 0) {
      let html = ""
      this.userData.activity.forEach((activity) => {
        html += `
                    <div class="activity-item">
                        <div class="activity-icon">${activity.icon || "📝"}</div>
                        <div class="activity-content">
                            <h4 class="activity-title">${activity.title}</h4>
                            <p class="activity-description">${activity.description}</p>
                            <span class="activity-time">${activity.time}</span>
                        </div>
                    </div>
                `
      })
      this.activityListEl.innerHTML = html
    } else {
      this.activityListEl.innerHTML = "<p>No hay actividad reciente.</p>"
    }
  }

  /**
   * Renderiza los certificados
   */
  renderCertificates() {
    if (!this.certificatesGridEl) return

    if (this.userData.certificates && this.userData.certificates.length > 0) {
      let html = ""
      this.userData.certificates.forEach((cert) => {
        html += `
                    <div class="certificate-card">
                        <div class="certificate-icon">🏆</div>
                        <h3>${cert.name}</h3>
                        <p>${cert.date}</p>
                        <button class="btn-download">Descargar</button>
                    </div>
                `
      })
      this.certificatesGridEl.innerHTML = html
    } else {
      this.certificatesGridEl.innerHTML = "<p>No hay certificados disponibles.</p>"
    }
  }

  /**
   * Renderiza los cursos actuales
   */
  renderCurrentCourses() {
    if (!this.currentCoursesEl) return

    if (this.userData.courses && this.userData.courses.length > 0) {
      let html = ""
      this.userData.courses.forEach((course) => {
        html += `
                    <div class="course-item">
                        <div class="course-thumbnail">
                            <img src="/placeholder.svg?height=40&width=60" alt="${course.name}">
                        </div>
                        <div class="course-info">
                            <h4>${course.name}</h4>
                            <div class="course-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                                </div>
                                <span>${course.progress}%</span>
                            </div>
                        </div>
                    </div>
                `
      })
      this.currentCoursesEl.innerHTML = html
    } else {
      this.currentCoursesEl.innerHTML = "<p>No estás inscrito en ningún curso.</p>"
    }
  }

  /**
   * Renderiza las metas de aprendizaje
   */
  renderGoals() {
    if (!this.goalsListEl) return

    if (this.userData.goals && this.userData.goals.length > 0) {
      let html = ""
      this.userData.goals.forEach((goal) => {
        let statusIcon = "⏳"
        let statusClass = "in-progress"

        if (goal.completed) {
          statusIcon = "✅"
          statusClass = "completed"
        } else if (goal.pending) {
          statusIcon = "⏰"
          statusClass = "pending"
        }

        html += `
                    <div class="goal-item">
                        <div class="goal-icon">${goal.icon || "🎯"}</div>
                        <div class="goal-text">${goal.text}</div>
                        <div class="goal-status ${statusClass}">${statusIcon}</div>
                    </div>
                `
      })
      this.goalsListEl.innerHTML = html
    } else {
      this.goalsListEl.innerHTML = "<p>No hay metas establecidas.</p>"
    }
  }

  /**
   * Renderiza la racha de estudio
   */
  renderStreak() {
    if (!this.streakInfoEl) return

    const streak = this.userData.streak || 0

    let html = `
            <div class="streak-number">${streak}</div>
            <p>días consecutivos de estudio</p>
            <div class="streak-calendar">
        `

    // Últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const isActive = i < streak % 7
      html += `<div class="day${isActive ? " active" : ""}">${7 - i}</div>`
    }

    html += "</div>"
    this.streakInfoEl.innerHTML = html
  }

  /**
   * Renderiza la información de contacto
   */
  renderContactInfo() {
    if (!this.contactInfoEl) return

    const contact = this.userData.contact || {}

    let html = ""

    if (contact.email) {
      html += `
                <div class="contact-item">
                    <div class="contact-icon">✉️</div>
                    <div class="contact-text">${contact.email}</div>
                </div>
            `
    }

    if (contact.phone) {
      html += `
                <div class="contact-item">
                    <div class="contact-icon">📱</div>
                    <div class="contact-text">${contact.phone}</div>
                </div>
            `
    }

    if (contact.location) {
      html += `
                <div class="contact-item">
                    <div class="contact-icon">📍</div>
                    <div class="contact-text">${contact.location}</div>
                </div>
            `
    }

    if (contact.linkedin) {
      html += `
                <div class="contact-item">
                    <div class="contact-icon">💼</div>
                    <div class="contact-text">${contact.linkedin}</div>
                </div>
            `
    }

    if (html === "") {
      html = "<p>No hay información de contacto disponible.</p>"
    }

    this.contactInfoEl.innerHTML = html
  }

  /**
   * Abre el modal de edición de perfil
   */
  openEditProfileModal() {
    if (!this.editProfileModal) return

    // Rellenar el formulario con los datos actuales
    document.getElementById("edit-name").value = this.userData.name || ""
    document.getElementById("edit-title").value = this.userData.title || ""
    document.getElementById("edit-bio").value = this.userData.bio || ""
    document.getElementById("edit-email").value = this.userData.contact?.email || ""
    document.getElementById("edit-location").value = this.userData.contact?.location || ""
    document.getElementById("edit-linkedin").value = this.userData.contact?.linkedin || ""

    this.editProfileModal.classList.add("active")
  }

  /**
   * Abre el modal de edición de biografía
   */
  openEditBioModal() {
    if (!this.editProfileModal) return

    // Rellenar solo el campo de biografía
    document.getElementById("edit-bio").value = this.userData.bio || ""

    this.editProfileModal.classList.add("active")
  }

  /**
   * Cierra el modal de edición de perfil
   */
  closeEditProfileModal() {
    if (!this.editProfileModal) return
    this.editProfileModal.classList.remove("active")
  }

  /**
   * Cierra todos los modales
   */
  closeAllModals() {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      modal.classList.remove("active")
    })
  }

  /**
   * Guarda los cambios del perfil
   */
  saveProfileChanges() {
    // Obtener los valores del formulario
    const name = document.getElementById("edit-name").value
    const title = document.getElementById("edit-title").value
    const bio = document.getElementById("edit-bio").value
    const email = document.getElementById("edit-email").value
    const location = document.getElementById("edit-location").value
    const linkedin = document.getElementById("edit-linkedin").value

    // Actualizar los datos del usuario
    this.userData.name = name
    this.userData.title = title
    this.userData.bio = bio

    if (!this.userData.contact) this.userData.contact = {}
    this.userData.contact.email = email
    this.userData.contact.location = location
    this.userData.contact.linkedin = linkedin

    // Guardar en localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const updatedUser = { ...currentUser, ...this.userData }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Actualizar la interfaz
    this.renderProfileData()
    this.updateUserInfo()

    // Cerrar el modal
    this.closeEditProfileModal()
  }
}

// Inicializar cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  window.perfilManager = new PerfilManager()
})

// Funciones globales para acceso desde HTML
function toggleUserMenu() {
  // Implementación del toggle del menú de usuario
  console.log("Toggle user menu")
}
