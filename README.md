# 📱 App Coordinadores - Asistencias Brayamsac

## 🎯 **Propósito**
Aplicación simplificada para coordinadores en campo, optimizada para registro rápido de asistencias en dispositivos móviles.

## 👥 **Usuarios Objetivo**
- **Coordinadores de almacén** en terreno
- **Uso móvil/tablet** optimizado
- **Registro rápido** de asistencias

## 🚀 **Características Principales**
- ✅ **Interfaz simplificada** para uso en campo
- ✅ **Flujo optimizado**: Almacén → Subalmacén → Fechas → Asistencias
- ✅ **Responsive design** para móviles
- ✅ **Login rápido** con credenciales coordinador
- ✅ **Registro eficiente** de asistencias por fecha

## 📱 **Páginas Implementadas**
- `/` - Login simplificado
- `/dashboard` - Dashboard básico con navegación
- `/subalmacenes` - Lista de subalmacenes asignados
- `/subalmacenes/:id/fechas` - Fechas de asistencia
- `/asistencias/:subalmacenId/:fecha` - Registro de asistencias

## 🛠️ **Stack Tecnológico**
- **React 18** con Vite
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos

## 🚀 **Desarrollo Local**

### **Prerrequisitos**
```bash
Node.js 18+
npm o yarn
Backend corriendo en puerto 3000
```

### **Instalación**
```bash
cd frontend-App
npm install
npm run dev
```

### **Variables de Entorno**
```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production  
VITE_API_URL=https://api.tudominio.com
```

## 📦 **Build y Deployment**

### **Build Local**
```bash
npm run build
npm run preview
```

### **Deployment a AWS S3**
```bash
# Build para producción
npm run build

# Subir a S3
aws s3 sync dist/ s3://app-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## 🎯 **Diferencias con Frontend/**

| Característica | frontend-App/ | Frontend/ |
|---------------|---------------|-----------|
| **Audiencia** | Solo coordinadores | Admin, RRHH, Coordinadores |
| **Interfaz** | Móvil-first | Desktop-first |
| **Funcionalidad** | Solo asistencias | Sistema completo |
| **Complejidad** | Simplificada | Completa |
| **Login** | Rápido/básico | Completo con roles |

## 🔧 **Configuración AWS**

### **Dominio Sugerido**: `app.brayamsac.com`

### **Infraestructura AWS**:
- **S3 Bucket**: Static website hosting
- **CloudFront**: CDN y SSL
- **Route 53**: DNS management
- **ACM**: SSL Certificate

### **Security Headers** (CloudFront):
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 📊 **Performance**
- **Bundle Size**: ~500KB optimizado
- **First Load**: <2 segundos
- **Mobile Optimized**: 100% responsive
- **Offline**: PWA capabilities futuras

## 🔐 **Seguridad**
- **HTTPS Only** en producción
- **Token JWT** con auto-renovación
- **CORS** restrictivo
- **No sensitive data** en localStorage

## 🐛 **Debug y Logs**
```bash
# Logs de desarrollo
npm run dev

# Build con análisis
npm run build --analyze

# Test de build local
npm run preview
```

## 📞 **Soporte**
- **Development**: http://localhost:5174
- **Staging**: https://app-staging.brayamsac.com
- **Production**: https://app.brayamsac.com
- **Health Check**: Backend `/health` endpoint

---

## 🎯 **Próximas Mejoras**
- [ ] PWA capabilities (offline support)
- [ ] Push notifications para asistencias
- [ ] Testing suite (vitest + testing-library)
- [ ] Geolocation para validación de asistencias
- [ ] Sync automático cuando vuelve conectividad
