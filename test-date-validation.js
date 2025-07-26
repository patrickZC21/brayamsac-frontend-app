/**
 * Script de prueba para validar el funcionamiento de la restricción de fechas
 * Este archivo puede ejecutarse en la consola del navegador para probar las funciones
 */

// Importa las funciones de validación (para usar en la consola del navegador)
import { esFechaActual, obtenerFechaActual, formatearFecha } from './src/utils/dateValidation.js';

// Función de prueba
function PROBAR_VALIDACION_FECHAS() {
  const fechaActual = obtenerFechaActual();
  console.log('🗓️ Fecha actual del sistema:', fechaActual);
  console.log('📅 Formato legible:', formatearFecha(fechaActual));
  
  // Probar fecha actual
  console.log('\n✅ Prueba fecha actual:');
  console.log('¿Es fecha actual?', esFechaActual(fechaActual));
  
  // Probar fecha de ayer
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyer = ayer.toISOString().slice(0, 10);
  console.log('\n❌ Prueba fecha de ayer:');
  console.log('Fecha de ayer:', fechaAyer);
  console.log('¿Es fecha actual?', esFechaActual(fechaAyer));
  
  // Probar fecha de mañana
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const fechaManana = manana.toISOString().slice(0, 10);
  console.log('\n❌ Prueba fecha de mañana:');
  console.log('Fecha de mañana:', fechaManana);
  console.log('¿Es fecha actual?', esFechaActual(fechaManana));
  
  console.log('\n🎯 Resumen de pruebas:');
  console.log(`- Fecha actual (${fechaActual}):`, esFechaActual(fechaActual) ? '✅ PERMITIDO' : '❌ BLOQUEADO');
  console.log(`- Fecha ayer (${fechaAyer}):`, esFechaActual(fechaAyer) ? '✅ PERMITIDO' : '❌ BLOQUEADO');
  console.log(`- Fecha mañana (${fechaManana}):`, esFechaActual(fechaManana) ? '✅ PERMITIDO' : '❌ BLOQUEADO');
}

// Para usar en consola del navegador:
// PROBAR_VALIDACION_FECHAS();
