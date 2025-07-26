# Restricción de Acceso por Fecha - Sistema de Asistencias

## Descripción

Se ha implementado una funcionalidad de restricción de acceso por fecha en la aplicación `frontend-app` para garantizar que los coordinadores solo puedan registrar asistencias en la fecha actual del sistema.

## Funcionalidades Implementadas

### 1. Validación de Fecha Actual
- Los coordinadores solo pueden acceder al registro de asistencias si la fecha seleccionada coincide con la fecha actual del sistema
- Si intentan acceder a una fecha diferente, se muestra un mensaje de restricción

### 2. Indicadores Visuales
- En la lista de fechas, las fechas que corresponden al día actual se muestran con:
  - ✅ Icono de verificación
  - Etiqueta "(HOY)"
  - Borde izquierdo verde (#4CAF50)
  - Opacidad completa
- Las fechas que no son del día actual se muestran con:
  - Borde izquierdo azul (#2196f3)
  - Opacidad reducida (0.7)

### 3. Mensaje de Restricción
- Cuando se intenta acceder a una fecha no válida, se muestra un mensaje informativo que incluye:
  - Fecha seleccionada
  - Fecha actual del sistema
  - Botón para volver a la lista de fechas

## Archivos Modificados/Creados

### Nuevos Archivos

1. **`src/utils/dateValidation.js`**
   - Utilidades para validación de fechas
   - Funciones: `esFechaActual()`, `obtenerFechaActual()`, `formatearFecha()`

2. **`src/hooks/useDateValidation.js`**
   - Hook personalizado para validar el acceso a fechas
   - Retorna información de validación y permisos de acceso

3. **`src/components/DateRestrictionMessage.jsx`**
   - Componente que muestra el mensaje de restricción
   - Incluye información detallada y botón de navegación

### Archivos Modificados

1. **`src/pages/AsistenciasPorFechaPage.jsx`**
   - Agregada validación de fecha antes de cargar asistencias
   - Muestra mensaje de restricción cuando la fecha no es válida
   - Solo permite el registro de asistencias en la fecha actual

2. **`src/components/SubalmacenFechasList.jsx`**
   - Agregados indicadores visuales para fechas válidas
   - Diferente estilo para fecha actual vs otras fechas

## Comportamiento del Sistema

### Acceso Permitido
- **Condición**: La fecha seleccionada coincide con la fecha actual del sistema
- **Resultado**: Se carga la interfaz normal de registro de asistencias

### Acceso Restringido
- **Condición**: La fecha seleccionada NO coincide con la fecha actual del sistema
- **Resultado**: Se muestra mensaje de restricción y no se permite el registro

### Ejemplo de Uso
- Si hoy es **17/07/2025**:
  - ✅ **Permitido**: Acceder a asistencias del 17/07/2025
  - ❌ **Restringido**: Acceder a asistencias del 16/07/2025 o 18/07/2025

## Características Técnicas

- La validación se basa en la fecha del sistema local del usuario
- Se comparan solo año, mes y día (ignorando la hora)
- Las validaciones son en tiempo real y reactivas
- El sistema mantiene la funcionalidad existente para otras secciones

## Notas Importantes

- Esta restricción **SOLO** aplica a la sección de registro de asistencias (`frontend-app`)
- La sección de creación de fechas (`Frontend`) **NO** está sujeta a esta restricción
- Los coordinadores pueden navegar y ver todas las fechas, pero solo registrar en la actual
- El sistema sigue funcionando normalmente para todas las demás funcionalidades
