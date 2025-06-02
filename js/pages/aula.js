class AulaManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.currentCourse = null
    this.currentLesson = null
    this.currentModule = null
    this.videoPlayer = null
    this.isPlaying = false
    this.currentTime = 0
    this.duration = 0
    this.notes = []
    this.activeTab = "video"

    this.init()
  }

  init() {
    this.loadCourseData()
    this.setupEventListeners()
    this.setupVideoPlayer()
    this.loadUserProgress()
    this.loadNotes()
    this.updateUserInfo()
  }

  loadCourseData() {
    // Obtener ID del curso desde URL o localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const courseId = urlParams.get("course") || localStorage.getItem("currentCourseId") || "course_1"

    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    this.currentCourse = courses.find((c) => c.id === courseId) || courses[0]

    if (!this.currentCourse) {
      window.location.href = "cursos.html"
      return
    }

    // Crear estructura de módulos y lecciones si no existe
    if (!this.currentCourse.modules) {
      this.currentCourse.modules = this.createDefaultModules()
    }

    this.renderCourseInfo()
    this.renderModules()
    this.loadFirstLesson()
  }

  createDefaultModules() {
    return [
      {
        id: "module_1",
        title: "Fundamentos de UI/UX",
        description: "Principios básicos del diseño de interfaces",
        lessons: [
          {
            id: "lesson_1_1",
            title: "Introducción a los Principios de Diseño",
            type: "video",
            duration: "12:45",
            videoUrl: "#",
            description: "En esta lección aprenderás los principios fundamentales del diseño UI/UX...",
            completed: false,
            resources: [
              { name: "Guía de Principios de Diseño.pdf", type: "pdf", size: "2.3 MB", url: "#" },
              { name: "Plantillas de Figma", type: "figma", size: "Archivo", url: "#" },
            ],
          },
          {
            id: "lesson_1_2",
            title: "Jerarquía Visual",
            type: "video",
            duration: "15:30",
            videoUrl: "#",
            description: "Aprende a crear jerarquías visuales efectivas...",
            completed: false,
            resources: [],
          },
          {
            id: "lesson_1_3",
            title: "Quiz: Principios Básicos",
            type: "quiz",
            duration: "10:00",
            description: "Evalúa tu comprensión de los principios básicos",
            completed: false,
            questions: 5,
          },
        ],
        completed: false,
      },
      {
        id: "module_2",
        title: "Diseño de Interfaces",
        description: "Creación de interfaces efectivas",
        lessons: [
          {
            id: "lesson_2_1",
            title: "Wireframes y Prototipos",
            type: "video",
            duration: "18:20",
            videoUrl: "#",
            description: "Aprende a crear wireframes y prototipos efectivos...",
            completed: false,
            resources: [],
          },
          {
            id: "lesson_2_2",
            title: "Sistemas de Diseño",
            type: "reading",
            duration: "25:00",
            description: "Comprende la importancia de los sistemas de diseño...",
            completed: false,
            resources: [],
          },
        ],
        completed: false,
      },
    ]
  }

  renderCourseInfo() {
    document.getElementById("courseBreadcrumb").textContent = this.currentCourse.title
    document.getElementById("courseTitle").textContent = this.currentCourse.title
    document.getElementById("courseSubtitle").textContent = "Versión Completa"

    // Calcular progreso
    const totalLessons = this.getTotalLessons()
    const completedLessons = this.getCompletedLessons()
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    document.getElementById("progressText").textContent = `${progress}% Completado`
    document.getElementById("progressFill").style.width = `${progress}%`
    document.getElementById("lessonsCompleted").textContent = completedLessons
    document.getElementById("totalLessons").textContent = totalLessons
  }

  renderModules() {
    const modulesList = document.getElementById("modulesList")
    if (!modulesList) return

    modulesList.innerHTML = this.currentCourse.modules
      .map((module) => {
        const completedLessons = module.lessons.filter((l) => l.completed).length
        const totalLessons = module.lessons.length
        const isExpanded = module.id === "module_1" // Expandir primer módulo por defecto

        return `
        <div class="module-group ${isExpanded ? "expanded" : ""}" data-module-id="${module.id}">
          <div class="module-header" onclick="aulaManager.toggleModule('${module.id}')">
            <h4 class="module-title">${module.title}</h4>
            <div class="module-meta">
              <span class="module-progress">${completedLessons}/${totalLessons}</span>
              <span class="module-toggle">▶</span>
            </div>
          </div>
          <div class="lessons-list">
            ${module.lessons.map((lesson) => this.createLessonItem(lesson, module.id)).join("")}
          </div>
        </div>
      `
      })
      .join("")
  }

  createLessonItem(lesson, moduleId) {
    const isActive = this.currentLesson && this.currentLesson.id === lesson.id
    const completedIcon = lesson.completed ? "✓" : ""

    return `
      <div class="lesson-item ${isActive ? "active" : ""} ${lesson.completed ? "completed" : ""}" 
           onclick="aulaManager.selectLesson('${lesson.id}', '${moduleId}')">
        <div class="lesson-checkbox">${completedIcon}</div>
        <div class="lesson-info">
          <h5 class="lesson-title">${lesson.title}</h5>
          <span class="lesson-duration">${lesson.duration}</span>
        </div>
        <div class="lesson-type ${lesson.type}">
          ${this.getLessonTypeIcon(lesson.type)}
        </div>
      </div>
    `
  }

  getLessonTypeIcon(type) {
    const icons = {
      video: "🎥",
      reading: "📖",
      quiz: "❓",
    }
    return icons[type] || "📚"
  }

  toggleModule(moduleId) {
    const moduleGroup = document.querySelector(`[data-module-id="${moduleId}"]`)
    if (moduleGroup) {
      moduleGroup.classList.toggle("expanded")
    }
  }

  selectLesson(lessonId, moduleId) {
    // Encontrar la lección
    const module = this.currentCourse.modules.find((m) => m.id === moduleId)
    const lesson = module?.lessons.find((l) => l.id === lessonId)

    if (!lesson) return

    this.currentLesson = lesson
    this.currentModule = module

    // Actualizar UI
    this.updateCurrentLessonUI()
    this.updateModuleInfo()
    this.loadLessonContent()

    // Actualizar elementos activos
    document.querySelectorAll(".lesson-item").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelector(`[onclick*="${lessonId}"]`)?.classList.add("active")
  }

  loadFirstLesson() {
    if (this.currentCourse.modules.length > 0 && this.currentCourse.modules[0].lessons.length > 0) {
      const firstModule = this.currentCourse.modules[0]
      const firstLesson = firstModule.lessons[0]
      this.selectLesson(firstLesson.id, firstModule.id)
    }
  }

  updateCurrentLessonUI() {
    if (!this.currentLesson) return

    document.getElementById("videoTitle").textContent = this.currentLesson.title
    document.getElementById("videoDuration").textContent = `Duración: ${this.currentLesson.duration}`
    document.getElementById("lessonDescription").textContent =
      this.currentLesson.description || "Descripción no disponible"

    // Actualizar recursos
    this.updateLessonResources()
  }

  updateModuleInfo() {
    if (!this.currentModule) return

    document.getElementById("currentModuleTitle").textContent = this.currentModule.title
    document.getElementById("moduleSubject").textContent = this.currentModule.description
    document.getElementById("moduleDuration").textContent = this.calculateModuleDuration()
    document.getElementById("moduleLessons").textContent = `${this.currentModule.lessons.length} lecciones`

    const completedLessons = this.currentModule.lessons.filter((l) => l.completed).length
    const totalLessons = this.currentModule.lessons.length
    const badge = completedLessons === totalLessons ? "Completado" : "En Progreso"
    document.getElementById("moduleBadge").textContent = badge
  }

  updateLessonResources() {
    const resourcesList = document.querySelector(".resources-list")
    if (!resourcesList || !this.currentLesson.resources) return

    resourcesList.innerHTML = this.currentLesson.resources
      .map(
        (resource) => `
      <a href="${resource.url}" class="resource-item" target="_blank">
        <span class="resource-icon">${this.getResourceIcon(resource.type)}</span>
        <span class="resource-name">${resource.name}</span>
        <span class="resource-size">${resource.size}</span>
      </a>
    `,
      )
      .join("")
  }

  getResourceIcon(type) {
    const icons = {
      pdf: "📄",
      figma: "🎨",
      video: "🎥",
      image: "🖼️",
      zip: "📦",
    }
    return icons[type] || "📎"
  }

  calculateModuleDuration() {
    if (!this.currentModule) return "0 min"

    const totalMinutes = this.currentModule.lessons.reduce((total, lesson) => {
      const [minutes, seconds] = lesson.duration.split(":").map(Number)
      return total + minutes + seconds / 60
    }, 0)

    return `${Math.round(totalMinutes)} min`
  }

  setupEventListeners() {
    // Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab
        this.switchTab(tabId)
      })
    })

    // Controles de video
    document.getElementById("playPauseBtn")?.addEventListener("click", () => this.togglePlayPause())
    document.getElementById("prevLessonBtn")?.addEventListener("click", () => this.previousLesson())
    document.getElementById("nextLessonBtn")?.addEventListener("click", () => this.nextLesson())
    document.getElementById("fullscreenBtn")?.addEventListener("click", () => this.toggleFullscreen())
    document.getElementById("speedBtn")?.addEventListener("click", () => this.changePlaybackSpeed())

    // Notas
    document.getElementById("addNoteBtn")?.addEventListener("click", () => this.showNoteEditor())
    document.getElementById("saveNoteBtn")?.addEventListener("click", () => this.saveNote())
    document.getElementById("cancelNoteBtn")?.addEventListener("click", () => this.hideNoteEditor())

    // Video progress
    const videoProgress = document.querySelector(".video-progress")
    if (videoProgress) {
      videoProgress.addEventListener("input", (e) => this.seekVideo(e.target.value))
    }

    // Volume control
    const volumeSlider = document.querySelector(".volume-slider")
    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => this.setVolume(e.target.value))
    }
  }

  setupVideoPlayer() {
    this.videoPlayer = document.querySelector(".video-player video")
    const playButton = document.getElementById("playButton")
    const videoOverlay = document.getElementById("videoOverlay")

    if (playButton) {
      playButton.addEventListener("click", () => this.playVideo())
    }

    if (this.videoPlayer) {
      this.videoPlayer.addEventListener("loadedmetadata", () => {
        this.duration = this.videoPlayer.duration
        this.updateTimeDisplay()
      })

      this.videoPlayer.addEventListener("timeupdate", () => {
        this.currentTime = this.videoPlayer.currentTime
        this.updateVideoProgress()
        this.updateTimeDisplay()
      })

      this.videoPlayer.addEventListener("ended", () => {
        this.onVideoEnded()
      })

      this.videoPlayer.addEventListener("play", () => {
        this.isPlaying = true
        this.updatePlayButton()
        videoOverlay?.classList.add("hidden")
      })

      this.videoPlayer.addEventListener("pause", () => {
        this.isPlaying = false
        this.updatePlayButton()
      })
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId

    // Actualizar botones de tab
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add("active")

    // Actualizar paneles
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.remove("active")
    })
    document.getElementById(`${tabId}Panel`)?.classList.add("active")

    // Cargar contenido específico del tab
    this.loadTabContent(tabId)
  }

  loadTabContent(tabId) {
    switch (tabId) {
      case "video":
        this.loadLessonContent()
        break
      case "materials":
        this.loadMaterials()
        break
      case "quiz":
        this.loadQuiz()
        break
      case "notes":
        this.loadNotes()
        break
    }
  }

  loadLessonContent() {
    if (!this.currentLesson || this.currentLesson.type !== "video") return

    // Simular carga de video
    if (this.videoPlayer) {
      this.videoPlayer.src = this.currentLesson.videoUrl || "#"
      this.videoPlayer.poster = "/placeholder.svg?height=400&width=700"
    }
  }

  loadMaterials() {
    // Los materiales ya se cargan en updateLessonResources()
    console.log("Materiales cargados")
  }

  loadQuiz() {
    if (!this.currentLesson || this.currentLesson.type !== "quiz") return

    const quizContent = document.querySelector(".quiz-content")
    if (quizContent) {
      const questionsCount = this.currentLesson.questions || 5
      quizContent.querySelector(".quiz-questions").textContent = `${questionsCount} preguntas`
    }
  }

  loadNotes() {
    const notesList = document.getElementById("notesList")
    if (!notesList) return

    const lessonNotes = this.notes.filter((note) => note.lessonId === this.currentLesson?.id)

    if (lessonNotes.length === 0) {
      notesList.innerHTML = `
        <div class="no-notes">
          <p>No tienes notas para esta lección aún.</p>
          <p>¡Agrega tu primera nota!</p>
        </div>
      `
      return
    }

    notesList.innerHTML = lessonNotes
      .map(
        (note) => `
      <div class="note-item" data-note-id="${note.id}">
        <div class="note-header">
          <span class="note-timestamp">${this.formatDate(note.timestamp)}</span>
          <div class="note-actions">
            <button class="note-action-btn" onclick="aulaManager.editNote('${note.id}')">✏️</button>
            <button class="note-action-btn" onclick="aulaManager.deleteNote('${note.id}')">🗑️</button>
          </div>
        </div>
        <div class="note-content">${note.content}</div>
      </div>
    `,
      )
      .join("")
  }

  // Controles de video
  playVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.play()
    }
  }

  togglePlayPause() {
    if (!this.videoPlayer) return

    if (this.isPlaying) {
      this.videoPlayer.pause()
    } else {
      this.videoPlayer.play()
    }
  }

  updatePlayButton() {
    const playPauseBtn = document.getElementById("playPauseBtn")
    if (playPauseBtn) {
      playPauseBtn.innerHTML = this.isPlaying ? "<span>⏸</span>" : "<span>▶</span>"
    }
  }

  updateVideoProgress() {
    const progressBar = document.querySelector(".video-progress")
    if (progressBar && this.duration > 0) {
      const progress = (this.currentTime / this.duration) * 100
      progressBar.value = progress
    }
  }

  updateTimeDisplay() {
    const currentTimeEl = document.getElementById("currentTime")
    const totalTimeEl = document.getElementById("totalTime")

    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.currentTime)
    }
    if (totalTimeEl) {
      totalTimeEl.textContent = this.formatTime(this.duration)
    }
  }

  seekVideo(value) {
    if (this.videoPlayer && this.duration > 0) {
      const newTime = (value / 100) * this.duration
      this.videoPlayer.currentTime = newTime
    }
  }

  setVolume(value) {
    if (this.videoPlayer) {
      this.videoPlayer.volume = value / 100
    }
  }

  changePlaybackSpeed() {
    if (!this.videoPlayer) return

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentSpeed = this.videoPlayer.playbackRate
    const currentIndex = speeds.indexOf(currentSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    const newSpeed = speeds[nextIndex]

    this.videoPlayer.playbackRate = newSpeed
    document.getElementById("speedBtn").textContent = `${newSpeed}x`
  }

  toggleFullscreen() {
    const videoContainer = document.querySelector(".video-container")
    if (!videoContainer) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoContainer.requestFullscreen()
    }
  }

  previousLesson() {
    const currentModuleIndex = this.currentCourse.modules.findIndex((m) => m.id === this.currentModule.id)
    const currentLessonIndex = this.currentModule.lessons.findIndex((l) => l.id === this.currentLesson.id)

    if (currentLessonIndex > 0) {
      // Lección anterior en el mismo módulo
      const prevLesson = this.currentModule.lessons[currentLessonIndex - 1]
      this.selectLesson(prevLesson.id, this.currentModule.id)
    } else if (currentModuleIndex > 0) {
      // Última lección del módulo anterior
      const prevModule = this.currentCourse.modules[currentModuleIndex - 1]
      const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
      this.selectLesson(lastLesson.id, prevModule.id)
    }
  }

  nextLesson() {
    const currentModuleIndex = this.currentCourse.modules.findIndex((m) => m.id === this.currentModule.id)
    const currentLessonIndex = this.currentModule.lessons.findIndex((l) => l.id === this.currentLesson.id)

    if (currentLessonIndex < this.currentModule.lessons.length - 1) {
      // Siguiente lección en el mismo módulo
      const nextLesson = this.currentModule.lessons[currentLessonIndex + 1]
      this.selectLesson(nextLesson.id, this.currentModule.id)
    } else if (currentModuleIndex < this.currentCourse.modules.length - 1) {
      // Primera lección del siguiente módulo
      const nextModule = this.currentCourse.modules[currentModuleIndex + 1]
      const firstLesson = nextModule.lessons[0]
      this.selectLesson(firstLesson.id, nextModule.id)
    }
  }

  onVideoEnded() {
    // Marcar lección como completada
    if (this.currentLesson) {
      this.markLessonCompleted(this.currentLesson.id)
    }

    // Avanzar automáticamente a la siguiente lección
    setTimeout(() => {
      this.nextLesson()
    }, 2000)
  }

  markLessonCompleted(lessonId) {
    // Actualizar en la estructura de datos
    this.currentCourse.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.id === lessonId) {
          lesson.completed = true
        }
      })
    })

    // Guardar en localStorage
    this.saveCourseProgress()

    // Actualizar UI
    this.renderModules()
    this.renderCourseInfo()
    this.updateStats()
  }

  // Gestión de notas
  showNoteEditor() {
    const noteEditor = document.getElementById("noteEditor")
    const addNoteBtn = document.getElementById("addNoteBtn")

    if (noteEditor && addNoteBtn) {
      noteEditor.style.display = "block"
      addNoteBtn.style.display = "none"
      document.getElementById("noteTextarea").focus()
    }
  }

  hideNoteEditor() {
    const noteEditor = document.getElementById("noteEditor")
    const addNoteBtn = document.getElementById("addNoteBtn")
    const textarea = document.getElementById("noteTextarea")

    if (noteEditor && addNoteBtn && textarea) {
      noteEditor.style.display = "none"
      addNoteBtn.style.display = "block"
      textarea.value = ""
    }
  }

  saveNote() {
    const textarea = document.getElementById("noteTextarea")
    const content = textarea?.value.trim()

    if (!content || !this.currentLesson) return

    const note = {
      id: `note_${Date.now()}`,
      lessonId: this.currentLesson.id,
      courseId: this.currentCourse.id,
      content: content,
      timestamp: new Date().toISOString(),
      videoTime: this.currentTime,
    }

    this.notes.push(note)
    this.saveNotes()
    this.loadNotes()
    this.hideNoteEditor()
    this.showNotification("Nota guardada exitosamente", "success")
  }

  editNote(noteId) {
    const note = this.notes.find((n) => n.id === noteId)
    if (!note) return

    const textarea = document.getElementById("noteTextarea")
    if (textarea) {
      textarea.value = note.content
      this.showNoteEditor()

      // Cambiar el botón de guardar para editar
      const saveBtn = document.getElementById("saveNoteBtn")
      if (saveBtn) {
        saveBtn.textContent = "Actualizar"
        saveBtn.onclick = () => this.updateNote(noteId)
      }
    }
  }

  updateNote(noteId) {
    const textarea = document.getElementById("noteTextarea")
    const content = textarea?.value.trim()

    if (!content) return

    const noteIndex = this.notes.findIndex((n) => n.id === noteId)
    if (noteIndex !== -1) {
      this.notes[noteIndex].content = content
      this.notes[noteIndex].timestamp = new Date().toISOString()
      this.saveNotes()
      this.loadNotes()
      this.hideNoteEditor()
      this.showNotification("Nota actualizada exitosamente", "success")

      // Restaurar botón de guardar
      const saveBtn = document.getElementById("saveNoteBtn")
      if (saveBtn) {
        saveBtn.textContent = "Guardar"
        saveBtn.onclick = () => this.saveNote()
      }
    }
  }

  deleteNote(noteId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      this.notes = this.notes.filter((n) => n.id !== noteId)
      this.saveNotes()
      this.loadNotes()
      this.showNotification("Nota eliminada", "info")
    }
  }

  // Utilidades
  getTotalLessons() {
    return this.currentCourse.modules.reduce((total, module) => total + module.lessons.length, 0)
  }

  getCompletedLessons() {
    return this.currentCourse.modules.reduce((total, module) => {
      return total + module.lessons.filter((l) => l.completed).length
    }, 0)
  }

  loadUserProgress() {
    const progress = JSON.parse(localStorage.getItem("courseProgress") || "{}")
    const courseProgress = progress[this.currentCourse.id]

    if (courseProgress) {
      // Aplicar progreso guardado
      this.currentCourse.modules.forEach((module) => {
        const moduleProgress = courseProgress.modules?.[module.id]
        if (moduleProgress) {
          module.lessons.forEach((lesson) => {
            if (moduleProgress.lessons?.[lesson.id]) {
              lesson.completed = moduleProgress.lessons[lesson.id].completed
            }
          })
        }
      })
    }

    this.updateStats()
  }

  saveCourseProgress() {
    const progress = JSON.parse(localStorage.getItem("courseProgress") || "{}")

    progress[this.currentCourse.id] = {
      modules: {},
    }

    this.currentCourse.modules.forEach((module) => {
      progress[this.currentCourse.id].modules[module.id] = {
        lessons: {},
      }

      module.lessons.forEach((lesson) => {
        progress[this.currentCourse.id].modules[module.id].lessons[lesson.id] = {
          completed: lesson.completed,
          lastAccessed: new Date().toISOString(),
        }
      })
    })

    localStorage.setItem("courseProgress", JSON.stringify(progress))
  }

  saveNotes() {
    localStorage.setItem("courseNotes", JSON.stringify(this.notes))
  }

  loadNotes() {
    this.notes = JSON.parse(localStorage.getItem("courseNotes") || "[]")
    if (this.activeTab === "notes") {
      this.loadNotes()
    }
  }

  updateStats() {
    const completedLessons = this.getCompletedLessons()
    const totalLessons = this.getTotalLessons()
    const score = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    document.getElementById("currentScore").textContent = `${score}%`
    document.getElementById("correctAnswers").textContent = `${completedLessons}/${totalLessons}`

    // Actualizar tiempo de estudio (simulado)
    const studyTime = this.calculateStudyTime()
    document.querySelector(".stat-value").textContent = studyTime
  }

  calculateStudyTime() {
    const completedLessons = this.getCompletedLessons()
    const avgLessonTime = 15 // minutos promedio por lección
    const totalMinutes = completedLessons * avgLessonTime
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  updateUserInfo() {
    const userNameElement = document.getElementById("userName")
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.fullName
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
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

// Funciones globales
function closeQuizModal() {
  document.getElementById("quizModal").style.display = "none"
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
  window.aulaManager = new AulaManager()
})

// Cleanup cuando se sale de la página
window.addEventListener("beforeunload", () => {
  if (window.aulaManager) {
    window.aulaManager.saveCourseProgress()
    window.aulaManager.saveNotes()
  }
})
