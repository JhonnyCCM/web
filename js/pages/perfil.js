/**
 * Profile Page JavaScript
 * Maneja la funcionalidad de la página de perfil
 */

class ProfilePage {
  constructor() {
    this.currentUser = null
    this.editModal = null
    this.profileData = {}
    this.init()
  }

  init() {
    this.loadCurrentUser()
    this.createProfileData()
    this.loadProfileData()
    this.setupEditProfile()
    this.setupPictureUpload()
    this.setupSkillsAnimation()
    this.setupGoalsInteraction()
    this.updateUserInfo()
  }

  /**
   * Cargar usuario actual desde localStorage
   */
  loadCurrentUser() {
    const currentUserData = localStorage.getItem("currentUser")
    if (currentUserData) {
      this.currentUser = JSON.parse(currentUserData)
    }
  }

  /**
   * Crear datos de perfil específicos para cada rol
   */
  createProfileData() {
    if (!this.currentUser) return

    const profileTemplates = {
      admin: {
        title: "Administrador del Sistema",
        bio: "Administrador del sistema con experiencia en gestión de plataformas educativas y coordinación de equipos de trabajo.",
        skills: [
          { name: "Gestión de Sistemas", level: 95 },
          { name: "Administración", level: 90 },
          { name: "Liderazgo", level: 85 },
          { name: "Análisis de Datos", level: 80 },
        ],
        stats: {
          courses: 25,
          hours: 320,
          certificates: 15,
        },
        activities: [
          {
            icon: "👥",
            title: "Usuarios gestionados",
            description: "Administración de 150+ usuarios activos",
            time: "hace 1 hora",
          },
          {
            icon: "📊",
            title: "Reporte generado",
            description: "Análisis mensual de rendimiento",
            time: "hace 3 horas",
          },
          {
            icon: "⚙️",
            title: "Sistema actualizado",
            description: "Actualización de seguridad implementada",
            time: "hace 1 día",
          },
        ],
        goals: [
          { icon: "🎯", text: "Optimizar rendimiento del sistema", status: "completed" },
          { icon: "📈", text: "Aumentar satisfacción de usuarios", status: "in-progress" },
          { icon: "🔒", text: "Implementar nuevas medidas de seguridad", status: "pending" },
        ],
        currentCourses: [
          
        ],
      },
      student: {
        title: "Estudiante de Tecnología",
        bio: "Estudiante apasionado por la tecnología y el desarrollo de software. Siempre buscando aprender nuevas herramientas y metodologías.",
        skills: [
          { name: "JavaScript", level: 70 },
          { name: "HTML/CSS", level: 85 },
          { name: "React", level: 60 },
          { name: "Node.js", level: 55 },
        ],
        stats: {
          courses: 8,
          hours: 156,
          certificates: 4,
        },
        activities: [
          {
            icon: "🏆",
            title: "Certificado completado",
            description: "JavaScript Fundamentals",
            time: "hace 2 días",
          },
          {
            icon: "📚",
            title: "Curso iniciado",
            description: "React Development",
            time: "hace 1 semana",
          },
          {
            icon: "✅",
            title: "Lección completada",
            description: "Introduction to APIs",
            time: "hace 1 semana",
          },
        ],
        goals: [
          { icon: "🎯", text: "Completar 3 cursos este mes", status: "in-progress" },
          { icon: "⏰", text: "Estudiar 20 horas por semana", status: "in-progress" },
          { icon: "🏆", text: "Obtener certificación en React", status: "pending" },
        ],
        currentCourses: [
         /** {
            title: "JavaScript Avanzado",
            progress: 65,
            thumbnail: "/placeholder.svg?height=60&width=40",
          },
          {
            title: "React Development",
            progress: 30,
            thumbnail: "/placeholder.svg?height=60&width=40",
          },**/
        ],
      },
      instructor: {
        title: "Instructor de Programación",
        bio: "Instructor experimentado en desarrollo de software con más de 5 años enseñando tecnologías web modernas.",
        skills: [
          { name: "Enseñanza", level: 95 },
          { name: "JavaScript", level: 90 },
          { name: "Python", level: 85 },
          { name: "Desarrollo Web", level: 88 },
        ],
        stats: {
          courses: 15,
          hours: 280,
          certificates: 12,
        },
        activities: [
          {
            icon: "👨‍🏫",
            title: "Clase impartida",
            description: "Advanced JavaScript Concepts",
            time: "hace 2 horas",
          },
          {
            icon: "📝",
            title: "Material actualizado",
            description: "Nuevos ejercicios de React",
            time: "hace 1 día",
          },
          {
            icon: "💬",
            title: "Feedback recibido",
            description: "Evaluación positiva de estudiantes",
            time: "hace 2 días",
          },
        ],
        goals: [
          { icon: "🎯", text: "Crear 2 cursos nuevos este trimestre", status: "in-progress" },
          { icon: "📊", text: "Mantener rating 4.8+ en cursos", status: "completed" },
          { icon: "👥", text: "Alcanzar 500 estudiantes", status: "in-progress" },
        ],
        currentCourses: [
          {
            title: "Metodologías de Enseñanza",
            progress: 80,
            thumbnail: "/placeholder.svg?height=60&width=40",
          },
          {
            title: "Nuevas Tecnologías Web",
            progress: 55,
            thumbnail: "/placeholder.svg?height=60&width=40",
          },
        ],
      },
    }

    this.profileData = profileTemplates[this.currentUser.role] || profileTemplates.student
  }

  /**
   * Cargar datos del perfil en la UI
   */
  loadProfileData() {
    if (!this.currentUser || !this.profileData) return

    // Actualizar información básica
    document.getElementById("profileName").textContent = this.currentUser.fullName
    document.getElementById("profileTitle").textContent = this.profileData.title
    document.getElementById("bio-text").textContent = this.profileData.bio

    // Actualizar estadísticas
    document.getElementById("statCourses").textContent = this.profileData.stats.courses
    document.getElementById("statHours").textContent = this.profileData.stats.hours
    document.getElementById("statCertificates").textContent = this.profileData.stats.certificates

    // Cargar habilidades
    this.loadSkills()

    // Cargar actividad reciente
    this.loadActivity()

    // Cargar certificados
    this.loadCertificates()

    // Cargar cursos actuales
    this.loadCurrentCourses()

    // Cargar metas
    this.loadGoals()

    // Cargar información de contacto
    this.loadContactInfo()

    // Cargar racha de estudio
    this.loadStudyStreak()
  }

  /**
   * Cargar habilidades
   */
  loadSkills() {
    const skillsContainer = document.getElementById("skillsContainer")
    if (!skillsContainer) return

    skillsContainer.innerHTML = this.profileData.skills
      .map(
        (skill) => `
      <div class="skill-item">
        <span class="skill-name">${skill.name}</span>
        <div class="skill-bar">
          <div class="skill-progress" style="width: ${skill.level}%"></div>
        </div>
        <span class="skill-level">${skill.level}%</span>
      </div>
    `,
      )
      .join("")
  }

  /**
   * Cargar actividad reciente
   */
  loadActivity() {
    const activityList = document.getElementById("activityList")
    if (!activityList) return

    activityList.innerHTML = this.profileData.activities
      .map(
        (activity) => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <p class="activity-title">${activity.title}</p>
          <p class="activity-description">${activity.description}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `,
      )
      .join("")
  }

  /**
   * Cargar certificados
   */
  loadCertificates() {
    const certificatesGrid = document.getElementById("certificatesGrid")
    if (!certificatesGrid) return

    const certificates = ["JavaScript Fundamentals", "Web Development Basics", "Advanced Programming"]

    certificatesGrid.innerHTML = certificates
      .map(
        (cert) => `
      <div class="certificate-card">
        <div class="certificate-icon">🏆</div>
        <h3>${cert}</h3>
        <p>Completado el ${new Date().toLocaleDateString()}</p>
        <button class="btn-download">📥 Descargar</button>
      </div>
    `,
      )
      .join("")
  }

  /**
   * Cargar cursos actuales
   */
  loadCurrentCourses() {
    const currentCourses = document.getElementById("currentCourses")
    if (!currentCourses) return

    currentCourses.innerHTML = this.profileData.currentCourses
      .map(
        (course) => `
      <div class="course-item">
        <div class="course-thumbnail">
          <img src="${course.thumbnail}" alt="Course">
        </div>
        <div class="course-info">
          <h4>${course.title}</h4>
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${course.progress}%"></div>
            </div>
            <span>${course.progress}%</span>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  /**
   * Cargar metas
   */
  loadGoals() {
    const goalsList = document.getElementById("goalsList")
    if (!goalsList) return

    const statusIcons = {
      completed: "✅",
      "in-progress": "🔄",
      pending: "⏳",
    }

    goalsList.innerHTML = this.profileData.goals
      .map(
        (goal) => `
      <div class="goal-item">
        <span class="goal-icon">${goal.icon}</span>
        <span class="goal-text">${goal.text}</span>
        <span class="goal-status ${goal.status}">${statusIcons[goal.status]}</span>
      </div>
    `,
      )
      .join("")
  }

  /**
   * Cargar información de contacto
   */
  loadContactInfo() {
    const contactInfo = document.getElementById("contactInfo")
    if (!contactInfo) return

    contactInfo.innerHTML = `
      <div class="contact-item">
        <span class="contact-icon">📧</span>
        <span class="contact-text">${this.currentUser.email}</span>
      </div>
      <div class="contact-item">
        <span class="contact-icon">📍</span>
        <span class="contact-text">Madrid, España</span>
      </div>
      <div class="contact-item">
        <span class="contact-icon">🌐</span>
        <span class="contact-text">linkedin.com/in/${this.currentUser.role}-demo</span>
      </div>
    `
  }

  /**
   * Cargar racha de estudio
   */
  loadStudyStreak() {
    const streakInfo = document.getElementById("streakInfo")
    if (!streakInfo) return

    streakInfo.innerHTML = `
      <div class="streak-number">🔥 15</div>
      <p>días consecutivos</p>
      <div class="streak-calendar">
        <div class="day active">L</div>
        <div class="day active">M</div>
        <div class="day active">X</div>
        <div class="day active">J</div>
        <div class="day active">V</div>
        <div class="day">S</div>
        <div class="day">D</div>
      </div>
    `
  }

  /**
   * Actualizar información del usuario en el header
   */
  updateUserInfo() {
    const userNameElement = document.getElementById("userName")
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.fullName
    }
  }

  /**
   * Configurar edición de perfil
   */
  setupEditProfile() {
    const editBtn = document.getElementById("edit-profile-btn")
    const editBioBtn = document.getElementById("edit-bio-btn")
    const modal = document.getElementById("edit-profile-modal")
    const closeBtn = modal.querySelector(".modal-close")
    const cancelBtn = document.getElementById("cancel-edit")
    const saveBtn = document.getElementById("save-profile")

    // Abrir modal
    editBtn.addEventListener("click", () => {
      this.openEditModal()
    })

    editBioBtn.addEventListener("click", () => {
      this.openEditModal()
      setTimeout(() => {
        document.getElementById("edit-bio").focus()
      }, 100)
    })

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
      this.closeEditModal()
    })

    cancelBtn.addEventListener("click", () => {
      this.closeEditModal()
    })

    // Cerrar con backdrop
    modal.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        this.closeEditModal()
      }
    })

    // Guardar cambios
    saveBtn.addEventListener("click", () => {
      this.saveProfile()
    })
  }

  /**
   * Abrir modal de edición
   */
  openEditModal() {
    const modal = document.getElementById("edit-profile-modal")

    // Llenar formulario con datos actuales
    document.getElementById("edit-name").value = this.currentUser.fullName
    document.getElementById("edit-title").value = this.profileData.title
    document.getElementById("edit-bio").value = this.profileData.bio
    document.getElementById("edit-email").value = this.currentUser.email
    document.getElementById("edit-location").value = "Madrid, España"
    document.getElementById("edit-linkedin").value = `linkedin.com/in/${this.currentUser.role}-demo`

    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  /**
   * Cerrar modal de edición
   */
  closeEditModal() {
    const modal = document.getElementById("edit-profile-modal")
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }

  /**
   * Guardar perfil
   */
  saveProfile() {
    const formData = {
      name: document.getElementById("edit-name").value,
      title: document.getElementById("edit-title").value,
      bio: document.getElementById("edit-bio").value,
      email: document.getElementById("edit-email").value,
      location: document.getElementById("edit-location").value,
      linkedin: document.getElementById("edit-linkedin").value,
    }

    // Actualizar datos locales
    this.profileData.title = formData.title
    this.profileData.bio = formData.bio

    // Actualizar DOM
    document.getElementById("profileName").textContent = formData.name
    document.getElementById("profileTitle").textContent = formData.title
    document.getElementById("bio-text").textContent = formData.bio

    // Cerrar modal
    this.closeEditModal()

    // Mostrar mensaje de éxito
    this.showToast("Perfil actualizado correctamente", "success")
  }

  /**
   * Configurar subida de foto de perfil
   */
  setupPictureUpload() {
    const changeBtn = document.querySelector(".change-picture-btn")

    changeBtn.addEventListener("click", () => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"

      input.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const profileImg = document.getElementById("profile-img")
            profileImg.src = e.target.result
            this.showToast("Foto de perfil actualizada", "success")
          }
          reader.readAsDataURL(file)
        }
      })

      input.click()
    })
  }

  /**
   * Configurar animación de skills
   */
  setupSkillsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll(".skill-progress")
          skillBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.transform = "scaleX(1)"
            }, index * 200)
          })
        }
      })
    })

    const skillsSection = document.querySelector(".skills-container")
    if (skillsSection) {
      const skillBars = skillsSection.querySelectorAll(".skill-progress")
      skillBars.forEach((bar) => {
        bar.style.transformOrigin = "left"
        bar.style.transform = "scaleX(0)"
        bar.style.transition = "transform 0.8s ease"
      })

      observer.observe(skillsSection)
    }
  }

  /**
   * Configurar interacción con metas
   */
  setupGoalsInteraction() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".goal-item")) {
        const goalItem = e.target.closest(".goal-item")
        const status = goalItem.querySelector(".goal-status")
        const currentClass = status.className.split(" ")[1]

        if (currentClass === "pending") {
          status.className = "goal-status in-progress"
          status.textContent = "🔄"
        } else if (currentClass === "in-progress") {
          status.className = "goal-status completed"
          status.textContent = "✅"
        } else {
          status.className = "goal-status pending"
          status.textContent = "⏳"
        }
      }
    })
  }

  /**
   * Mostrar toast de notificación
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: type === "success" ? "#10b981" : "#6366f1",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      zIndex: "1001",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    })

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
}

// Funciones globales
function toggleUserMenu() {
  console.log("Toggle user menu")
}

function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("rememberMe")
  window.location.href = "../index.html"
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new ProfilePage()
})
