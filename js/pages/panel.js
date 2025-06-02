class PanelManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.init()
  }

  init() {
    this.loadSchedule()
    this.loadLearningCards()
    this.loadHoursChart()
    this.loadAssignments()
    this.updateUserInfo()
  }

  loadSchedule() {
    const scheduleData = [
      {
        id: 1,
        title: "Social Media Marketing",
        category: "Digimar",
        time: "12:00 PM",
        type: "marketing",
      },
      {
        id: 2,
        title: "Campaign Planning",
        category: "Digimar",
        time: "12:00 PM",
        type: "planning",
      },
      {
        id: 3,
        title: "Figma para UI/UX",
        category: "UI/UX Design",
        time: "06:00 PM",
        type: "design",
      },
      {
        id: 4,
        title: "Account Management",
        category: "Sales & BD",
        time: "09:00 PM",
        type: "management",
      },
    ]

    const scheduleList = document.getElementById("scheduleList")
    if (!scheduleList) return

    scheduleList.innerHTML = scheduleData
      .map(
        (item) => `
      <div class="schedule-item">
        <div class="schedule-icon ${item.type}">
          ${this.getScheduleIcon(item.type)}
        </div>
        <div class="schedule-info">
          <div class="schedule-title">${item.title}</div>
          <div class="schedule-meta">
            <span>${item.category}</span>
            <span>${item.time}</span>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  loadLearningCards() {
    const learningData = [
      {
        hours: "100 hrs",
        subject: "Digital Marketing",
        type: "marketing",
      },
      {
        hours: "120 hrs",
        subject: "UI/UX Design",
        type: "design",
      },
      {
        hours: "104 hrs",
        subject: "Sales & BD",
        type: "sales",
      },
    ]

    const learningCards = document.getElementById("learningCards")
    if (!learningCards) return

    learningCards.innerHTML = learningData
      .map(
        (item) => `
      <div class="learning-card">
        <div class="learning-hours">${item.hours}</div>
        <div class="learning-subject">${item.subject}</div>
        <div class="learning-icon ${item.type}">
          ${this.getLearningIcon(item.type)}
        </div>
      </div>
    `,
      )
      .join("")
  }

  loadHoursChart() {
    const chartData = [
      { day: "Lun", uiDesign: 4, digitalMarketing: 2 },
      { day: "Mar", uiDesign: 3, digitalMarketing: 3 },
      { day: "Mié", uiDesign: 5, digitalMarketing: 2 },
      { day: "Jue", uiDesign: 6, digitalMarketing: 1 },
      { day: "Vie", uiDesign: 4, digitalMarketing: 3 },
      { day: "Sáb", uiDesign: 2, digitalMarketing: 4 },
      { day: "Dom", uiDesign: 3, digitalMarketing: 5 },
    ]

    const hoursChart = document.getElementById("hoursChart")
    if (!hoursChart) return

    const maxHours = 8

    hoursChart.innerHTML = chartData
      .map(
        (item) => `
      <div class="chart-bar">
        <div class="bar-container">
          <div class="bar ui-design" style="height: ${(item.uiDesign / maxHours) * 80}px"></div>
          <div class="bar digital-marketing" style="height: ${(item.digitalMarketing / maxHours) * 80}px"></div>
        </div>
        <div class="bar-day">${item.day}</div>
      </div>
    `,
      )
      .join("")
  }

  loadAssignments() {
    const assignmentsData = [
      {
        id: 1,
        name: "Targeting Audience",
        category: "Digital Marketing",
        total: "12/12",
        score: "100/100",
        status: "completed",
        type: "marketing",
      },
      {
        id: 2,
        name: "User Persona Research",
        category: "UI/UX Design",
        total: "12/12",
        score: "90/100",
        status: "completed",
        type: "design",
      },
      {
        id: 3,
        name: "Key Metrics & Strategies",
        category: "Sales & Business Development",
        total: "4/12",
        score: "40/100",
        status: "progress",
        type: "business",
      },
      {
        id: 4,
        name: "User Interface Design",
        category: "UI/UX Design",
        total: "3/12",
        score: "25/100",
        status: "progress",
        type: "design",
      },
    ]

    const assignmentsTable = document.getElementById("assignmentsTable")
    if (!assignmentsTable) return

    assignmentsTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombre de la Tarea</th>
            <th>Total de Tareas</th>
            <th>Puntuación Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${assignmentsData
            .map(
              (item) => `
            <tr class="assignment-row">
              <td class="assignment-number">${item.id}.</td>
              <td>
                <div class="assignment-info">
                  <div class="assignment-icon ${item.type}">
                    ${this.getAssignmentIcon(item.type)}
                  </div>
                  <div class="assignment-details">
                    <div class="assignment-name">${item.name}</div>
                    <div class="assignment-category">${item.category}</div>
                  </div>
                </div>
              </td>
              <td class="assignment-score">${item.total}</td>
              <td class="assignment-score">${item.score}</td>
              <td>
                <span class="assignment-status status-${item.status}">
                  ${item.status === "completed" ? "Completado" : "En Progreso"}
                </span>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
  }

  getScheduleIcon(type) {
    const icons = {
      marketing: "📱",
      planning: "📋",
      design: "🎨",
      management: "💼",
    }
    return icons[type] || "📚"
  }

  getLearningIcon(type) {
    const icons = {
      marketing: "📱",
      design: "🎨",
      sales: "💼",
    }
    return icons[type] || "📚"
  }

  getAssignmentIcon(type) {
    const icons = {
      marketing: "🎯",
      design: "🎨",
      business: "📊",
    }
    return icons[type] || "📚"
  }

  updateUserInfo() {
    const userNameElement = document.getElementById("userName")
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.fullName
    }
  }
}

// Global Functions
function toggleUserMenu() {
  console.log("Toggle user menu")
}

function showDownloadModal() {
  console.log("Show download modal")
}

function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("rememberMe")
  window.location.href = "../index.html"
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.panelManager = new PanelManager()
})
