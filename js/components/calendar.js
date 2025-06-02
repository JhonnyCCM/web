class Calendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.currentDate = new Date()
    this.selectedDate = new Date()
    this.init()
  }

  init() {
    this.render()
    this.updateCurrentTime()
    // Actualizar cada minuto
    setInterval(() => this.updateCurrentTime(), 60000)
  }

  render() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()
    const today = new Date()

    // Primer día del mes y último día
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" onclick="calendar.previousMonth()">‹</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button class="calendar-nav" onclick="calendar.nextMonth()">›</button>
            </div>
            <div class="calendar-days-header">
                ${daysOfWeek.map((day) => `<div class="day-header">${day}</div>`).join("")}
            </div>
            <div class="calendar-grid">
        `

    // Generar 42 días (6 semanas)
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)

      const isCurrentMonth = currentDay.getMonth() === month
      const isToday = currentDay.toDateString() === today.toDateString()
      const isSelected = currentDay.toDateString() === this.selectedDate.toDateString()

      let dayClass = "calendar-day"
      if (!isCurrentMonth) dayClass += " other-month"
      if (isToday) dayClass += " today"
      if (isSelected) dayClass += " selected"

      calendarHTML += `
                <div class="${dayClass}" onclick="calendar.selectDate('${currentDay.toISOString()}')">
                    ${currentDay.getDate()}
                </div>
            `
    }

    calendarHTML += "</div>"
    this.container.innerHTML = calendarHTML
  }

  updateCurrentTime() {
    const now = new Date()
    const timeElement = document.getElementById("current-time")
    if (timeElement) {
      timeElement.textContent = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  selectDate(dateString) {
    this.selectedDate = new Date(dateString)
    this.render()

    // Disparar evento personalizado
    const event = new CustomEvent("dateSelected", {
      detail: { date: this.selectedDate },
    })
    document.dispatchEvent(event)
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.render()
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.render()
  }

  goToToday() {
    this.currentDate = new Date()
    this.selectedDate = new Date()
    this.render()
  }

  getSelectedDate() {
    return this.selectedDate
  }

  // Método para obtener eventos del día seleccionado
  getEventsForDate(date) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    return courses.filter((course) => {
      const courseDate = new Date(course.startDate)
      return courseDate.toDateString() === date.toDateString()
    })
  }
}

// Inicializar calendario cuando se carga la página
let calendar
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calendar-container")) {
    calendar = new Calendar("calendar-container")

    // Escuchar eventos de selección de fecha
    document.addEventListener("dateSelected", (e) => {
      console.log("Fecha seleccionada:", e.detail.date)
      // Aquí puedes agregar lógica adicional cuando se selecciona una fecha
    })
  }
})
