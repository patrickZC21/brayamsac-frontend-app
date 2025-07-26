# 🚀 Guía: Compilación Automática de APK con GitHub Actions

## ¿Qué es esto?

Esta solución permite **compilar automáticamente tu APK de Android en la nube** usando GitHub Actions, evitando completamente los problemas de configuración local de Java.

## 📋 Pasos para Implementar

### 1. Subir el Código a GitHub

```bash
# Desde la carpeta raíz del proyecto
git init
git add .
git commit -m "Initial commit - AsistenciasApp"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2. Activar GitHub Actions

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **"Actions"**
3. GitHub detectará automáticamente el workflow `build-android.yml`
4. Haz clic en **"I understand my workflows, go ahead and enable them"**

### 3. Ejecutar la Compilación

**Opción A: Automática**
- Cada vez que hagas `git push` se compilará automáticamente

**Opción B: Manual**
1. Ve a **Actions** → **Build Android APK**
2. Haz clic en **"Run workflow"**
3. Selecciona la rama `main`
4. Haz clic en **"Run workflow"**

### 4. Descargar el APK

**Método 1: Artifacts (Temporal)**
1. Ve a **Actions** → Selecciona la ejecución completada
2. Baja hasta **"Artifacts"**
3. Descarga `app-debug.zip`
4. Extrae el archivo `app-debug.apk`

**Método 2: Releases (Permanente)**
1. Ve a **Releases** en tu repositorio
2. Descarga el APK de la última release

## ⚡ Ventajas de esta Solución

✅ **Sin configuración local**: No necesitas instalar Android SDK ni Java
✅ **Automático**: Se compila solo cuando subes cambios
✅ **Gratuito**: GitHub Actions es gratis para repositorios públicos
✅ **Confiable**: Usa un entorno limpio cada vez
✅ **Versionado**: Cada compilación genera una release automática

## 🔧 Configuración del Workflow

El archivo `.github/workflows/build-android.yml` hace lo siguiente:

1. **Configura el entorno**: Ubuntu + Node.js 18 + Java 17 + Android SDK
2. **Instala dependencias**: `npm ci`
3. **Compila la web**: `npm run build`
4. **Añade Android**: `npx cap add android`
5. **Sincroniza**: `npx cap sync android`
6. **Compila APK**: `./gradlew assembleDebug`
7. **Sube el APK**: Como artifact y release

## 📱 Distribución del APK

### Para Usuarios Finales:

1. **WhatsApp/Telegram**: Envía el APK directamente
2. **Email**: Adjunta el archivo APK
3. **Servidor web**: Sube el APK a tu servidor
4. **QR Code**: Genera un QR que apunte al APK

### Instalación en Android:

1. Descarga el APK en el dispositivo
2. Ve a **Configuración** → **Seguridad**
3. Activa **"Fuentes desconocidas"** o **"Instalar apps desconocidas"**
4. Abre el APK descargado
5. Toca **"Instalar"**

## 🛠️ Solución de Problemas

### Si falla la compilación:

1. Ve a **Actions** → Selecciona la ejecución fallida
2. Revisa los logs para ver el error específico
3. Los errores más comunes:
   - **Dependencias**: Verifica `package.json`
   - **Build web**: Revisa errores de TypeScript/JavaScript
   - **Capacitor**: Verifica `capacitor.config.json`

### Si el APK no funciona:

1. Verifica que el backend esté funcionando
2. Revisa las variables de entorno en `.env.production`
3. Asegúrate de que la URL del API sea accesible desde móviles

## 🎯 Próximos Pasos

1. **Sube tu código a GitHub**
2. **Ejecuta el workflow**
3. **Descarga y prueba el APK**
4. **Distribuye a los usuarios**

¡Listo! Tendrás tu APK compilado automáticamente sin problemas de configuración local.