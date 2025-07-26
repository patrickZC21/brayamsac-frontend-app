@echo off
echo ========================================
echo    GENERADOR DE APK - Sistema Asistencias
echo ========================================
echo.

echo [1/4] Construyendo aplicacion React...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en la construccion de React
    pause
    exit /b 1
)
echo ✓ Construccion completada
echo.

echo [2/4] Sincronizando con Capacitor...
npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Fallo en la sincronizacion de Capacitor
    pause
    exit /b 1
)
echo ✓ Sincronizacion completada
echo.

echo [3/4] Verificando configuracion...
if not exist "android\app\build.gradle" (
    echo ERROR: Proyecto Android no encontrado
    echo Ejecuta: npx cap add android
    pause
    exit /b 1
)
echo ✓ Proyecto Android configurado
echo.

echo [4/4] Abriendo Android Studio...
npx cap open android
echo.
echo ========================================
echo    INSTRUCCIONES FINALES:
echo ========================================
echo 1. En Android Studio, espera a que termine la sincronizacion
echo 2. Ve a: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 3. La APK se generara en: android\app\build\outputs\apk\debug\
echo 4. Instala la APK en tu dispositivo Android
echo.
echo NOTA: Asegurate de que el backend este ejecutandose
echo       en el puerto 3000 antes de usar la app.
echo ========================================
pause