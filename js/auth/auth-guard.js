document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  const currentUser = localStorage.getItem("currentUser")

  if (!currentUser) {
    // Redirigir al login si no hay usuario autenticado
    window.location.href = "../index.html"
    return
  }

  const user = JSON.parse(currentUser)

  // Después de verificar currentUser, agregar:
  // Inicializar el sidebar si existe el contenedor
  if (document.getElementById("sidebarContainer")) {
    // Esperar a que el sidebar esté listo antes de aplicar la información del usuario
    window.addEventListener("sidebar:ready", () => {
      updateUserInfo(user)
    })
  } else {
    // Si no hay sidebar, actualizar directamente
    updateUserInfo(user)
  }

  // Configurar el botón de logout
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Eliminar la sesión del usuario
      localStorage.removeItem("currentUser")

      // Redirigir al login
      window.location.href = "../index.html"
    })
  }

  // Mover la lógica de actualización de UI a una función separada
  function updateUserInfo(user) {
    const profileName = document.querySelector(".header-profile-name")
    const profileAvatar = document.querySelector(".header-profile-avatar img")

    // También actualizar el nombre en el header de la página
    const userMenuName = document.querySelector(".user-menu span")

    if (profileName) {
      profileName.textContent = user.name
    }

    if (profileAvatar) {
      profileAvatar.src = user.avatar
      profileAvatar.alt = user.name
    }

    if (userMenuName) {
      userMenuName.textContent = user.name
    }
  }
})
