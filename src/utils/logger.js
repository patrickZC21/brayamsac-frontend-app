// Utilidad de logging mejorada para la aplicación
import { LOG_CONFIG } from '../config/constants.js';

class Logger {
  constructor() {
    this.isDev = import.meta.env.DEV;
    this.isEnabled = this.isDev ? LOG_CONFIG.ENABLED_IN_DEV : LOG_CONFIG.ENABLED_IN_PROD;
  }

  // Método privado para formatear mensajes
  #formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const prefix = this.isDev ? `[${level.toUpperCase()}]` : `[${level.toUpperCase()}]`;
    
    if (Object.keys(context).length > 0) {
      return { prefix, timestamp, message, context };
    }
    return { prefix, timestamp, message };
  }

  // Método privado para determinar si debe loggear
  #shouldLog(level) {
    if (!this.isEnabled) return false;
    
    // En producción, solo errores críticos
    if (!this.isDev && level !== LOG_CONFIG.LEVELS.ERROR) {
      return false;
    }
    
    return true;
  }

  error(message, context = {}) {
    if (!this.#shouldLog(LOG_CONFIG.LEVELS.ERROR)) return;
    
    const formatted = this.#formatMessage(LOG_CONFIG.LEVELS.ERROR, message, context);
    console.error(formatted.prefix, formatted.message, formatted.context || '');
  }

  warn(message, context = {}) {
    if (!this.#shouldLog(LOG_CONFIG.LEVELS.WARN)) return;
    
    const formatted = this.#formatMessage(LOG_CONFIG.LEVELS.WARN, message, context);
    console.warn(formatted.prefix, formatted.message, formatted.context || '');
  }

  info(message, context = {}) {
    if (!this.#shouldLog(LOG_CONFIG.LEVELS.INFO)) return;
    
    const formatted = this.#formatMessage(LOG_CONFIG.LEVELS.INFO, message, context);
    console.info(formatted.prefix, formatted.message, formatted.context || '');
  }

  debug(message, context = {}) {
    if (!this.#shouldLog(LOG_CONFIG.LEVELS.DEBUG)) return;
    
    const formatted = this.#formatMessage(LOG_CONFIG.LEVELS.DEBUG, message, context);
    console.log(formatted.prefix, formatted.message, formatted.context || '');
  }

  // Métodos específicos para casos comunes
  apiRequest(method, url, data = null) {
    this.debug(`🌐 API ${method.toUpperCase()}`, { url, data });
  }

  apiResponse(status, url, data = null) {
    if (status >= 400) {
      this.error(`❌ API Error ${status}`, { url, data });
    } else {
      this.debug(`✅ API Success ${status}`, { url, data });
    }
  }

  userAction(action, details = {}) {
    this.info(`👤 User Action: ${action}`, details);
  }

  dataUpdate(type, details = {}) {
    this.debug(`🔄 Data Update: ${type}`, details);
  }

  notification(message, type = 'info') {
    this.info(`🔔 Notification [${type}]: ${message}`);
  }
}

// Exportar instancia singleton
export const logger = new Logger();

// Exportar también la clase para casos especiales
export { Logger };