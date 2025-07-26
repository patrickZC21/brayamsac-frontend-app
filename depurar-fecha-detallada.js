/**
 * Script de depuración para verificar diferencias de fecha
 * entre servidor y cliente
 */

// Función para depurar fecha en detalle
function depurarFecha() {
  const ahora = new Date();
  
  console.log('🔍 DEPURACIÓN DETALLADA DE FECHA');
  console.log('================================');
  
  console.log('\n📅 INFORMACIÓN BÁSICA:');
  console.log('- toString():', ahora.toString());
  console.log('- toISOString():', ahora.toISOString());
  console.log('- valueOf():', ahora.valueOf());
  
  console.log('\n🌍 ZONA HORARIA:');
  console.log('- getTimezoneOffset():', ahora.getTimezoneOffset(), 'minutos');
  console.log('- Zona horaria detectada:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  console.log('\n📊 COMPONENTES DE FECHA:');
  console.log('- getFullYear():', ahora.getFullYear());
  console.log('- getMonth():', ahora.getMonth(), '(0-11)');
  console.log('- getDate():', ahora.getDate());
  console.log('- getDay():', ahora.getDay(), '(0=domingo)');
  
  console.log('\n🕐 COMPONENTES DE HORA:');
  console.log('- getHours():', ahora.getHours());
  console.log('- getMinutes():', ahora.getMinutes());
  console.log('- getSeconds():', ahora.getSeconds());
  
  console.log('\n🌐 MÉTODOS UTC:');
  console.log('- getUTCFullYear():', ahora.getUTCFullYear());
  console.log('- getUTCMonth():', ahora.getUTCMonth());
  console.log('- getUTCDate():', ahora.getUTCDate());
  
  console.log('\n📋 FORMATOS LOCALES:');
  console.log('- toLocaleDateString():', ahora.toLocaleDateString());
  console.log('- toLocaleDateString("es-PE"):', ahora.toLocaleDateString('es-PE'));
  console.log('- toLocaleDateString("en-US"):', ahora.toLocaleDateString('en-US'));
  
  console.log('\n🔧 CÁLCULOS MANUALES:');
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const fechaLocal = `${año}-${mes}-${dia}`;
  
  const añoUTC = ahora.getUTCFullYear();
  const mesUTC = String(ahora.getUTCMonth() + 1).padStart(2, '0');
  const diaUTC = String(ahora.getUTCDate()).padStart(2, '0');
  const fechaUTC = `${añoUTC}-${mesUTC}-${diaUTC}`;
  
  console.log('- Fecha local calculada:', fechaLocal);
  console.log('- Fecha UTC calculada:', fechaUTC);
  console.log('- ISO slice(0,10):', ahora.toISOString().slice(0, 10));
  
  console.log('\n💡 RESUMEN:');
  console.log('- ¿Fecha local != Fecha UTC?:', fechaLocal !== fechaUTC);
  console.log('- Diferencia horaria:', ahora.getTimezoneOffset() / 60, 'horas');
  
  return {
    fechaLocal,
    fechaUTC,
    fechaISO: ahora.toISOString().slice(0, 10),
    esNavegador: typeof window !== 'undefined'
  };
}

// Ejecutar depuración
const _resultado = depurarFecha();

// Exportar para usar en navegador
if (typeof window !== 'undefined') {
  window.depurarFecha = depurarFecha;
  console.log('\n🌐 EJECUTADO EN NAVEGADOR');
  console.log('Para ejecutar nuevamente, usar: depurarFecha()');
}
