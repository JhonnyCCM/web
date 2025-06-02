/**
 * Cronograma Page JavaScript
 * Siguiendo el mismo patrón que cursos.js
 */

class CronogramaManager {
  constructor() {
    // Referencias a elementos del DOM
    this.calendarGrid = document.getElementById("calendarGrid")
    this.miniCalendarGrid = document.getElementById("miniCalendarGrid")
    this.currentPeriodEl = document.getElementById("currentPeriod")
    this.miniMonthEl = document.getElementById("miniMonth")
    this.addEventBtn = document.getElementById("addEventBtn")
    this.eventModal = document.getElementById("eventModal")
    this.closeModalBtn = document.getElementById("closeModal")
    this.eventForm = document.getElementById("eventForm")
    this.saveBtn = document.getElementById("saveBtn")
    this.cancelBtn = document.getElementById("cancelBtn")
    this.deleteBtn = document.getElementById("deleteBtn")
    this.userNameEl = document.getElementById("userName")

    // Estado
    this.currentDate = new Date()
    this.selectedDate = new Date()
    this.events = this.loadEvents()
    this.editingEventId = null
    this.viewMode = "week" // 'day', 'week', 'month'

    // Inicializar
    this.init()
  }

  /**
   * Inicializa la página
   */
  init() {
    this.updateUserInfo()
    this.setupEventListeners()
    this.renderMiniCalendar()
    this.renderCalendarGrid()
    this.updateStats()

    // Escuchar eventos del sidebar
    window.addEventListener("sidebar:toggled", (event) => {
      // Ajustar la vista cuando cambia el estado del sidebar
      this.adjustLayoutForSidebar(event.detail.collapsed)
    })

    // Inicializar el estado del sidebar
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true"
    this.adjustLayoutForSidebar(sidebarCollapsed)

    console.log("Cronograma inicializado")
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
    // Navegación del calendario
    document.getElementById("miniPrevBtn").addEventListener("click", () => this.navigateMonth(-1))
    document.getElementById("miniNextBtn").addEventListener("click", () => this.navigateMonth(1))

    // Botones de vista
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setViewMode(btn.dataset.view)
      })
    })

    // Modal de eventos
    this.addEventBtn.addEventListener("click", () => this.openEventModal())
    this.closeModalBtn.addEventListener("click", () => this.closeEventModal())
    this.cancelBtn.addEventListener("click", () => this.closeEventModal())

    // Formulario de eventos
    this.eventForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.saveEvent()
    })

    this.saveBtn.addEventListener("click", () => {
      this.eventForm.dispatchEvent(new Event("submit"))
    })

    this.deleteBtn.addEventListener("click", () => {
      this.deleteEvent()
    })

    // Filtros de calendario
    document.querySelectorAll("[data-calendar]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.filterEvents()
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
   * Carga los eventos del almacenamiento local
   */
  loadEvents() {
    const events = JSON.parse(localStorage.getItem("calendarEvents") || "[]")
    return events
  }

  /**
   * Guarda los eventos en el almacenamiento local
   */
  saveEvents() {
    localStorage.setItem("calendarEvents", JSON.stringify(this.events))
  }

  /**
   * Renderiza el mini calendario
   */
  renderMiniCalendar() {
    // Implementación del mini calendario
    // ...
  }

  /**
   * Renderiza la cuadrícula principal del calendario
   */
  renderCalendarGrid() {
    // Implementación de la cuadrícula del calendario
    // ...
  }

  /**
   * Actualiza las estadísticas
   */
  updateStats() {
    // Actualizar contadores de eventos
    const todayCount = document.getElementById("todayCount")
    const weekCount = document.getElementById("weekCount")
    const monthCount = document.getElementById("monthCount")

    if (todayCount) todayCount.textContent = this.countEventsToday()
    if (weekCount) weekCount.textContent = this.countEventsThisWeek()
    if (monthCount) monthCount.textContent = this.countEventsThisMonth()
  }

  /**
   * Cuenta los eventos de hoy
   */
  countEventsToday() {
    // Implementación del conteo de eventos
    return 2
  }

  /**
   * Cuenta los eventos de esta semana
   */
  countEventsThisWeek() {
    // Implementación del conteo de eventos
    return 8
  }

  /**
   * Cuenta los eventos de este mes
   */
  countEventsThisMonth() {
    // Implementación del conteo de eventos
    return 15
  }

  /**
   * Navega entre meses
   */
  navigateMonth(direction) {
    // Implementación de la navegación entre meses
    // ...
  }

  /**
   * Establece el modo de vista
   */
  setViewMode(mode) {
    // Implementación del cambio de modo de vista
    // ...
  }

  /**
   * Abre el modal para crear/editar un evento
   */
  openEventModal(eventId = null) {
    // Implementación para abrir el modal
    this.eventModal.classList.add("active")
  }

  /**
   * Cierra el modal de eventos
   */
  closeEventModal() {
    // Implementación para cerrar el modal
    this.eventModal.classList.remove("active")
  }

  /**
   * Guarda un evento
   */
  saveEvent() {
    // Implementación para guardar un evento
    // ...
    this.closeEventModal()
  }

  /**
   * Elimina un evento
   */
  deleteEvent() {
    // Implementación para eliminar un evento
    // ...
    this.closeEventModal()
  }

  /**
   * Filtra los eventos según las casillas marcadas
   */
  filterEvents() {
    // Implementación para filtrar eventos
    // ...
  }
}

// Inicializar cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  window.cronogramaManager = new CronogramaManager()
})

// Funciones globales para acceso desde HTML
function toggleUserMenu() {
  // Implementación del toggle del menú de usuario
  console.log("Toggle user menu")
}

function closeEventModal() {
  if (window.cronogramaManager) {
    window.cronogramaManager.closeEventModal()
  }
}
