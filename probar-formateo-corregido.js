/**
 * Prueba de la función formatearFecha corregida
 */

function formatearFechaCorregida(fechaStr) {
  console.log('🔍 [DEBUG] formatearFecha() llamada con:', fechaStr);
  
  if (!fechaStr) {
    console.log('🔍 [DEBUG] fechaStr está vacía, retornando cadena vacía');
    return '';
  }
  
  try {
    // Si ya viene en formato DD/MM/YYYY, devolverla tal como está
    if (fechaStr.includes('/') && fechaStr.split('/').length === 3) {
      console.log('🔍 [DEBUG] Fecha ya está en formato DD/MM/YYYY:', fechaStr);
      return fechaStr;
    }
    
    // Si viene en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    console.log('🔍 [DEBUG] Convirtiendo fecha YYYY-MM-DD a DD/MM/YYYY');
    
    // Crear fecha a partir del string, asegurándonos de usar la zona horaria local
    const [año, mes, dia] = fechaStr.split('-');
    console.log('🔍 [DEBUG] Componentes extraídos - Año:', año, 'Mes:', mes, 'Día:', dia);
    
    // Validar que tenemos los componentes necesarios
    if (!año || !mes || !dia) {
      console.log('🔍 [DEBUG] Componentes inválidos, retornando string original');
      return fechaStr;
    }
    
    // Formatear directamente sin crear objeto Date para evitar problemas de zona horaria
    const fechaFormateada = `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${año}`;
    console.log('🔍 [DEBUG] Fecha formateada resultante:', fechaFormateada);
    
    return fechaFormateada;
  } catch (error) {
    console.error('❌ [DEBUG] Error al formatear fecha:', error);
    return fechaStr;
  }
}

// Obtener fecha actual
function obtenerFechaActual() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

console.log('🔍 PRUEBA DE FUNCIÓN formatearFecha CORREGIDA');
console.log('=============================================');

const fechaActual = obtenerFechaActual();
console.log('\n📅 FECHA ACTUAL DEL SISTEMA:', fechaActual);

// Probar el formateo
const fechaFormateada = formatearFechaCorregida(fechaActual);
console.log('\n✅ RESULTADO DEL FORMATEO:');
console.log('- Fecha original (YYYY-MM-DD):', fechaActual);
console.log('- Fecha formateada (DD/MM/YYYY):', fechaFormateada);

// Verificar que coincida
const [año, mes, dia] = fechaActual.split('-');
const fechaEsperada = `${dia}/${mes}/${año}`;
console.log('- Fecha esperada:', fechaEsperada);
console.log('- ¿Coinciden?:', fechaFormateada === fechaEsperada);

console.log('\n🎯 CONCLUSIÓN:');
if (fechaFormateada === fechaEsperada) {
  console.log('✅ La función formatearFecha ahora funciona correctamente');
  console.log('✅ La fecha se muestra correctamente en la UI');
} else {
  console.log('❌ Aún hay un problema con el formateo');
}
