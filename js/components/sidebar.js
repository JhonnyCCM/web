/**
 * SidebarComponent - Componente modular para el sidebar
 * Permite cargar el sidebar en cualquier página y mantener el estado
 */
class SidebarComponent {
  constructor(options = {}) {
    this.options = {
      containerId: "sidebarContainer",
      activePage: this._getCurrentPage(),
      ...options,
    }

    this.isCollapsed = localStorage.getItem("sidebarCollapsed") === "true"
    this.sidebarElement = null
    this.mainContentElement = null
    this.toggleBtnElement = null
  }

  /**
   * Inicializa el componente
   */
  async init() {
    await this._loadTemplate()
    this._setupElements()
    this._renderNavItems()
    this._setupEventListeners()
    this._applySavedState()
    this._highlightActivePage()

    // Notificar que el sidebar está listo
    window.dispatchEvent(new CustomEvent("sidebar:ready"))

    return this
  }

  /**
   * Carga el template HTML del sidebar
   */
  async _loadTemplate() {
    try {
      const response = await fetch("../components/sidebar/sidebar.html")
      if (!response.ok) throw new Error("No se pudo cargar el template del sidebar")

      const html = await response.text()
      const container = document.getElementById(this.options.containerId)
      if (!container) throw new Error(`Contenedor #${this.options.containerId} no encontrado`)

      container.innerHTML = html
    } catch (error) {
      console.error("Error al cargar el sidebar:", error)
      // Fallback: Usar un template básico en línea
      const container = document.getElementById(this.options.containerId)
      if (container) {
        container.innerHTML = `
                    <aside class="sidebar" id="sidebar">
                        <button class="sidebar-toggle" id="sidebarToggle">◀</button>
                        <div class="sidebar-header">
                            <div class="logo">
                                <span class="logo-icon">📚</span>
                                <span class="logo-text">COURSECONNECT</span>
                            </div>
                        </div>
                        <nav class="sidebar-nav" id="sidebarNav"></nav>
                        <div class="sidebar-footer">
                            <button class="logout-btn" onclick="logout()">
                                <span class="logout-icon">🚪</span>
                                <span class="logout-text">Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>
                `
      }
    }
  }

  /**
   * Configura las referencias a los elementos del DOM
   */
  _setupElements() {
    this.sidebarElement = document.getElementById("sidebar")
    this.mainContentElement = document.getElementById("mainContent")
    this.toggleBtnElement = document.getElementById("sidebarToggle")
    this.navElement = document.getElementById("sidebarNav")
  }

  /**
   * Renderiza los elementos de navegación
   */
  _renderNavItems() {
    if (!this.navElement || !window.SIDEBAR_MENU) return

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || '{"role":"student"}')
    const userRole = currentUser.role || "student"

    const navItems = window.SIDEBAR_MENU.filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => this._createNavItem(item))
      .join("")

    this.navElement.innerHTML = navItems
  }

  /**
   * Crea un elemento de navegación HTML
   */
  _createNavItem(item) {
    const isActive = this._isActivePage(item.url)
    const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""

    return `
            <a href="${item.url}" class="nav-item tooltip ${isActive ? "active" : ""}" 
               data-id="${item.id}" data-tooltip="${item.text}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.text}</span>
                ${badge}
            </a>
        `
  }

  /**
   * Configura los event listeners
   */
  _setupEventListeners() {
    if (this.toggleBtnElement) {
      this.toggleBtnElement.addEventListener("click", () => this.toggleSidebar())
    }

    // Escuchar cambios de tamaño de ventana para modo responsive
    window.addEventListener("resize", () => this._handleResize())

    // Escuchar cuando el sidebar esté listo para aplicar el layout
    window.addEventListener("sidebar:ready", () => {
      this._applyLayoutAdjustments()
    })
  }

  /**
   * Aplica el estado guardado del sidebar
   */
  _applySavedState() {
    if (!this.sidebarElement || !this.mainContentElement || !this.toggleBtnElement) return

    if (this.isCollapsed) {
      this.sidebarElement.classList.add("collapsed")
      if (this.mainContentElement) {
        this.mainContentElement.classList.add("sidebar-collapsed")
      }
      this.toggleBtnElement.innerHTML = "▶"
      this.toggleBtnElement.title = "Expandir sidebar"
    } else {
      this.toggleBtnElement.innerHTML = "◀"
      this.toggleBtnElement.title = "Colapsar sidebar"
    }
  }

  /**
   * Resalta la página activa en el menú
   */
  _highlightActivePage() {
    const activePage = this.options.activePage
    if (!activePage) return

    document.querySelectorAll(".nav-item").forEach((item) => {
      const href = item.getAttribute("href")
      if (href && (href === activePage || href.includes(activePage))) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }

  /**
   * Obtiene la página actual basada en la URL
   */
  _getCurrentPage() {
    const path = window.location.pathname
    const page = path.split("/").pop() || "index.html"
    return page
  }

  /**
   * Verifica si una URL corresponde a la página activa
   */
  _isActivePage(url) {
    if (!url || url === "#") return false
    return url.includes(this.options.activePage)
  }

  /**
   * Maneja el cambio de tamaño de la ventana
   */
  _handleResize() {
    const isMobile = window.innerWidth < 768

    if (isMobile && !this.isCollapsed) {
      // En móvil, colapsar automáticamente
      this.setSidebarState(true, false)
    }
  }

  _applyLayoutAdjustments() {
    const mainContent = document.querySelector(".main-content")
    if (mainContent) {
      if (this.isCollapsed) {
        mainContent.classList.add("sidebar-collapsed")
      } else {
        mainContent.classList.remove("sidebar-collapsed")
      }
    }
  }

  /**
   * Alterna el estado del sidebar
   */
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed
    this.setSidebarState(this.isCollapsed)
  }

  /**
   * Establece el estado del sidebar
   */
  setSidebarState(collapsed, saveState = true) {
    if (!this.sidebarElement) return

    this.isCollapsed = collapsed

    if (collapsed) {
      this.sidebarElement.classList.add("collapsed")
      if (this.mainContentElement) {
        this.mainContentElement.classList.add("sidebar-collapsed")
      }
      if (this.toggleBtnElement) {
        this.toggleBtnElement.innerHTML = "▶"
        this.toggleBtnElement.title = "Expandir sidebar"
      }
    } else {
      this.sidebarElement.classList.remove("collapsed")
      if (this.mainContentElement) {
        this.mainContentElement.classList.remove("sidebar-collapsed")
      }
      if (this.toggleBtnElement) {
        this.toggleBtnElement.innerHTML = "◀"
        this.toggleBtnElement.title = "Colapsar sidebar"
      }
    }

    if (saveState) {
      localStorage.setItem("sidebarCollapsed", this.isCollapsed.toString())
    }

    this._applyLayoutAdjustments()

    // Disparar evento para que otros componentes puedan reaccionar
    window.dispatchEvent(
      new CustomEvent("sidebar:toggled", {
        detail: { collapsed: this.isCollapsed },
      }),
    )
  }

  /**
   * Obtiene el estado actual del sidebar
   */
  getSidebarState() {
    return this.isCollapsed
  }
}

// Hacer disponible globalmente
window.SidebarComponent = SidebarComponent

// Inicializar cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si existe el contenedor del sidebar
  if (document.getElementById("sidebarContainer")) {
    window.sidebarInstance = new SidebarComponent().init()
  }
})

// Función global para acceso rápido
function toggleSidebar() {
  if (window.sidebarInstance) {
    window.sidebarInstance.toggleSidebar()
  }
}
