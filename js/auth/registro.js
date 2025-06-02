class RegistroManager {
  constructor() {
    this.form = document.getElementById("registerForm")
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupPasswordStrength()
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))

    // Validación en tiempo real
    document.getElementById("email").addEventListener("blur", () => this.validateEmail())
    document.getElementById("password").addEventListener("input", () => this.validatePassword())
    document.getElementById("confirmPassword").addEventListener("blur", () => this.validatePasswordMatch())
    document.getElementById("fullName").addEventListener("blur", () => this.validateFullName())
    document.getElementById("terms").addEventListener("change", () => this.validateTerms())
  }

  setupPasswordStrength() {
    const passwordInput = document.getElementById("password")
    passwordInput.addEventListener("input", () => this.updatePasswordStrength())
  }

  async handleSubmit(e) {
    e.preventDefault()

    if (!this.validateForm()) {
      return
    }

    const formData = new FormData(this.form)
    const userData = {
      id: this.generateUserId(),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      newsletter: formData.get("newsletter") === "on",
      createdAt: new Date().toISOString(),
      isActive: true,
      profile: {
        avatar: null,
        bio: "",
        courses: [],
        progress: {},
      },
    }

    try {
      this.setLoading(true)
      await this.registerUser(userData)
      this.showSuccess()
    } catch (error) {
      this.showError(error.message)
    } finally {
      this.setLoading(false)
    }
  }

  async registerUser(userData) {
    // Verificar si el email ya existe
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    if (existingUsers.find((user) => user.email === userData.email)) {
      throw new Error("Este correo electrónico ya está registrado")
    }

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Guardar usuario
    existingUsers.push(userData)
    localStorage.setItem("users", JSON.stringify(existingUsers))

    // Crear datos iniciales del usuario
    this.createInitialUserData(userData.id)
  }

  createInitialUserData(userId) {
    // Crear progreso inicial
    const initialProgress = {
      [userId]: {
        "Python Developer": 0,
        "Test Engineer": 0,
        "UI/UX Designer": 0,
        completedCourses: 0,
        totalCourses: 0,
      },
    }

    const existingProgress = JSON.parse(localStorage.getItem("userProgress") || "{}")
    localStorage.setItem(
      "userProgress",
      JSON.stringify({
        ...existingProgress,
        ...initialProgress,
      }),
    )

    // Crear cursos favoritos vacíos
    const existingBookmarks = JSON.parse(localStorage.getItem("userBookmarks") || "{}")
    localStorage.setItem(
      "userBookmarks",
      JSON.stringify({
        ...existingBookmarks,
        [userId]: [],
      }),
    )
  }

  validateForm() {
    let isValid = true

    isValid = this.validateFullName() && isValid
    isValid = this.validateEmail() && isValid
    isValid = this.validatePassword() && isValid
    isValid = this.validatePasswordMatch() && isValid
    isValid = this.validateRole() && isValid
    isValid = this.validateTerms() && isValid

    return isValid
  }

  validateFullName() {
    const fullName = document.getElementById("fullName").value.trim()
    const errorElement = document.getElementById("fullNameError")

    if (!fullName) {
      this.showFieldError(errorElement, "El nombre completo es requerido")
      return false
    }

    if (fullName.length < 2) {
      this.showFieldError(errorElement, "El nombre debe tener al menos 2 caracteres")
      return false
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fullName)) {
      this.showFieldError(errorElement, "El nombre solo puede contener letras y espacios")
      return false
    }

    this.clearFieldError(errorElement)
    return true
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

    // Verificar si el email ya existe
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    if (existingUsers.find((user) => user.email === email)) {
      this.showFieldError(errorElement, "Este correo electrónico ya está registrado")
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

    if (password.length < 8) {
      this.showFieldError(errorElement, "La contraseña debe tener al menos 8 caracteres")
      return false
    }

    if (!/(?=.*[a-z])/.test(password)) {
      this.showFieldError(errorElement, "La contraseña debe contener al menos una letra minúscula")
      return false
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      this.showFieldError(errorElement, "La contraseña debe contener al menos una letra mayúscula")
      return false
    }

    if (!/(?=.*\d)/.test(password)) {
      this.showFieldError(errorElement, "La contraseña debe contener al menos un número")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  validatePasswordMatch() {
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const errorElement = document.getElementById("confirmPasswordError")

    if (!confirmPassword) {
      this.showFieldError(errorElement, "Confirma tu contraseña")
      return false
    }

    if (password !== confirmPassword) {
      this.showFieldError(errorElement, "Las contraseñas no coinciden")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  validateRole() {
    const role = document.getElementById("role").value
    const errorElement = document.getElementById("roleError")

    if (!role) {
      this.showFieldError(errorElement, "Selecciona tu tipo de usuario")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  validateTerms() {
    const terms = document.getElementById("terms").checked
    const errorElement = document.getElementById("termsError")

    if (!terms) {
      this.showFieldError(errorElement, "Debes aceptar los términos y condiciones")
      return false
    }

    this.clearFieldError(errorElement)
    return true
  }

  updatePasswordStrength() {
    const password = document.getElementById("password").value
    const strengthFill = document.getElementById("strengthFill")
    const strengthText = document.getElementById("strengthText")

    let strength = 0
    let strengthLabel = ""

    if (password.length >= 8) strength++
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*[A-Z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    if (/(?=.*[@$!%*?&])/.test(password)) strength++

    strengthFill.className = "strength-fill"

    switch (strength) {
      case 0:
      case 1:
        strengthFill.classList.add("weak")
        strengthLabel = "Muy débil"
        break
      case 2:
        strengthFill.classList.add("weak")
        strengthLabel = "Débil"
        break
      case 3:
        strengthFill.classList.add("fair")
        strengthLabel = "Regular"
        break
      case 4:
        strengthFill.classList.add("good")
        strengthLabel = "Buena"
        break
      case 5:
        strengthFill.classList.add("strong")
        strengthLabel = "Muy fuerte"
        break
    }

    strengthText.textContent = strengthLabel
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
    // Crear notificación de error
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

  showSuccess() {
    this.form.style.display = "none"
    document.getElementById("successMessage").style.display = "block"

    let countdown = 3
    const countdownElement = document.getElementById("countdown")

    const timer = setInterval(() => {
      countdown--
      countdownElement.textContent = countdown

      if (countdown <= 0) {
        clearInterval(timer)
        window.location.href = "../index.html"
      }
    }, 1000)
  }

  setLoading(isLoading) {
    const btn = document.getElementById("registerBtn")

    if (isLoading) {
      btn.classList.add("loading")
      btn.disabled = true
    } else {
      btn.classList.remove("loading")
      btn.disabled = false
    }
  }

  generateUserId() {
    return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }
}

// Función global para toggle de contraseña
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

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  new RegistroManager()
})
