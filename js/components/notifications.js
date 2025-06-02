/**
 * Sistema de Notificaciones
 * Maneja la ventana emergente de notificaciones
 */

class NotificationsManager {
  constructor() {
    this.notifications = this.loadNotifications()
    this.modal = null
    this.init()
  }

  init() {
    this.createModal()
    this.setupEventListeners()
  }

  loadNotifications() {
    // Cargar notificaciones del localStorage o usar datos por defecto
    const saved = localStorage.getItem("notifications")
    if (saved) {
      return JSON.parse(saved)
    }

    // Notificaciones por defecto
    return [
      {
        id: 1,
        title: "Nuevo curso disponible",
        message: "Se ha añadido el curso 'React Avanzado' a la plataforma",
        type: "info",
        time: "hace 2 horas",
        read: false,
        icon: "📚",
      },
      {
        id: 2,
        title: "Tarea pendiente",
        message: "Tienes una tarea pendiente en el curso de JavaScript",
        type: "warning",
        time: "hace 4 horas",
        read: false,
        icon: "⚠️",
      },
      {
        id: 3,
        title: "Certificado completado",
        message: "¡Felicidades! Has completado el curso de HTML & CSS",
        type: "success",
        time: "hace 1 día",
        read: true,
        icon: "🏆",
      },
      {
        id: 4,
        title: "Mantenimiento programado",
        message: "La plataforma estará en mantenimiento el domingo de 2-4 AM",
        type: "info",
        time: "hace 2 días",
        read: true,
        icon: "🔧",
      },
      {
        id: 5,
        title: "Nuevo instructor",
        message: "María García se ha unido como instructora de Data Science",
        type: "info",
        time: "hace 3 días",
        read: true,
        icon: "👩‍🏫",
      },
    ]
  }

  saveNotifications() {
    localStorage.setItem("notifications", JSON.stringify(this.notifications))
  }

  createModal() {
    // Crear el modal si no existe
    if (document.getElementById("notificationsModal")) return

    const modalHTML = `
      <div id="notificationsModal" class="modal-overlay" style="display: none;">
        <div class="modal-content notifications-modal">
          <div class="modal-header">
            <h3>Notificaciones</h3>
            <div class="header-actions">
              <button class="btn-text" onclick="notificationsManager.markAllAsRead()">Marcar todas como leídas</button>
              <button class="modal-close" onclick="closeNotificationsModal()">×</button>
            </div>
          </div>
          <div class="modal-body">
            <div class="notifications-list" id="notificationsList">
              <!-- Se cargará dinámicamente -->
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeNotificationsModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="notificationsManager.clearAll()">Limpiar todas</button>
          </div>
        </div>
      </div>
    `

    // Añadir estilos específicos para notificaciones
    const styles = `
      <style>
        .notifications-modal {
          width: 500px;
          max-width: 90vw;
          max-height: 80vh;
        }
        
        .notifications-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .btn-text {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }
        
        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 0;
        }
        
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .notification-item:hover {
          background-color: var(--bg-hover);
        }
        
        .notification-item.unread {
          background-color: rgba(59, 130, 246, 0.05);
          border-left: 3px solid var(--primary-color);
        }
        
        .notification-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .notification-message {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 5px;
        }
        
        .notification-time {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .notification-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .notification-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary-color);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .notification-type-success .notification-icon {
          color: #10b981;
        }
        
        .notification-type-warning .notification-icon {
          color: #f59e0b;
        }
        
        .notification-type-error .notification-icon {
          color: #ef4444;
        }
        
        .notification-type-info .notification-icon {
          color: #3b82f6;
        }
        
        .empty-notifications {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }
        
        .empty-notifications-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }
      </style>
    `

    document.head.insertAdjacentHTML("beforeend", styles)
    document.body.insertAdjacentHTML("beforeend", modalHTML)
    this.modal = document.getElementById("notificationsModal")
  }

  setupEventListeners() {
    // Cerrar modal al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (e.target.id === "notificationsModal") {
        this.closeModal()
      }
    })

    // Cerrar modal con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal && this.modal.style.display !== "none") {
        this.closeModal()
      }
    })
  }

  showModal() {
    if (!this.modal) this.createModal()
    this.renderNotifications()
    this.modal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = "none"
      document.body.style.overflow = ""
    }
  }

  renderNotifications() {
    const notificationsList = document.getElementById("notificationsList")
    if (!notificationsList) return

    if (this.notifications.length === 0) {
      notificationsList.innerHTML = `
        <div class="empty-notifications">
          <div class="empty-notifications-icon">🔔</div>
          <p>No tienes notificaciones</p>
        </div>
      `
      return
    }

    notificationsList.innerHTML = this.notifications
      .map(
        (notification) => `
      <div class="notification-item notification-type-${notification.type} ${!notification.read ? "unread" : ""}" 
           onclick="notificationsManager.toggleRead(${notification.id})">
        <div class="notification-icon">${notification.icon}</div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${notification.time}</div>
        </div>
        <div class="notification-actions">
          ${!notification.read ? '<div class="notification-dot"></div>' : ""}
        </div>
      </div>
    `,
      )
      .join("")
  }

  toggleRead(notificationId) {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = !notification.read
      this.saveNotifications()
      this.renderNotifications()
      this.updateBadge()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((notification) => {
      notification.read = true
    })
    this.saveNotifications()
    this.renderNotifications()
    this.updateBadge()
  }

  clearAll() {
    if (confirm("¿Estás seguro de que quieres eliminar todas las notificaciones?")) {
      this.notifications = []
      this.saveNotifications()
      this.renderNotifications()
      this.updateBadge()
    }
  }

  updateBadge() {
    const unreadCount = this.notifications.filter((n) => !n.read).length
    const badges = document.querySelectorAll(".notification-badge")

    badges.forEach((badge) => {
      if (unreadCount > 0) {
        badge.textContent = unreadCount
        badge.style.display = "inline-block"
      } else {
        badge.style.display = "none"
      }
    })
  }

  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      read: false,
      time: "ahora",
      ...notification,
    }

    this.notifications.unshift(newNotification)
    this.saveNotifications()
    this.updateBadge()
  }
}

// Inicializar el gestor de notificaciones
let notificationsManager

document.addEventListener("DOMContentLoaded", () => {
  notificationsManager = new NotificationsManager()
  notificationsManager.updateBadge()
})

// Funciones globales
function showNotificationsModal() {
  if (notificationsManager) {
    notificationsManager.showModal()
  }
}

function closeNotificationsModal() {
  if (notificationsManager) {
    notificationsManager.closeModal()
  }
}

// Hacer disponible globalmente
window.showNotificationsModal = showNotificationsModal
window.closeNotificationsModal = closeNotificationsModal
