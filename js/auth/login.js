class LoginManager {
  constructor() {
    this.form = document.getElementById("loginForm")
    this.forgotPasswordForm = document.getElementById("forgotPasswordForm")
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.checkExistingSession()
    this.createDemoUsers()
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleLogin(e))
    this.forgotPasswordForm.addEventListener("submit", (e) => this.handleForgotPassword(e))

    // Validación en tiempo real
    document.getElementById("email").addEventListener("blur", () => this.validateEmail())
    document.getElementById("password").addEventListener("blur", () => this.validatePassword())
  }

  createDemoUsers() {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    const demoUsers = [
      {
        id: "admin_demo",
        fullName: "Administrador Demo",
        email: "admin@courseconnect.com",
        password: "admin123",
        role: "admin",
        newsletter: false,
        createdAt: new Date().toISOString(),
        isActive: true,
        profile: {
          avatar: null,
          bio: "Administrador del sistema",
          courses: [],
          progress: {},
        },
      },
      {
        id: "student_demo",
        fullName: "Estudiante Demo",
        email: "estudiante@courseconnect.com",
        password: "student123",
        role: "student",
        newsletter: true,
        createdAt: new Date().toISOString(),
        isActive: true,
        profile: {
          avatar: null,
          bio: "Estudiante entusiasta",
          courses: ["course_1", "course_2"],
          progress: {},
        },
      },
      {
        id: "instructor_demo",
        fullName: "Instructor Demo",
        email: "instructor@courseconnect.com",
        password: "instructor123",
        role: "instructor",
        newsletter: true,
        createdAt: new Date().toISOString(),
        isActive: true,
        profile: {
          avatar: null,
          bio: "Instructor experimentado",
          courses: [],
          progress: {},
        },
      },
    ]

    // Solo agregar usuarios demo si no existen
    demoUsers.forEach((demoUser) => {
      if (!existingUsers.find((user) => user.email === demoUser.email)) {
        existingUsers.push(demoUser)
      }
    })

    localStorage.setItem("users", JSON.stringify(existingUsers))
  }

  checkExistingSession() {
    const currentUser = localStorage.getItem("currentUser")
    const rememberMe = localStorage.getItem("rememberMe") === "true"

    if (currentUser && rememberMe) {
      // Redirigir automáticamente si hay sesión guardada
      this.redirectToDashboard()
    }
  }

  async handleLogin(e) {
    e.preventDefault()

    if (!this.validateForm()) {
      return
    }

    const formData = new FormData(this.form)
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("rememberMe") === "on",
    }

    try {
      this.setLoading(true)
      await this.authenticateUser(loginData)
    } catch (error) {
      this.showError(error.message)
    } finally {
      this.setLoading(false)
    }
  }

  async authenticateUser(loginData) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === loginData.email && u.password === loginData.password)

    if (!user) {
      throw new Error("Credenciales incorrectas. Verifica tu email y contraseña.")
    }

    if (!user.isActive) {
      throw new Error("Tu cuenta ha sido desactivada. Contacta al administrador.")
    }

    // Guardar sesión
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("rememberMe", loginData.rememberMe.toString())

    // Actualizar última conexión
    user.lastLogin = new Date().toISOString()
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    this.showSuccess("¡Bienvenido de vuelta!")
    setTimeout(() => this.redirectToDashboard(), 1500)
  }

  async handleForgotPassword(e) {
    e.preventDefault()

    const email = document.getElementById("forgotEmail").value.trim()

    if (!email) {
      this.showFieldError(document.getElementById("forgotEmailError"), "El correo electrónico es requerido")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email)

    if (!user) {
      this.showFieldError(
        document.getElementById("forgotEmailError"),
        "No encontramos una cuenta con este correo electrónico",
      )
      return
    }

    // Simular envío de email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    this.showSuccess("Se han enviado las instrucciones a tu correo electrónico")
    this.hideForgotPassword()
  }

  validateForm() {
    let isValid = true

    isValid = this.validateEmail() && isValid
    isValid = this.validatePassword() && isValid

    return isValid
  }

  validateEmail() {
    const email = document.getElementById("email").value.trim()
    const errorElement = document.getElementById("emailError")

    if (!email) {
      this.showFieldError(errorElement, "El correo electrónico es requerido")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      this.showFieldError(errorElement, "Ingresa un correo electrónico válido")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  validatePassword() {
    const password = document.getElementById("password").value
    const errorElement = document.getElementById("passwordError")

    if (!password) {
      this.showFieldError(errorElement, "La contraseña es requerida")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  showFieldError(errorElement, message) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }

  clearFieldError(errorElement) {
    errorElement.textContent = ""
    errorElement.style.display = "none"
  }

  showError(message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-notification"
    errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-text">${message}</span>
            </div>
        `

    document.body.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.remove()
    }, 5000)
  }

  showSuccess(message) {
    const successDiv = document.createElement("div")
    successDiv.className = "success-notification"
    successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-text">${message}</span>
            </div>
        `

    document.body.appendChild(successDiv)

    setTimeout(() => {
      successDiv.remove()
    }, 3000)
  }

  setLoading(isLoading) {
    const btn = document.getElementById("loginBtn")

    if (isLoading) {
      btn.classList.add("loading")
      btn.disabled = true
    } else {
      btn.classList.remove("loading")
      btn.disabled = false
    }
  }

  redirectToDashboard() {
    window.location.href = "pages/cursos.html"
  }
}

// Funciones globales
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling

  if (input.type === "password") {
    input.type = "text"
    button.textContent = "🙈"
  } else {
    input.type = "password"
    button.textContent = "👁️"
  }
}

function fillDemoCredentials(userType) {
  const credentials = {
    admin: {
      email: "admin@courseconnect.com",
      password: "admin123",
    },
    student: {
      email: "estudiante@courseconnect.com",
      password: "student123",
    },
    instructor: {
      email: "instructor@courseconnect.com",
      password: "instructor123",
    },
  }

  const creds = credentials[userType]
  if (creds) {
    document.getElementById("email").value = creds.email
    document.getElementById("password").value = creds.password
  }
}

function showForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "flex"
}

function hideForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "none"
  document.getElementById("forgotPasswordForm").reset()
  document.getElementById("forgotEmailError").textContent = ""
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  new LoginManager()
})
