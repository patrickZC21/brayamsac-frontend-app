# Guía para Generar APK de Android

## 📱 Configuración Completada

Tu aplicación React ya está configurada para generar una APK de Android usando Capacitor. Se han realizado las siguientes configuraciones:

### ✅ Configuraciones Implementadas:

1. **Capacitor Instalado y Configurado**
   - Plataforma Android agregada
   - Configuración de red para permitir HTTP
   - Detección automática de plataforma móvil

2. **Conectividad con Backend**
   - Configuración automática de URL del backend
   - Permisos de red configurados
   - Soporte para tráfico HTTP no cifrado

3. **Archivos Creados/Modificados**
   - `capacitor.config.json` - Configuración principal
   - `src/config/capacitor-config.js` - Detección de plataforma
   - `android/app/src/main/res/xml/network_security_config.xml` - Permisos de red
   - `android/app/src/main/AndroidManifest.xml` - Configuración de Android

## 🔧 Requisitos para Generar APK

### 1. Instalar Android Studio
- Descargar desde: https://developer.android.com/studio
- Instalar Android SDK
- Configurar variables de entorno ANDROID_HOME

### 2. Instalar Java Development Kit (JDK)
- JDK 11 o superior
- Configurar JAVA_HOME

## 🚀 Comandos para Generar APK

### Opción 1: APK de Debug (Desarrollo)
```bash
# 1. Construir la aplicación
npm run build

# 2. Sincronizar con Capacitor
npx cap sync

# 3. Abrir en Android Studio
npx cap open android

# 4. En Android Studio:
# - Build > Build Bundle(s) / APK(s) > Build APK(s)
# - La APK se generará en: android/app/build/outputs/apk/debug/
```

### Opción 2: APK Firmada (Producción)
```bash
# 1. Generar keystore (solo la primera vez)
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurar signing en android/app/build.gradle
# 3. Construir APK firmada desde Android Studio
```

### Opción 3: Usando Gradle (Línea de comandos)
```bash
# Desde el directorio android/
./gradlew assembleDebug
# o para release:
./gradlew assembleRelease
```

## 🌐 Configuración de Conectividad Backend

### Para Desarrollo Local:
- La app detecta automáticamente si está en móvil
- Usa `10.0.2.2:3000` para emulador Android
- Usa `localhost:3000` para web

### Para Producción:
1. Actualizar `src/config/capacitor-config.js`
2. Cambiar la URL del backend por la IP/dominio real
3. Asegurar que el backend esté accesible desde la red móvil

### Configuración de Red del Backend:
```javascript
// En capacitor-config.js, cambiar para producción:
return 'http://TU_IP_SERVIDOR:3000';
// o
return 'https://tu-dominio.com';
```

## 📋 Checklist Pre-Generación

- [ ] Backend ejecutándose y accesible
- [ ] Android Studio instalado
- [ ] JDK configurado
- [ ] `npm run build` ejecutado sin errores
- [ ] `npx cap sync` ejecutado sin errores
- [ ] Permisos de red configurados

## 🔍 Solución de Problemas

### Error de Conexión al Backend:
1. Verificar que el backend esté ejecutándose
2. Comprobar la IP del servidor en `capacitor-config.js`
3. Asegurar que el firewall permita conexiones al puerto 3000
4. Para emulador: usar `10.0.2.2` en lugar de `localhost`
5. Para dispositivo físico: usar la IP real de la máquina

### Error de Compilación:
1. Limpiar proyecto: `npx cap sync --force`
2. En Android Studio: Build > Clean Project
3. Verificar versiones de Android SDK

### Permisos de Red:
- Los archivos de configuración ya están creados
- Si hay problemas, verificar `network_security_config.xml`
- Asegurar que `usesCleartextTraffic="true"` esté en AndroidManifest.xml

## 📱 Instalación en Dispositivo

1. Habilitar "Fuentes desconocidas" en Android
2. Transferir APK al dispositivo
3. Instalar desde el explorador de archivos
4. Verificar conectividad con el backend

## 🔄 Flujo de Desarrollo

```bash
# Cada vez que hagas cambios:
1. npm run build
2. npx cap sync
3. npx cap open android (si necesitas recompilar)
```

---

**Nota**: La aplicación está completamente configurada. Solo necesitas Android Studio para generar la APK final.