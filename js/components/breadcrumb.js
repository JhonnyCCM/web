/**
 * Breadcrumb Component
 * Sistema de navegación jerárquica para mostrar la ubicación actual del usuario
 */
document.addEventListener("DOMContentLoaded", () => {
  // Configuración de rutas y jerarquías
  const routes = {
    "inicio.html": {
      title: "Inicio",
      parent: null,
    },
    "cursos.html": {
      title: "Cursos",
      parent: "inicio.html",
    },
    "panel.html": {
      title: "Panel",
      parent: "inicio.html",
    },
    "aula.html": {
      title: "Mi Clase",
      parent: "cursos.html",
      dynamicTitle: true, // El título puede cambiar dinámicamente
    },
  }

  // Obtener la página actual
  const currentPage = window.location.pathname.split("/").pop() || "inicio.html"

  // Si estamos en la página de aula, intentamos obtener el nombre del curso
  if (currentPage === "aula.html") {
    // Intentar obtener el curso de localStorage o parámetros de URL
    const courseId = new URLSearchParams(window.location.search).get("courseId")
    if (courseId) {
      // Aquí podríamos cargar el nombre del curso desde localStorage o una API
      const courses = JSON.parse(localStorage.getItem("courses") || "[]")
      const course = courses.find((c) => c.id === courseId)
      if (course) {
        // Actualizar el breadcrumb con el nombre del curso
        document.getElementById("courseBreadcrumb").textContent = course.title
      }
    }
  }

  // Función para actualizar dinámicamente el breadcrumb si es necesario
  window.updateBreadcrumb = (data) => {
    if (data.courseTitle && document.getElementById("courseBreadcrumb")) {
      document.getElementById("courseBreadcrumb").textContent = data.courseTitle
    }
  }
})
