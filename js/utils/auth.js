/**
 * Función global de logout
 */
function logout() {
  // Confirmar logout
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    // Eliminar la sesión del usuario
    localStorage.removeItem("currentUser")

    // Redirigir al login
    window.location.href = "../index.html"
  }
}

/**
 * Función para mostrar modal de descarga (placeholder)
 */
function showDownloadModal() {
  alert("Funcionalidad de descarga de app próximamente disponible")
}

// Hacer las funciones disponibles globalmente
window.logout = logout
window.showDownloadModal = showDownloadModal
