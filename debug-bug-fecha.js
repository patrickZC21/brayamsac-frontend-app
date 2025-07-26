/**
 * Test específico para el bug detectado:
 * Fecha seleccionada: 2025-07-17
 * Fecha actual: 17/07/2025  
 * Debería permitir acceso pero no lo hace
 */

// Simular exactamente lo que está pasando
function testBugFecha() {
  console.log('🐛 DEBUGGING DEL BUG DETECTADO');
  console.log('==============================');
  
  // Simular obtenerFechaActual()
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const fechaActual = `${año}-${mes}-${dia}`;
  
  console.log('\n📅 FECHA ACTUAL CALCULADA:', fechaActual);
  
  // Esta es la fecha que viene de la URL (según la imagen)
  const fechaSeleccionada = '2025-07-17';
  console.log('📅 FECHA SELECCIONADA:', fechaSeleccionada);
  
  // Simular esFechaActual()
  console.log('\n🔍 PROCESO DE VALIDACIÓN:');
  console.log('1. fechaSeleccionada:', fechaSeleccionada);
  console.log('2. fechaActual:', fechaActual);
  
  // La fecha seleccionada NO contiene '/' por lo que entra en el else
  console.log('3. ¿Contiene "/"?', fechaSeleccionada.includes('/'));
  
  // Crear Date object
  const fecha = new Date(fechaSeleccionada);
  console.log('4. Date object creado:', fecha.toString());
  console.log('5. ¿Es válida?', !isNaN(fecha.getTime()));
  
  if (!isNaN(fecha.getTime())) {
    const añoNorm = fecha.getFullYear();
    const mesNorm = String(fecha.getMonth() + 1).padStart(2, '0');
    const diaNorm = String(fecha.getDate()).padStart(2, '0');
    const fechaNormalizada = `${añoNorm}-${mesNorm}-${diaNorm}`;
    
    console.log('6. Componentes normalizados:');
    console.log('   - Año:', añoNorm);
    console.log('   - Mes:', mesNorm);
    console.log('   - Día:', diaNorm);
    console.log('7. fechaNormalizada:', fechaNormalizada);
    
    console.log('\n⚖️ COMPARACIÓN FINAL:');
    console.log('- fechaActual:      "' + fechaActual + '"');
    console.log('- fechaNormalizada: "' + fechaNormalizada + '"');
    console.log('- ¿Son iguales?:', fechaActual === fechaNormalizada);
    
    // Verificar posibles problemas
    console.log('\n🔍 DIAGNÓSTICO:');
    console.log('- Longitud fechaActual:', fechaActual.length);
    console.log('- Longitud fechaNormalizada:', fechaNormalizada.length);
    console.log('- Caracteres fechaActual:', [...fechaActual]);
    console.log('- Caracteres fechaNormalizada:', [...fechaNormalizada]);
    
    // Verificar diferencias carácter por carácter
    if (fechaActual !== fechaNormalizada) {
      console.log('\n❌ DIFERENCIAS ENCONTRADAS:');
      for (let i = 0; i < Math.max(fechaActual.length, fechaNormalizada.length); i++) {
        const charActual = fechaActual[i] || '';
        const charNormalizada = fechaNormalizada[i] || '';
        if (charActual !== charNormalizada) {
          console.log(`   Posición ${i}: "${charActual}" vs "${charNormalizada}"`);
        }
      }
    }
  }
  
  // Verificar zona horaria
  console.log('\n🌍 INFORMACIÓN DE ZONA HORARIA:');
  console.log('- Offset:', fecha.getTimezoneOffset());
  console.log('- Zona horaria:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('- UTC Date:', fecha.getUTCDate());
  console.log('- Local Date:', fecha.getDate());
  console.log('- Diferencia:', fecha.getDate() - fecha.getUTCDate());
}

testBugFecha();
