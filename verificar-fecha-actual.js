/**
 * Script de prueba para verificar la validación de fechas
 * Ejecutar en la consola del navegador o como prueba independiente
 */

// Función para obtener fecha actual (copia de la función principal)
function obtenerFechaActualPrueba() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  
  return `${año}-${mes}-${dia}`;
}

// Función para obtener información completa
function obtenerInfoCompletaPrueba() {
  const ahora = new Date();
  return {
    fechaCompleta: ahora.toString(),
    fechaISO: ahora.toISOString(),
    fechaLocal: ahora.toLocaleDateString('es-PE'),
    fechaNormalizada: obtenerFechaActualPrueba(),
    zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    año: ahora.getFullYear(),
    mes: ahora.getMonth() + 1,
    dia: ahora.getDate(),
    hora: ahora.getHours(),
    minuto: ahora.getMinutes(),
    segundo: ahora.getSeconds()
  };
}

// Ejecutar pruebas
console.log('🔍 PRUEBA DE VALIDACIÓN DE FECHAS');
console.log('=====================================');

const info = obtenerInfoCompletaPrueba();

console.log('\n📅 INFORMACIÓN DEL SISTEMA:');
console.log('- Fecha completa:', info.fechaCompleta);
console.log('- Fecha ISO:', info.fechaISO);
console.log('- Fecha local (es-PE):', info.fechaLocal);
console.log('- Fecha normalizada:', info.fechaNormalizada);
console.log('- Zona horaria:', info.zonaHoraria);
console.log('- Año:', info.año);
console.log('- Mes:', info.mes);
console.log('- Día:', info.dia);
console.log('- Hora:', `${info.hora}:${info.minuto}:${info.segundo}`);

console.log('\n🧪 PRUEBAS DE VALIDACIÓN:');

// Probar diferentes formatos de fecha
const fechasPrueba = [
  info.fechaNormalizada,  // Fecha actual
  '2025-07-16',          // 16 de julio 2025
  '2025-07-17',          // 17 de julio 2025
  '16/07/2025',          // 16 de julio en formato DD/MM/YYYY
  '17/07/2025'           // 17 de julio en formato DD/MM/YYYY
];

fechasPrueba.forEach(fecha => {
  const esHoy = fecha === info.fechaNormalizada || 
                (fecha.includes('/') && fecha === `${String(info.dia).padStart(2, '0')}/${String(info.mes).padStart(2, '0')}/${info.año}`);
  
  console.log(`- ${fecha}: ${esHoy ? '✅ ES HOY' : '❌ NO ES HOY'}`);
});

console.log('\n💡 FECHA ACTUAL REAL DEL SISTEMA:', info.fechaNormalizada);
console.log('💡 ESTA ES LA FECHA QUE SE USARÁ PARA VALIDACIÓN');

// Exportar para usar en otros scripts
export {
  obtenerFechaActualPrueba,
  obtenerInfoCompletaPrueba
};
