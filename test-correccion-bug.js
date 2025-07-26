/**
 * Test de la corrección del bug de zona horaria
 */

// Simular la función corregida
function esFechaActualCorregida(fechaStr) {
  console.log('🔍 [DEBUG] esFechaActualCorregida() llamada con:', fechaStr);
  
  if (!fechaStr) {
    console.log('🔍 [DEBUG] fechaStr está vacía, retornando false');
    return false;
  }

  try {
    // Obtener fecha actual
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const fechaActual = `${año}-${mes}-${dia}`;
    console.log('🔍 [DEBUG] Fecha actual obtenida:', fechaActual);
    
    // Normalizar la fecha proporcionada
    let fechaNormalizada;
    if (fechaStr.includes('/')) {
      console.log('🔍 [DEBUG] Fecha contiene "/", procesando como DD/MM/YYYY');
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        fechaNormalizada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        console.log('🔍 [DEBUG] Fecha convertida de DD/MM/YYYY:', fechaNormalizada);
      }
    } else {
      console.log('🔍 [DEBUG] Fecha no contiene "/", procesando como YYYY-MM-DD');
      // ✅ CORRECCIÓN: Si ya está en formato YYYY-MM-DD, usar directamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        console.log('🔍 [DEBUG] Formato YYYY-MM-DD válido, usando directamente');
        fechaNormalizada = fechaStr;
      } else {
        // Para otros formatos, usar Date con cuidado de zona horaria
        console.log('🔍 [DEBUG] Formato no estándar, usando Date object con zona horaria local');
        const fecha = new Date(fechaStr + 'T12:00:00'); // Añadir hora para evitar problemas de UTC
        if (!isNaN(fecha.getTime())) {
          const año = fecha.getFullYear();
          const mes = String(fecha.getMonth() + 1).padStart(2, '0');
          const dia = String(fecha.getDate()).padStart(2, '0');
          fechaNormalizada = `${año}-${mes}-${dia}`;
          console.log('🔍 [DEBUG] Fecha normalizada desde Date object:', fechaNormalizada);
        }
      }
    }

    if (!fechaNormalizada) {
      console.warn('⚠️ [DEBUG] No se pudo normalizar la fecha:', fechaStr);
      return false;
    }

    // Comparación final
    const sonIguales = fechaActual === fechaNormalizada;
    console.log('🔍 [DEBUG] COMPARACIÓN FINAL:');
    console.log('🔍 [DEBUG]   - Fecha actual:      ', fechaActual);
    console.log('🔍 [DEBUG]   - Fecha normalizada: ', fechaNormalizada);
    console.log('🔍 [DEBUG]   - ¿Son iguales?:     ', sonIguales);

    return sonIguales;
  } catch (error) {
    console.error('❌ [DEBUG] Error al validar fecha:', error);
    return false;
  }
}

console.log('🧪 TESTING CORRECCIÓN DEL BUG');
console.log('===============================');

// Test 1: Caso del bug - fecha ISO 2025-07-17
console.log('\n📅 TEST 1: Fecha seleccionada 2025-07-17 (debe ser true)');
const resultado1 = esFechaActualCorregida('2025-07-17');
console.log('✅ RESULTADO:', resultado1 ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO');

// Test 2: Fecha diferente 
console.log('\n📅 TEST 2: Fecha seleccionada 2025-07-16 (debe ser false)');
const resultado2 = esFechaActualCorregida('2025-07-16');
console.log('✅ RESULTADO:', resultado2 ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO');

// Test 3: Formato DD/MM/YYYY 
console.log('\n📅 TEST 3: Fecha seleccionada 17/07/2025 (debe ser true)');
const resultado3 = esFechaActualCorregida('17/07/2025');
console.log('✅ RESULTADO:', resultado3 ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO');
