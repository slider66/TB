# 🧪 PRUEBA DE CONFIRMACIÓN DE CUENTA

**Fecha:** 30/10/2025  
**Proyecto:** Traductor Burocrático

---

## 📋 DESCRIPCIÓN

Esta guía describe cómo probar el flujo completo de confirmación de cuenta por email después de las mejoras implementadas.

---

## 🎯 OBJETIVOS

1. ✅ Verificar que el email de confirmación se envía correctamente
2. ✅ Verificar que el usuario es redirigido a la página correcta
3. ✅ Verificar que se muestra el mensaje "Cuenta activada, gracias"
4. ✅ Verificar que el usuario puede acceder al panel después de confirmar

---

## 🔄 FLUJO IMPLEMENTADO

### 1. Registro de Usuario

```
Usuario completa formulario
    ↓
Sistema envía email de confirmación a través de Supabase
    ↓
Usuario recibe email con enlace de confirmación
```

### 2. Click en Email de Confirmación

```
Usuario hace clic en enlace del email
    ↓
Supabase verifica el token
    ↓
Redirige a: /auth/callback?type=signup&token=...
```

### 3. Procesamiento en AuthCallbackPage

```
AuthCallbackPage detecta type=signup
    ↓
Verifica que existe sesión activa
    ↓
Redirige a: /auth/confirm?verified=true
```

### 4. Confirmación Visual

```
AuthConfirmPage detecta verified=true
    ↓
Muestra: "¡Cuenta Activada! Gracias por verificar..."
    ↓
Botón "Ir al Panel" disponible
```

---

## 🧪 PASOS PARA PROBAR

### Paso 1: Preparar el Entorno

1. Asegúrate de que el servidor está corriendo:

   ```bash
   pnpm dev
   # Servidor corriendo en http://localhost:5175/
   ```

2. Abre el navegador en: http://localhost:5175/

### Paso 2: Crear una Cuenta de Prueba

1. Haz clic en "Crear cuenta" o navega a `/register`
2. Completa el formulario con:
   - **Nombre completo:** Tu nombre
   - **Email:** Un email real al que tengas acceso
   - **Contraseña:** Debe cumplir los requisitos (12+ caracteres, mayúscula, minúscula, número, símbolo)
   - **Confirmar contraseña:** Misma contraseña

3. Haz clic en "Registrarse"

4. Deberías ver un toast verde con el mensaje:
   ```
   ✅ ¡Registro casi completado!
   Hemos enviado un correo de confirmación a [tu-email].
   Por favor, revisa tu bandeja de entrada.
   ```

### Paso 3: Verificar el Email

1. Abre tu cliente de email
2. Busca un email de Supabase (puede estar en spam)
3. El email debería contener:
   - Asunto relacionado con confirmación de cuenta
   - Un botón o enlace "Confirmar correo" / "Verify Email"

### Paso 4: Hacer Clic en el Enlace de Confirmación

1. Haz clic en el botón/enlace del email
2. Serás redirigido a tu aplicación
3. Verás brevemente una pantalla de "Verificando tu sesión..."

### Paso 5: Verificar la Página de Confirmación

Deberías ver una página con:

```
✅ Icono verde de check grande

🎉 Título: "¡Cuenta Activada!"

📝 Mensaje:
"Tu cuenta ha sido activada exitosamente. ¡Gracias por
verificar tu correo electrónico! Ya puedes acceder a
todos nuestros servicios."

🔘 Botón: "Ir al Panel" (con flecha)

✓ Mensaje inferior: "✓ Cuenta activada con éxito"
```

### Paso 6: Acceder al Panel

1. Haz clic en el botón "Ir al Panel"
2. Deberías ser redirigido a `/panel`
3. Tu sesión debe estar activa

---

## ✅ CRITERIOS DE ÉXITO

| Criterio                | Resultado Esperado                        |
| ----------------------- | ----------------------------------------- |
| Email enviado           | ✅ Email recibido en bandeja de entrada   |
| Enlace funcional        | ✅ Redirige a la aplicación correctamente |
| Mensaje correcto        | ✅ "¡Cuenta Activada!" visible            |
| Texto de agradecimiento | ✅ "Gracias por verificar..." visible     |
| Indicador visual        | ✅ "✓ Cuenta activada con éxito" visible  |
| Botón funcional         | ✅ "Ir al Panel" redirige correctamente   |
| Sesión activa           | ✅ Usuario autenticado en el panel        |

---

## 🔧 ARCHIVOS MODIFICADOS

### 1. `src/pages/AuthCallbackPage.jsx`

**Cambios realizados:**

- ✅ Detecta el parámetro `type` de la URL
- ✅ Si `type=signup` o `type=email`, redirige a `/auth/confirm?verified=true`
- ✅ Maneja errores con mensajes descriptivos
- ✅ Muestra estado de carga durante verificación

**Código clave:**

```javascript
const type = searchParams.get('type')

if (session) {
  if (type === 'signup' || type === 'email') {
    navigate('/auth/confirm?verified=true')
  } else {
    navigate('/panel')
  }
}
```

### 2. `src/pages/AuthConfirmPage.jsx`

**Cambios realizados:**

- ✅ Lee el parámetro `verified` de la URL
- ✅ Muestra mensaje diferente si `verified=true`
- ✅ Título: "¡Cuenta Activada!" en lugar de "¡Cuenta Verificada!"
- ✅ Mensaje personalizado con agradecimiento
- ✅ Botón "Ir al Panel" en lugar de "Iniciar Sesión"
- ✅ Indicador visual adicional: "✓ Cuenta activada con éxito"

**Código clave:**

```javascript
const verified = searchParams.get('verified') === 'true';

<h1>{verified ? '¡Cuenta Activada!' : '¡Cuenta Verificada!'}</h1>
<p>
  {verified
    ? 'Tu cuenta ha sido activada exitosamente. ¡Gracias por verificar...'
    : 'Tu dirección de correo ha sido confirmada exitosamente...'
  }
</p>
```

---

## 🐛 TROUBLESHOOTING

### Problema: No recibo el email

**Soluciones:**

1. Revisa la carpeta de spam
2. Verifica que el email es correcto
3. Comprueba en Supabase Dashboard → Authentication → Users
4. Verifica configuración de email en Supabase → Settings → Auth → Email Templates

### Problema: El enlace dice "expired" o "invalid"

**Soluciones:**

1. Los enlaces de confirmación tienen caducidad (normalmente 24h)
2. Solicita un nuevo email desde `/login` → "¿Has olvidado tu contraseña?"
3. O crea una nueva cuenta

### Problema: Me redirige a login en lugar de confirm

**Soluciones:**

1. Verifica que `emailRedirectTo` en SupabaseAuthContext apunta a `/auth/callback`
2. Comprueba en Supabase Dashboard que la URL está permitida en:
   - Settings → Auth → URL Configuration → Redirect URLs

### Problema: No veo el mensaje "Cuenta activada"

**Soluciones:**

1. Verifica que la URL incluye `?verified=true`
2. Comprueba en DevTools la URL actual
3. Limpia caché del navegador

---

## 📊 CONFIGURACIÓN DE SUPABASE

### Email Templates (Supabase Dashboard)

Para personalizar el email de confirmación:

1. Ve a: **Supabase Dashboard → Authentication → Email Templates**
2. Selecciona: **Confirm signup**
3. Personaliza el template con tu branding
4. Asegúrate de que `{{ .ConfirmationURL }}` está presente

### URL Configuration

1. Ve a: **Supabase Dashboard → Settings → Auth → URL Configuration**
2. **Site URL:** `http://localhost:5175` (desarrollo) o tu dominio (producción)
3. **Redirect URLs:** Añade:
   - `http://localhost:5175/auth/callback`
   - Tu dominio de producción + `/auth/callback`

---

## 🚀 PRUEBA EN PRODUCCIÓN

Cuando despliegues a producción:

1. **Actualiza Site URL en Supabase:**

   ```
   https://tudominio.com
   ```

2. **Actualiza Redirect URLs:**

   ```
   https://tudominio.com/auth/callback
   ```

3. **Verifica variables de entorno:**
   - `VITE_SUPABASE_URL` debe apuntar a tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` debe ser correcta

4. **Prueba con email real:**
   - Crea una cuenta con tu email personal
   - Verifica que recibes el email
   - Confirma que el flujo funciona end-to-end

---

## 📝 NOTAS ADICIONALES

### Seguridad

- ✅ Los tokens de confirmación son de un solo uso
- ✅ Los tokens tienen caducidad
- ✅ Supabase maneja la verificación del token
- ✅ No hay información sensible en las URLs

### UX/UI

- ✅ Animaciones con Framer Motion
- ✅ Iconos con Lucide React
- ✅ Diseño responsive
- ✅ Mensajes claros y amigables
- ✅ Feedback visual inmediato

### Accesibilidad

- ✅ Contraste adecuado de colores
- ✅ Tamaños de texto legibles
- ✅ Botones con área de click suficiente
- ✅ Mensajes descriptivos

---

## 📞 SOPORTE

Si encuentras problemas durante las pruebas:

1. Revisa la consola del navegador (F12)
2. Verifica los logs del servidor
3. Comprueba el Network tab para ver las peticiones
4. Revisa este documento de troubleshooting

---

**Documento creado:** 30/10/2025, 19:04  
**Última actualización:** 30/10/2025, 19:04  
**Estado:** ✅ Listo para pruebas
