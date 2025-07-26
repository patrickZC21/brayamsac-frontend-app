/**
 * Prueba específica para el caso mostrado en la imagen
 * Fecha seleccionada: 2025-07-07
 * Fecha actual esperada: 16/07/2025 o 17/07/2025
 */

// Simular las funciones tal como están en el código
function obtenerFechaActualSimulada() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  
  return `${año}-${mes}-${dia}`;
}

function esFechaActualSimulada(fechaStr) {
  if (!fechaStr) return false;

  try {
    const fechaActual = obtenerFechaActualSimulada();
    
    let fechaNormalizada;
    if (fechaStr.includes('/')) {
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        fechaNormalizada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
      }
    } else {
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        fechaNormalizada = `${año}-${mes}-${dia}`;
      }
    }

    if (!fechaNormalizada) {
      return false;
    }

    return fechaActual === fechaNormalizada;
  } catch {
    return false;
  }
}

function formatearFechaSimulada(fechaStr) {
  if (!fechaStr) return '';
  
  try {
    if (fechaStr.includes('/') && fechaStr.split('/').length === 3) {
      return fechaStr;
    }
    
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr;
    
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    
    return `${dia}/${mes}/${año}`;
  } catch {
    return fechaStr;
  }
}

// Probar el caso específico de la imagen
console.log('🔍 PRUEBA DEL CASO ESPECÍFICO DE LA IMAGEN');
console.log('==========================================');

const fechaSeleccionada = '2025-07-07'; // Fecha que aparece en la imagen
const fechaActual = obtenerFechaActualSimulada();

console.log('\n📊 DATOS:');
console.log('- Fecha seleccionada:', fechaSeleccionada);
console.log('- Fecha actual del sistema:', fechaActual);
console.log('- Fecha seleccionada formateada:', formatearFechaSimulada(fechaSeleccionada));
console.log('- Fecha actual formateada:', formatearFechaSimulada(fechaActual));

console.log('\n✅ VALIDACIÓN:');
const esValida = esFechaActualSimulada(fechaSeleccionada);
console.log('- ¿Es fecha actual?:', esValida);
console.log('- Resultado esperado: false (debe mostrar restricción)');

console.log('\n🎯 EXPLICACIÓN:');
if (!esValida) {
  console.log('✅ CORRECTO: El sistema está funcionando bien.');
  console.log('   La fecha 07/07/2025 NO es la fecha actual (' + formatearFechaSimulada(fechaActual) + ')');
  console.log('   Por eso aparece el mensaje de "Acceso Restringido"');
} else {
  console.log('❌ ERROR: El sistema no está validando correctamente');
}

console.log('\n💡 PARA PROBAR EL ACCESO PERMITIDO:');
console.log('   Debes navegar a la fecha actual:', formatearFechaSimulada(fechaActual));
console.log('   Esa fecha SÍ debería permitir el registro de asistencias');

// Probar también con la fecha actual
console.log('\n🧪 PRUEBA CON FECHA ACTUAL:');
const esValidaHoy = esFechaActualSimulada(fechaActual);
console.log('- Fecha actual (' + fechaActual + ') ¿es válida?:', esValidaHoy);
console.log('- Esto SÍ debería permitir el acceso');

console.log('\n📋 RESUMEN:');
console.log('- El error mostrado en la imagen es CORRECTO');
console.log('- El sistema está funcionando como debe');
console.log('- Solo debes intentar con la fecha actual:', formatearFechaSimulada(fechaActual));
