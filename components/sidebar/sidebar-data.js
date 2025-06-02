/**
 * Configuración de los elementos del menú del sidebar
 * Cada elemento puede tener:
 * - id: Identificador único
 * - text: Texto a mostrar
 * - icon: Emoji o icono
 * - url: URL de destino
 * - roles: Array de roles que pueden ver este elemento (opcional)
 * - badge: Número o texto para mostrar como badge (opcional)
 * - children: Submenús (opcional)
 * - section: Sección del menú (main, user, admin)
 */
const SIDEBAR_MENU = [
  // Navegación principal
  {
    id: "home",
    text: "Inicio",
    icon: "🏠",
    url: "inicio.html",
    section: "main",
    roles: ["admin", "student", "instructor"],
  },
  {
    id: "dashboard",
    text: "Panel",
    icon: "📊",
    url: "panel.html",
    section: "main",
    roles: ["admin", "instructor"],
  },
  {
    id: "courses",
    text: "Cursos",
    icon: "📚",
    url: "cursos.html",
    section: "main",
    roles: ["admin", "student", "instructor"],
    badge: "12", // Ejemplo de badge
  },
  {
    id: "classroom",
    text: "Aula Virtual",
    icon: "📝",
    url: "aula.html",
    section: "main",
    roles: ["admin", "student", "instructor"],
  },
  {
    id: "schedule",
    text: "Cronograma",
    icon: "📅",
    url: "cronograma.html",
    section: "main",
    roles: ["admin", "student", "instructor"],
  },

  // Sección de usuario
  {
    id: "profile",
    text: "Mi Perfil",
    icon: "👤",
    url: "perfil.html",
    section: "user",
    roles: ["admin", "student", "instructor"],
  },
  {
    id: "notifications",
    text: "Notificaciones",
    icon: "🔔",
    url: "javascript:showNotificationsModal();",
    section: "user",
    roles: ["admin", "student", "instructor"],
    badge: "3", // Notificaciones pendientes
  },
  {
    id: "settings",
    text: "Configuración",
    icon: "⚙️",
    url: "configuracion.html",
    section: "user",
    roles: ["admin", "student", "instructor"],
  },

  // Sección administrativa
  {
    id: "users",
    text: "Usuarios",
    icon: "👥",
    url: "usuarios.html",
    section: "admin",
    roles: ["admin"],
    children: [
      {
        id: "students",
        text: "Estudiantes",
        icon: "🎓",
        url: "estudiantes.html",
        roles: ["admin"],
      },
      {
        id: "instructors",
        text: "Instructores",
        icon: "👨‍🏫",
        url: "instructores.html",
        roles: ["admin"],
      },
    ],
  },

]

// Funciones auxiliares para filtrar el menú
const SIDEBAR_UTILS = {
  /**
   * Filtra los elementos del menú por rol de usuario
   * @param {string} userRole - Rol del usuario actual
   * @returns {Array} Elementos del menú filtrados
   */
  getMenuByRole(userRole) {
    return SIDEBAR_MENU.filter((item) => !item.roles || item.roles.includes(userRole)).map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter((child) => !child.roles || child.roles.includes(userRole))
        : undefined,
    }))
  },

  /**
   * Obtiene elementos del menú por sección
   * @param {string} section - Sección del menú (main, user, admin)
   * @param {string} userRole - Rol del usuario actual
   * @returns {Array} Elementos de la sección filtrados
   */
  getMenuBySection(section, userRole) {
    return this.getMenuByRole(userRole).filter((item) => item.section === section)
  },

  /**
   * Obtiene el elemento activo basado en la URL actual
   * @param {string} currentUrl - URL actual
   * @returns {Object|null} Elemento activo o null
   */
  getActiveItem(currentUrl) {
    for (const item of SIDEBAR_MENU) {
      if (item.url === currentUrl) {
        return item
      }
      if (item.children) {
        const activeChild = item.children.find((child) => child.url === currentUrl)
        if (activeChild) {
          return { parent: item, child: activeChild }
        }
      }
    }
    return null
  },

  /**
   * Estructura organizada por secciones (para compatibilidad)
   */
  getOrganizedMenu(userRole) {
    return {
      mainNav: this.getMenuBySection("main", userRole),
      userNav: this.getMenuBySection("user", userRole),
      adminNav: this.getMenuBySection("admin", userRole),
    }
  },
}

// Exportar la configuración
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SIDEBAR_MENU, SIDEBAR_UTILS }
} else {
  // Para uso en navegador
  window.SIDEBAR_MENU = SIDEBAR_MENU
  window.SIDEBAR_UTILS = SIDEBAR_UTILS
}
