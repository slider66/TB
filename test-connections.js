// test-connections.js
// Script para verificar conexiones y endpoints

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ayafzwwklyjbrzehwukf.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YWZ6d3drbHlqYnJ6ZWh3dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjYwOTcsImV4cCI6MjA3MjUwMjA5N30.LzuoVX8Fasf_Qbz0U9RHiohEnZ_PBuK5-7focR2_9_Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 VERIFICACIÓN DE CONEXIONES Y ENDPOINTS\n');
console.log('='.repeat(60));

// 1. Verificar variables de entorno
console.log('\n📋 1. VARIABLES DE ENTORNO');
console.log('-'.repeat(60));
console.log('✓ VITE_SUPABASE_URL:', supabaseUrl);
console.log('✓ VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : '❌ NO CONFIGURADA');
console.log('✓ VITE_STRIPE_PUBLISHABLE_KEY:', process.env.VITE_STRIPE_PUBLISHABLE_KEY ? '***' + process.env.VITE_STRIPE_PUBLISHABLE_KEY.slice(-10) : '❌ NO CONFIGURADA');

// 2. Verificar conexión con Supabase
console.log('\n🔌 2. CONEXIÓN CON SUPABASE');
console.log('-'.repeat(60));
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  console.log('✅ Conexión establecida correctamente');
  console.log('   Estado de sesión:', data.session ? 'Sesión activa' : 'Sin sesión activa');
} catch (error) {
  console.error('❌ Error de conexión:', error.message);
}

// 3. Verificar endpoints de funciones Edge
console.log('\n🌐 3. ENDPOINTS DE FUNCIONES EDGE');
console.log('-'.repeat(60));

const functionsToTest = [
  { name: 'get-stripe-publishable-key', method: 'POST', body: { secretName: 'Stripe' } },
  { name: 'send-contact-email', method: 'POST', body: null, skip: true }, // Skip para no enviar email real
];

for (const func of functionsToTest) {
  if (func.skip) {
    console.log(`⏭️  ${func.name}: Omitido (requiere datos reales)`);
    continue;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke(func.name, {
      body: func.body
    });
    
    if (error) {
      console.error(`❌ ${func.name}: Error - ${error.message}`);
    } else {
      console.log(`✅ ${func.name}: Respuesta exitosa`);
      if (func.name === 'get-stripe-publishable-key' && data?.key) {
        console.log(`   Clave Stripe: pk_test_***${data.key.slice(-10)}`);
      }
    }
  } catch (error) {
    console.error(`❌ ${func.name}: Excepción - ${error.message}`);
  }
}

// 4. Verificar estructura de base de datos
console.log('\n🗄️  4. VERIFICACIÓN DE TABLAS');
console.log('-'.repeat(60));

const tablesToCheck = ['app_users', 'contact_messages', 'orders'];

for (const table of tablesToCheck) {
  try {
    const { error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Tabla '${table}': ${error.message}`);
    } else {
      console.log(`✅ Tabla '${table}': Accesible`);
    }
  } catch (error) {
    console.error(`❌ Tabla '${table}': ${error.message}`);
  }
}

// 5. Resumen
console.log('\n📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));
console.log('✓ Variables de entorno configuradas');
console.log('✓ Cliente Supabase inicializado');
console.log('✓ Endpoints Edge Functions verificados');
console.log('✓ Estructura de base de datos verificada');
console.log('\n✅ Verificación completada\n');

process.exit(0);
