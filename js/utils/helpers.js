// Utilidades y funciones helper
class Helpers {
    // Generar ID único
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Formatear fecha
    static formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Formatear precio
    static formatPrice(price) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sanitizar HTML
    static sanitizeHtml(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Mostrar notificación
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            zIndex: '9999',
            maxWidth: '300px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        // Colores según el tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después del tiempo especificado
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Confirmar acción
    static async confirm(message, title = 'Confirmar') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-action="cancel">Cancelar</button>
                        <button class="btn btn-danger" data-action="confirm">Confirmar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'confirm') {
                    resolve(true);
                    modal.remove();
                } else if (e.target.dataset.action === 'cancel' || e.target === modal) {
                    resolve(false);
                    modal.remove();
                }
            });
        });
    }

    // Validar formulario
    static validateForm(formElement) {
        const errors = [];
        const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                errors.push(`El campo ${input.name || input.id} es requerido`);
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }

            // Validaciones específicas
            if (input.type === 'email' && input.value && !this.isValidEmail(input.value)) {
                errors.push('El email no tiene un formato válido');
                input.classList.add('error');
            }

            if (input.type === 'number' && input.value && isNaN(input.value)) {
                errors.push(`El campo ${input.name || input.id} debe ser un número`);
                input.classList.add('error');
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Crear elemento con atributos
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    // Cargar imagen con placeholder
    static loadImage(src, placeholder = '/placeholder.svg?height=200&width=300') {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(placeholder);
            img.src = src;
        });
    }
}

// Agregar estilos para errores de validación
const style = document.createElement('style');
style.textContent = `
    .form-input.error,
    .form-textarea.error,
    .form-select.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
`;
document.head.appendChild(style);
