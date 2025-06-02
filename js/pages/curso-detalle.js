/**
 * Curso Detalle Page JavaScript
 * Maneja la funcionalidad de la página de detalle del curso
 */

class CourseDetailPage {
  constructor() {
    this.currentSection = null
    this.init()
  }

  init() {
    this.setupCurriculumToggle()
    this.setupVideoPreview()
    this.setupCourseActions()
    this.loadCourseProgress()
    this.setupSmoothScroll()
  }

  /**
   * Configurar toggle de secciones del curriculum
   */
  setupCurriculumToggle() {
    const sectionHeaders = document.querySelectorAll(".section-header")

    sectionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.parentElement
        const lessons = section.querySelector(".section-lessons")

        if (lessons.style.display === "none" || !lessons.style.display) {
          lessons.style.display = "block"
          header.style.background = "var(--bg-secondary)"
        } else {
          lessons.style.display = "none"
          header.style.background = "var(--bg-primary)"
        }
      })
    })

    // Expandir primera sección por defecto
    const firstSection = document.querySelector(".curriculum-section")
    if (firstSection) {
      const firstLessons = firstSection.querySelector(".section-lessons")
      firstLessons.style.display = "block"
    }
  }

  /**
   * Configurar preview del video
   */
  setupVideoPreview() {
    const playButton = document.querySelector(".play-button")

    if (playButton) {
      playButton.addEventListener("click", () => {
        // Aquí se podría abrir un modal con el video
        console.log("Reproducir video preview")
        this.showVideoModal()
      })
    }
  }

  /**
   * Mostrar modal de video (placeholder)
   */
  showVideoModal() {
    // Crear modal para video preview
    const modal = document.createElement("div")
    modal.className = "video-modal"
    modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="video-container">
                        <p>Video Preview - Aquí se reproduciría el video</p>
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    // Cerrar modal
    const closeButton = modal.querySelector(".modal-close")
    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Cerrar con backdrop
    const backdrop = modal.querySelector(".modal-backdrop")
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        document.body.removeChild(modal)
      }
    })
  }

  /**
   * Configurar acciones del curso
   */
  setupCourseActions() {
    const startButton = document.querySelector(".btn-primary")
    const previewButton = document.querySelector(".btn-secondary")
    const favoriteButton = document.querySelector(".btn-icon")

    if (startButton) {
      startButton.addEventListener("click", () => {
        // Redirigir al aula virtual
        window.location.href = "aula.html"
      })
    }

    if (previewButton) {
      previewButton.addEventListener("click", () => {
        this.showVideoModal()
      })
    }

    if (favoriteButton) {
      favoriteButton.addEventListener("click", (e) => {
        const button = e.target
        if (button.textContent === "❤️") {
          button.textContent = "💚"
          button.style.background = "rgba(34, 197, 94, 0.2)"
        } else {
          button.textContent = "❤️"
          button.style.background = "rgba(255, 255, 255, 0.2)"
        }
      })
    }
  }

  /**
   * Cargar progreso del curso
   */
  loadCourseProgress() {
    // Simular carga de progreso desde localStorage
    const progress = localStorage.getItem("course-progress") || "0"
    const progressBar = document.querySelector(".progress-fill")
    const progressText = document.querySelector(".progress-text")

    if (progressBar && progressText) {
      progressBar.style.width = `${progress}%`
      progressText.textContent = `${progress}% completado`
    }
  }

  /**
   * Configurar scroll suave para navegación interna
   */
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }
}

// CSS para el modal de video
const modalStyles = `
.video-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.modal-content {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-secondary);
}

.video-container {
    text-align: center;
    padding: 3rem;
    background: var(--bg-secondary);
    border-radius: 8px;
}
`

// Agregar estilos al head
const styleSheet = document.createElement("style")
styleSheet.textContent = modalStyles
document.head.appendChild(styleSheet)

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new CourseDetailPage()
})
