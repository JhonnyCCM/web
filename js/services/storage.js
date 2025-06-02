/**
 * Servicio para manejar el almacenamiento local de datos
 */
class StorageService {
  /**
   * Obtiene un elemento del localStorage
   * @param {string} key - Clave del elemento
   * @returns {any} - Elemento deserializado o null si no existe
   */
  static get(key) {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  /**
   * Guarda un elemento en localStorage
   * @param {string} key - Clave del elemento
   * @param {any} value - Valor a guardar
   */
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * Elimina un elemento del localStorage
   * @param {string} key - Clave del elemento a eliminar
   */
  static remove(key) {
    localStorage.removeItem(key)
  }

  /**
   * Obtiene todos los elementos de una colección
   * @param {string} collection - Nombre de la colección
   * @returns {Array} - Array de elementos o array vacío si no existe
   */
  static getAll(collection) {
    return this.get(collection) || []
  }

  /**
   * Obtiene un elemento por su ID de una colección
   * @param {string} collection - Nombre de la colección
   * @param {number|string} id - ID del elemento
   * @returns {any} - Elemento encontrado o null
   */
  static getById(collection, id) {
    const items = this.getAll(collection)
    return items.find((item) => item.id == id) || null
  }

  /**
   * Añade un elemento a una colección
   * @param {string} collection - Nombre de la colección
   * @param {any} item - Elemento a añadir
   * @returns {any} - Elemento añadido con ID generado
   */
  static add(collection, item) {
    const items = this.getAll(collection)

    // Generar ID único
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1

    const newItem = { ...item, id: newId }
    items.push(newItem)

    this.set(collection, items)
    return newItem
  }

  /**
   * Actualiza un elemento en una colección
   * @param {string} collection - Nombre de la colección
   * @param {number|string} id - ID del elemento
   * @param {any} updates - Actualizaciones a aplicar
   * @returns {any} - Elemento actualizado o null si no existe
   */
  static update(collection, id, updates) {
    const items = this.getAll(collection)
    const index = items.findIndex((item) => item.id == id)

    if (index === -1) return null

    const updatedItem = { ...items[index], ...updates }
    items[index] = updatedItem

    this.set(collection, items)
    return updatedItem
  }

  /**
   * Elimina un elemento de una colección
   * @param {string} collection - Nombre de la colección
   * @param {number|string} id - ID del elemento
   * @returns {boolean} - true si se eliminó, false si no existía
   */
  static delete(collection, id) {
    const items = this.getAll(collection)
    const initialLength = items.length

    const filteredItems = items.filter((item) => item.id != id)

    if (filteredItems.length === initialLength) {
      return false
    }

    this.set(collection, filteredItems)
    return true
  }

  /**
   * Inicializa una colección con datos si está vacía
   * @param {string} collection - Nombre de la colección
   * @param {Array} initialData - Datos iniciales
   */
  static initializeCollection(collection, initialData) {
    if (!this.get(collection)) {
      this.set(collection, initialData)
    }
  }
}
