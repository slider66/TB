---

## title: "Traductor Burocrático – Requisitos (Contexto) y Plan de Tareas"

version: 1.3\
last\_updated: 2025-10-05\
owners: ["Producto: Usuario", "Tech: Usuario"]\
status: Draft\
kb\_scope: ["Traductor Burocrático", "Directorios de profesionales", "IA asistentes (Cursor, ChatGPT)"]

## Índice

- [01. Requisitos (Contexto)](#01-documento-de-requisitos-contexto)
  - [1) Problema y contexto](#1-problema-a-resolver-y-contexto)
  - [2) Público y casos de uso](#2-público-objetivo-y-casos-de-uso)
  - [3) Propuesta de valor](#3-propuesta-de-valor)
  - [4) Alcance y no-alcance](#4-alcance-scope-y-no-alcance-out-of-scope)
  - [5) Stack tecnológico](#5-stack-tecnológico-recomendado)
  - [6) Arquitectura](#6-arquitectura-alto-nivel)
  - [Pipeline de documentos](#pipeline-de-documentos-detallado)
  - [Automatización futura: Simplificación de Jerga (Agente IA) 🤖](#automatización-futura-simplificación-de-jerga-el-agente-de-ia-)
  - [Visualización y Descarga (Frontend)](#visualización-y-descarga-de-documentos-frontend-)
  - [Explicación sencilla](#explicación-en-lenguaje-sencillo-para-cualquiera)
  - [7) Funcionalidades](#7-funcionalidades-mvp-y-roadmap)
  - [8) Requisitos no funcionales](#8-requisitos-no-funcionales)
  - [9) KPIs](#9-métricas-clave-kpis)
  - [10) Esquema de Base de Datos](#10-esquema-de-base-de-datos-resumen)
  - [11) Cumplimiento](#11-cumplimiento-rgpd--entregabilidad)
  - [12) Riesgos y mitigación](#12-riesgos-y-mitigación)
  - [13) Definición de Hecho](#13-definición-de-hecho-dod)
  - [14) Estándares de desarrollo](#14-estándares-de-desarrollo)
  - [15) Planes y Precios (Admin)](#15-planes-y-precios-admin)
  - [16) MCP para Cursor (Model Context/Communication Protocol)](#16-mcp-para-cursor-model-contextcommunication-protocol)
- [02. Backlog](#02-documento-de-tareas-backlog-ejecutable)
- [Convenciones IA](#convenciones-para-la-ia-cursorchatgpt)
- [Guías de Mensajería/UI](#guías-de-mensajeríaui-texto-base)
- [Anexos](#anexos)

# 01. Documento de Requisitos (Contexto)

> Finalidad: servir como **base de conocimiento** para IAs de desarrollo (Cursor, ChatGPT) y para el equipo. No contiene asesoramiento legal; el servicio **no** presta asesoría jurídica/fiscal, solo **traducción pedagógica** y conexión con profesionales.

**Principio DRY y consolidación**: este documento evita redundancias; cada tema se define una única vez y las demás secciones remiten aquí. *Excepción*: se mantiene el **texto resumen del proyecto** para comunicación a usuarios no técnicos.

## 1) Problema a resolver y contexto

- **Problema**: Muchas personas no entienden el **lenguaje legal, técnico o administrativo** y reciben documentos administrativos/legales (AEAT, Seguridad Social, ayuntamientos, banca, seguros, multas y otros documentos administrativos o legales de lectura compleja) difíciles de comprender, por lo que a menudo no saben exactamente **qué se les pide** (administración, gabinetes, gestorías, reclamaciones de terceros, etc.). Esto provoca errores, plazos incumplidos y ansiedad.
- **Solución**: Plataforma que **traduce** (explica en lenguaje común) los documentos, extrae puntos clave (plazos, importes, acciones) y **conecta** con profesionales (gestorías/abogados) cuando se requiere intervención humana especializada.
- **Modelo**: B2C (usuarios finales) + B2B2C (directorio/red de partners). **Revisión humana** presente en fases iniciales por control de calidad.
- **Limitación**: Sin asesoría legal directa. Toda salida incluye **disclaimer** y propuesta de derivación a profesional cuando corresponda.

## 2) Público objetivo y casos de uso

- **Público**: Personas sin formación jurídica, autónomos, pymes; segmentación por tipo de trámite (AEAT, Seguridad Social, DGT, multas/expedientes sancionadores, banca/seguros, vivienda/IBI/ITV, etc.).
- **Casos de uso**:
  1. Subir PDF/captura de una carta oficial → obtener **resumen claro**, pasos a seguir y **plazos**.
  2. Consultar dudas sobre un concepto (p. ej., recargo/apremio) con explicación simple.
  3. **Encuentra partner** (gestoría/abogado) por especialidad y provincia.
  4. Generar **checklist** de documentos para un trámite.
  5. Interpretar una **multa de tráfico** o **sanción administrativa** (p. ej., DGT/municipal): identificar plazos (pronto pago/recurso), importes y **opciones** (alegaciones, reposición) en lenguaje claro.
  6. Generar **checklist orientativo de posibles recursos** (alegaciones, reposición, recurso de alzada/revisión, etc.), con aviso de que son **orientativos** y pueden requerir **acciones o justificantes previos**; **no garantizan** el éxito del recurso y se recomienda valoración de un partner.

## 3) Propuesta de valor

- **Entiende qué te piden** (administración, gabinetes, gestorías o terceros) y **qué hacer ahora** (pasos y plazos claros).
- Explicación **pedagógica** y accionable en **minutos** cuando el flujo esté automatizado; **en esta fase inicial puede requerir horas**.
- **Estandarización** de respuestas y trazabilidad (historial del usuario).
- **Escalabilidad** vía IA + red de partners.
- **Cumplimiento** de las leyes españolas aplicables (**RGPD/LOPDGDD**) y **buenas prácticas de programación, seguridad y hardening** para garantizar la ciberseguridad de todos los elementos del proyecto; además, **entregabilidad** (SPF/DKIM/DMARC).

## 4) Alcance (Scope) y No-alcance (Out of scope)

**Alcance inicial (MVP):**

- Formularios **Contacto** y **Partners** plenamente operativos.
- Subida de documentos (PDF/JPG/PNG), extracción de texto y **traducción pedagógica**.
- **Recepción y tratamiento por agente**: en **fase inicial**, los documentos se **almacenan en la base de datos** y se **notifica por email al equipo** ([**hola@traductorburocratico.es**](mailto\:hola@traductorburocratico.es)) para revisión; el usuario recibe el **informe por email**. En una **fase avanzada**, se guardan en DB, pasan por **interpretación previa de IA**, **revisión humana** y aparecen **botones de Validación/Rechazo** para gestionar pedidos y asegurar máxima calidad.
- **Pagos** (Stripe) para servicios bajo demanda.
- **Área de usuario** (historial, descargas, facturas) + **Panel admin/operaciones** básico.
- **Directorio de partners** con captación de leads.

**Fuera de alcance** (MVP):

- Representación ante la administración.
- Firma electrónica, registro oficial de escritos, y custodia legal de expedientes.
- Asesoría legal personalizada (se deriva a partner).

## 5) Stack tecnológico recomendado

- **Frontend**: React + Vite. UI components (shadcn/ui opcional), Tailwind. Routing (react-router). State (Zustand/Context). i18n (es/es-ES prioritario).
- **Backend**: Supabase (Postgres + Auth + Storage **para el almacenamiento de documentos**) + **Edge Functions** (TypeScript). **Node.js v20 LTS** para **Edge Functions** y scripts/CLI.
- **AI**: ChatGPT / OpenAI API (textos), pipelines para extracción de texto (pdfparse/ocr) y normalización.
- **Pagos**: Stripe (Checkout + Webhooks).
- **Infra/Hosting**: **Hostinger** (despliegue **actual**). **Frontend** React + Vite servido como sitio estático en Hostinger. **Backend** en **Supabase** gestionado: Postgres/Auth/Storage y **Edge Functions**. *(Alternativa futura para FE: Vercel/Netlify).*
- **Email**: Proveedor SMTP/transactional; DNS con **SPF, DKIM, DMARC** activos; dominio de envío: **mail.traductorburocratico.es**.
- **DevEx**: GitHub, ramas `feat/`, `fix/`, `chore/`. CI/CD (ESLint + Prettier; Vitest/Playwright donde aplique). `.env`, `.env.local`, `.env.example`.

## 6) Arquitectura (alto nivel)

**Alojamiento y despliegue**: Frontend **React+Vite** alojado en **Hostinger** (estático). Backend en **Supabase Edge Functions** con **Postgres/Auth/Storage** gestionado por Supabase.

**Orquestador externo (no crítico)**: Para **workflows operativos no críticos** (p. ej., *screening* de nuevos partners, informes periódicos de KPIs, tareas programadas), se usará un **Orquestador** (p. ej., *n8n*, *Temporal*, *cron workers*). Mantener las **Edge Functions** centradas en la **ruta crítica** (seguridad/rendimiento): ``, ``, ``, **procesamiento asíncrono** y **prompts LLM**.

**Flujo B2C**: Usuario → FE (React) → Supabase Auth → Storage (`uploads/`, privado; subida directa desde FE) → DB (`documents`, insert con `storage_path`) → Activación (A: FE llama `process_document`; B **recomendado**: Realtime/DB tras *INSERT*; C: trigger Postgres http/pg\_net opcional) → Edge (extracción/IA) → DB (`analyses` + actualización de `requests`) → Storage (`reports/`, privado; entrega mediante **Signed URL**) → Email/Stripe → FE (resultado/descarga) → derivación a partner.

**Flujo Partners**: Form → validación interna → alta en directorio → recepción de leads → panel básico de estado.

### Pipeline de documentos (detallado)

1. **Subida (Frontend)**: componente React selecciona archivo y lo sube **directo a Supabase Storage** (`uploads/`).
2. **Registro (DB)**: FE crea fila en `` con `storage_path`, `mime`, `sha256`, y asocia/crea ``.
3. **Activación**:
   - **A. Llamada directa** desde FE a **Edge Function **`` con `storage_path` y `request_id`.
   - **B. Realtime/DB (recomendado)**: suscripción a `documents` que, tras *INSERT*, **notifica/lanza** el procesamiento en servidor (sin exponer endpoint ni depender de extensiones).
   - **C. Trigger DB (opcional)**: *INSERT* en `documents` dispara **trigger Postgres** (ext. http/pg\_net) que invoca la Edge Function.
4. **Descarga del archivo (Edge)**: la función obtiene el binario desde Storage. 4.5 **Optimización (opcional)**: si el `mime` es **imagen** y el tamaño supera el umbral (p. ej., > **X MB**), la Edge Function **reduce resolución/peso** antes de OCR para acelerar el procesamiento.
5. **Extracción**: según tipo de archivo → PDF (`pdf-parse`/`pdfjs`), imagen (OCR), DOCX (`mammoth`), CSV/JSON (parsers nativos). **Normaliza** texto (encoding, ruido, idioma).
6. **Sanitización/Anonimización de PII (obligatoria)**: antes de invocar al LLM, la Edge Function **filtra/anonimiza** PII **no necesaria** para la traducción pedagógica.
7. **Análisis IA (opcional)**: envía el texto al LLM (API) para **resumen**, **flags** (plazos/importes) y ``** (orientativo)**.
8. **Persistencia**: guarda en `` y actualiza `` (`processing`→`needs_review`).
9. **Revisión humana**: el agente valida/edita y marca **Validar/Rechazar**; si valida, genera **PDF** en `reports/` y entrega vía **Signed URL**.

### Automatización Futura: Simplificación de Jerga (El Agente de IA) 🤖

**Objetivo**: transformar textos legales/administrativos en lenguaje claro, manteniendo la **exactitud** del significado y resaltando **plazos**, **documentos requeridos** y **opciones**.

**A) Activación y Extracción (Edge Function – Fase inicial)**

- **Activación**: el usuario pulsa **“Simplificar documento”** en el frontend (React).
- **Extracción de texto**: la Edge Function (TypeScript) descarga el archivo desde **Supabase Storage** y extrae el **texto plano** con librerías Node/TS (p. ej., `pdf-parse`, `mammoth`, OCR si es imagen).

**B) Procesamiento de Jerga (Edge – Agente de IA)**

- **Llamada al LLM**: se envía el texto a un **LLM** (OpenAI/Gemini u otro) con una **instrucción precisa** (*prompt*) que define tareas y límites.
- **Prompt ejemplo**:

> Eres un experto en comunicación legal y administrativa. Toma el siguiente texto y **simplifica su jerga**. Debes crear un documento con cada cláusula o párrafo en **términos sencillos** y comprensibles para un ciudadano **sin conocimientos legales**, manteniendo la **exactitud** del significado original y realizando un **resumen de fechas de entrega**, **documentos o datos que reclaman** (si procede) así como un **texto breve** con las **mejores opciones** o alternativas a tomar. Si se necesitan **alegaciones**, indica **por dónde se puede atacar**, **siempre** con un **disclaimer** de que **esto no es asesoría**, solo **pedagógico**.
>
> **Guardarraíles**: no propongas **argumentos legales específicos** ni afirmes la **viabilidad** de recursos. Limítate a **opciones procedimentales** (alegación/reposición/alzada **si procede**) con **disclaimer** y recomendación de consultar a un profesional. Si faltan datos, **pide aclaraciones** o señala **ambigüedades**.

- **Seguridad**: las **Edge Functions** preservan las **claves** de la API; nunca se exponen en el frontend.

**C) Resultado y Persistencia (Edge – Fase final)**

- **Formato de salida**: texto simplificado → (i) **guardar en DB** (campo en `analyses` vinculado al original) y/o (ii) **generar PDF/DOCX** y subirlo a ``.
- **Actualización de UI**: notificar al frontend (por ejemplo, **Supabase Realtime**) cuando la versión esté lista para **ver/descargar**.

---

### Visualización y Descarga de Documentos (Frontend) 🖥️

**Contexto**: Los archivos se guardan en **Supabase Storage** (buckets **privados**). Para mostrarlos o descargarlos desde la web necesitamos una **URL firmada temporal**.

**A) Estrategias de acceso**

- **Opción 1 — (No aplicable)**: **No se usarán buckets públicos para documentos de usuarios; todos son sensibles**.
- **Opción 2 — URLs firmadas (obligatorio)**: bucket **privado** → generar **URL firmada temporal** (p. ej., 60 s) **siempre** desde **Edge Function **`` tras verificar **RLS/consentimientos/pagos** y registrar en `audit_logs`.
  - **En Edge Function (obligatorio en prod)** para no exponer rutas ni lógicas, verificar permisos y auditar accesos.
  - **Desde el cliente** con supabase-js **(NO permitido en producción para documentos de usuario)**; solo válido en demos/sandbox.

**B) Implementación en React**

- **Descarga** (enlace con `download`):

```jsx
<a href={documentUrl} target="_blank" rel="noopener noreferrer" download={fileName}>
  Descargar Documento
</a>
```

- **Visualización** (PDF en `<iframe>`, imágenes con `<img>`):

```jsx
{fileType === 'pdf' && (
  <iframe src={documentUrl} width="100%" height="600" title="Visualizador de Documento" />
)}
```

- **Obtener URL firmada (solo demo, NO producción)**:

```ts
// Evitar en producción para documentos de usuario
const { data } = await supabase.storage.from('reports').createSignedUrl(storagePath, 60);
const documentUrl = data?.signedUrl;
```

- **Edge Function recomendada (esquema)**:

```ts
// POST /functions/v1/get_signed_url { bucket, path, expiresIn }
// Valida autenticación/rol, verifica RLS/consentimientos/pagos, registra audit log y devuelve URL firmada
```

**C) Buenas prácticas**

- Usa **buckets privados** y **expiraciones cortas**; registra **todas** las descargas.
- Verifica que el usuario es **owner** o tiene autorización válida **antes** de emitir la URL.
- Muestra en UI: fuente, fecha, tamaño y aviso de confidencialidad.

---

### Explicación en lenguaje sencillo (para cualquiera)

1. **Subes tu documento** (foto o PDF) desde la web.
2. **Lo guardamos de forma privada** en nuestro almacén seguro.
3. **Creamos una ficha de tu caso** con los datos mínimos (para poder seguirlo y entregarte el resultado).
4. **Lo leemos automáticamente**: extraemos el texto y, si hace falta, una **IA** identifica qué te piden, los **plazos** y los **importes**.
5. **Una persona lo revisa** y **valida o rechaza** el resultado para asegurar calidad.
6. **Te entregamos un resumen claro** con **qué te piden**, **qué hacer ahora** y **cuándo**. Si procede, añadimos un **checklist orientativo de recursos** y la opción de hablar con un **partner**.

> **Tiempos**: estamos en fase inicial y el proceso puede tardar **horas**; cuando esté plenamente automatizado, la entrega será en **minutos**.
>
> **Seguridad y privacidad**: almacenamos y transmitimos los datos de forma segura, con acceso limitado y por el tiempo **mínimo necesario**. Puedes solicitar su **borrado** cuando quieras.

**Resumen (Edge Function)**

| Paso | Acción                      | Herramienta                                      |
| ---- | --------------------------- | ------------------------------------------------ |
| 1    | Obtener archivo del Storage | Supabase Client (Edge)                           |
| 2    | Extraer texto               | Librería Node/TS (pdf-parse/mammoth/OCR)         |
| 3    | Sanitizar PII               | Rutina de anonimización previa al LLM            |
| 4    | Análisis IA (opcional)      | API LLM (OpenAI/Gemini/otro)                     |
| 5    | Guardar resultado           | Supabase Client → Postgres (`analyses/requests`) |

### Estados visibles para el cliente (UX & Realtime)

- **Tras enviar**: el usuario ve un mensaje **“Solicitud aceptada”** y vuelve a su **dashboard**. La nueva solicitud aparece con estado **“En proceso”**.

- **Estados de la traducción** (mapeo UI ⇄ backend):

  | Backend `requests.status` | UI (cliente)             | Quién lo cambia       | Disparadores                                        |
  | ------------------------- | ------------------------ | --------------------- | --------------------------------------------------- |
  | `new`                     | **Aceptado**             | Sistema (FE/Edge)     | Inserción de `request` y acuse al usuario           |
  | `processing`              | **En proceso**           | Edge/worker           | Extracción/IA en curso                              |
  | `needs_review`            | **En revisión**          | Edge → Revisor humano | IA finaliza; pendiente de validación                |
  | `ready`                   | **Listo para descargar** | Revisor (Validar)     | Generación de informe en `reports/`                 |
  | `delivered`               | **Entregado**            | Sistema               | Usuario descarga/confirmación de entrega            |
  | `rejected`                | **Rechazado**            | Revisor (Rechazar)    | Informe inválido/incompleto; se notifica al usuario |
  | `archived`                | **Archivado**            | Admin/Automático      | Cierre por antigüedad/solicitud del usuario         |

- **Realtime**: el dashboard suscribe a `requests` del usuario y **actualiza en vivo** el estado y las acciones disponibles (p. ej., mostrar botón **Descargar** solo en `ready/delivered`).

> **Fase inicial**: el revisor humano puede tardar **horas** en estudiar/trasladar el caso. **Futuro**: IA reducirá tiempos y dejará los casos **a la espera del revisor**.

## 7) Funcionalidades (MVP y roadmap)

1. **Auth/Perfiles**: registro/email OTP, roles: `cliente`, `agente`, `partner`, `admin`.
2. **Subida de documentos** con validación de tamaño/formatos; hash para duplicados.
3. **Extracción de texto** (pdf, ocr si imagen) y normalización (limpieza, detección de idioma).
4. **Traducción pedagógica** con IA (prompting estandarizado) y **flags de riesgo** (plazos, importes, sanciones, **recursos\_posibles orientativos**).
5. **Revisión humana**: checklist de QA, edición del informe y **botones Validar/Rechazar** (transiciones `needs_review` → `ready`/`archived`; registro en `audit_logs`).
6. **Entrega**: vista web + **PDF** descargable con branding y disclaimer.
7. **Pagos**: precio por servicio, packs y **add‑ons**. Facturación y recibos vía Stripe.
8. **Área de usuario**: historial, documentos, facturas.
9. **Directorio de partners** y **lead routing**.
10. **Formularios** Contacto/Partners con notificaciones y estado.
11. **Operaciones/Admin**: panel de tickets, SLAs, asignación.
12. **Cumplimiento**: RGPD consent, políticas, retención/borrado.
13. **Checklist de recursos (orientativo)**: generación automática según el tipo de documento (p. ej., multas), explicando **requisitos previos** posibles y **límites**; incluir CTA de derivación a partner.

> Cada funcionalidad debe incluir **Criterios de Aceptación**, **tracking** (eventos) y **métricas** (ver §9–12).

## 8) Requisitos no funcionales

- **Seguridad**: RLS activa en todas las tablas, principio de mínimo privilegio, cifrado en tránsito y en reposo. Validación de inputs. Políticas de caducidad de datos.
- **Privacidad**: minimización, consentimiento explícito, logs anonimizados.
- **Rendimiento**: TTFB < 500ms FE (estático). **Límite de archivo: 20 MB**. Las Edge Functions deben **responder en <5s** con **202 Accepted** si el trabajo excede el tiempo permitido y **continuar en asíncrono** (Realtime + colas/cron/worker). **Time‑outs**: segmentar documentos largos, paginar OCR y **resumir** antes de enviar al LLM para controlar tokens.
- **Disponibilidad**: 99.5%.
- **Observabilidad**: logs estructurados, métricas y alertas básicas.

### Checklist de Hardening (resumen)

- **Cuentas & Auth**: 2FA/TOTP para `admin`/`agente`; sesiones con expiración; principio de mínimo privilegio; roles separados (`cliente`, `agente`, `partner`, `admin`).
- **Supabase**: **RLS ON en todas las tablas**; tests de políticas; claves `anon`/`service_role` rotadas y nunca expuestas en FE; buckets privados con **Signed URLs**.
- **Secretos & Config**: variables en gestor de secretos; rotación trimestral; nada de secretos en el repo; partición de permisos por entorno (dev/pre/prod).
- **Red & AppSec**: TLS ≥1.2 + **HSTS**; **CSP** restrictiva; `X-Content-Type-Options: nosniff`; `Referrer-Policy: no-referrer`; `Permissions-Policy` mínima; `frame-ancestors` limitado; **CORS** con allowlist; WAF/rate‑limit para endpoints y webhooks.
- **Abuso/Formularios**: validación server‑side; límites de tamaño; comprobación MIME; antivirus/clamd opcional; **CAPTCHA** (Turnstile/reCAPTCHA) en formularios públicos.
- **Pagos**: verificación de firma de **Stripe Webhooks** + idempotency keys; lógica sensible solo en servidor/Edge.
- **Datos & Backups**: cifrado en reposo; backups diarios cifrados (retención ≥30 días); prueba de restauración mensual; política de retención/borrado.
- **Dependencias**: Dependabot/SCA activado; lockfiles y versiones fijadas; revisión de licencias.
- **Monitorización/Auditoría**: logs estructurados; **audit\_logs** para acciones admin/partner; alertas por picos 401/403/5xx.

### SLA de Seguridad (resumen)

- **Sev 0 – Brecha activa/PII exfiltrada**: *ACK ≤1h*, mitigación inmediata, notificación a afectados/autoridad **≤72h** (RGPD).
- **Sev 1 – Vulnerabilidad crítica explotable**: *ACK ≤4h*, corrección o mitigación **≤24h**.
- **Sev 2 – Alta sin explotación confirmada**: *ACK ≤8h*, corrección **≤3 días**.
- **Sev 3 – Media/Baja**: *ACK ≤2 días*, corrección **≤14 días**.
- **Backups/DR**: **RPO 24h**, **RTO 24h**; restauración probada mensualmente.
- **Parches**: ventana mensual de actualizaciones de seguridad.

> **RLS y riesgo**: La **Row-Level Security** está diseñada para **mitigar Broken Access Control**, asegurando que cada usuario accede **solo** a **sus** documentos y solicitudes.

## 9) Métricas clave (KPIs)

- Conversión: visita→subida doc→pago.
- Tasa de derivación a partner y NPS.
- Tiempo medio de entrega (IA + revisión).
- Tasa de reembolso/incidencias.
- Entregabilidad email (open rate, bounce, spam-rate).

## 10) Esquema de Base de Datos (resumen)

> Notación simplificada; tipos Postgres. **RLS = ON** por defecto.

- **profiles** *(1:1 con auth.users)*

  - id **uuid** PK (ref auth.users)
  - role **text** CHECK IN ('cliente','agente','partner','admin')
  - full\_name **text**, phone **text**, province **text**
  - created\_at **timestamptz**

- **documents**

  - id **uuid** PK, user\_id **uuid** FK→profiles
  - storage\_path **text**, mime **text**, sha256 **text** UNIQUE
  - source **text** CHECK IN ('upload','email')
  - created\_at **timestamptz**

- **requests**

  - id **uuid** PK, user\_id **uuid** FK→profiles, document\_id **uuid** FK→documents, agent\_id **uuid** NULL FK→profiles
  - status **text** CHECK IN ('new','processing','needs\_review','ready','delivered','rejected','archived')
  - priority **int** DEFAULT 0, partner\_id **uuid** NULL FK→partners
  - created\_at **timestamptz**

- **analyses**

  - id **uuid** PK, request\_id **uuid** FK→requests
  - ai\_summary **text**, ai\_flags **jsonb** (deadlines, amounts, risk\_level)
  - human\_review **bool**, reviewer\_id **uuid** NULL FK→profiles
  - final\_report\_url **text**
  - updated\_at **timestamptz**

- **payments**

  - id **uuid** PK, request\_id **uuid** FK→requests
  - stripe\_pi **text**, amount\_cents **int**, currency **text** DEFAULT 'EUR'
  - status **text** CHECK IN ('requires\_payment','paid','refunded','failed')
  - purpose **text** CHECK IN ('initial\_service','follow\_up\_qa')
  - created\_at **timestamptz**

- **pricing\_plans** (catálogo de planes)

  - id **uuid** PK, name **text**, description **text**
  - kind **text** CHECK IN ('unit','pack'), docs\_included **int** NULL
  - stripe\_product\_id **text**, stripe\_price\_id **text**, currency **text** DEFAULT 'EUR', amount\_cents **int**
  - active **bool** DEFAULT true, visible **bool** DEFAULT true, created\_at **timestamptz**

- **pricing\_addons** (catálogo de add‑ons)

  - id **uuid** PK, name **text**, description **text**
  - stripe\_product\_id **text**, stripe\_price\_id **text**, currency **text** DEFAULT 'EUR', amount\_cents **int**
  - active **bool** DEFAULT true, visible **bool** DEFAULT true, created\_at **timestamptz**

- **purchase\_items** (detalle de compra)

  - id **uuid** PK, payment\_id **uuid** FK→payments
  - item\_type **text** CHECK IN ('plan','addon'), item\_id **uuid** (FK lógico a `pricing_plans`/`pricing_addons`)
  - quantity **int** DEFAULT 1, metadata **jsonb**, created\_at **timestamptz**

- **partners**

  - id **uuid** PK, user\_id **uuid** FK→profiles
  - firm\_name **text**, specialties **text[]**, verified **bool**

- **partner\_applications** (formulario de alta)

  - id **uuid** PK, name **text**, email **text**, phone **text**
  - specialties **text[]**, province **text**, notes **text**
  - status **text** CHECK IN ('received','screening','approved','rejected')
  - created\_at **timestamptz**

- **contact\_messages** (formulario contacto)

  - id **uuid** PK, name **text**, email **text**, subject **text**, message **text**
  - status **text** CHECK IN ('received','replied','closed')
  - created\_at **timestamptz**

- **webhooks**

  - id **uuid** PK, provider **text**, event\_type **text**, payload **jsonb**, received\_at **timestamptz**

- **audit\_logs**

  - id **uuid** PK, actor\_id **uuid** FK→profiles, action **text**, entity **text**, entity\_id **uuid**, at **timestamptz**

- **consents**

  - id **uuid** PK, user\_id **uuid** FK→profiles, scope **text**, granted\_at **timestamptz**

**Buckets de Storage**: `uploads/` (privado; documentos de entrada), `reports/` (privado; PDFs entregables vía **Signed URL**), `public/branding/` (público lectura; solo admin escribe). **Nunca** almacenar documentos de usuario en buckets públicos. **Retención** alineada con §11 (12 meses por defecto).

**Políticas RLS**: cada fila visible/gestionable por su **owner** o por `admin`.

- **Agente**: puede ver/editar los **requests asignados** (`requests.agent_id = auth.uid()`). Puede **leer** `documents` y `profiles` **solo** cuando están **relacionados** con esos `requests` (joins controlados por políticas). No puede listar documentos de otros casos.
- **Partner**: acceso **solo** cuando: (i) el `partner` está **asignado** al `request`; (ii) existe **consentimiento** del cliente (`consents.scope='share_with_partner'`); y (iii) constan **pagos confirmados**: cliente (`payments.status='paid'`) y partner (suscripción activa o pago por lead).
- **Trazabilidad**: todo acceso queda en `audit_logs`.

## 11) Cumplimiento (RGPD & entregabilidad)

- **Consentimiento** granular (finalidades: traducción pedagógica, contacto comercial, derivación a partner).
- **Minimización**: solo datos necesarios. **Retención**: 12 meses por defecto (configurable), opción de borrado.
- **Encargos**: contratos con proveedores (Supabase, Stripe, email, hosting).
- **Email**: SPF + DKIM + DMARC `p=reject` en dominios productivos, monitorización `rua=`.

## 12) Riesgos y mitigación

- **Intrusismo profesional**: disclaimers claros, derivación temprana a partner, registro de límites del servicio.
- **Calidad IA**: revisión humana, datasets de ejemplo, feedback loop.
- **Privacidad**: PIA/DPIA ligera, cifrado y RLS, controles de acceso.
- **Entregabilidad**: warmup dominios, bounce handling.

## 13) Definición de Hecho (DoD)

- **TDD obligatorio**: *tests primero*. La suite debe cubrir los **criterios de aceptación** de cada historia.
- Código con lint/tests, cobertura clave (unit + e2e donde aplique).
- Logs + métricas de uso básicos.
- Textos legales y consentimientos visibles.
- Accesibilidad AA básica.
- Manual de operación actualizado en KB.

## 14) Estándares de desarrollo

- **Convenciones Git**: `feat/xxx`, `fix/xxx`, Conventional Commits.
- **Calidad**: ESLint + Prettier; PR con checklist (seguridad, RLS, RGPD, DX).
- **Config**: `.env.example` completo; nunca secretos en repo.
- **Nomenclatura**:
  - Código/archivos/rutas → **snake\_case**.
  - Componentes React/clases → **PascalCase**.
- **Docs**: cada cambio relevante → actualización de esta KB.
- **Runtime**: **Node.js v20 LTS** (Edge Functions y tooling). Define `engines.node: ">=20 <21"` en `package.json`, añade `.nvmrc` con `20` y usa `actions/setup-node@v4` con `node-version: 20` en CI.

## 15) Planes y Precios (Admin)

**Objetivo**: permitir que **Administración** cree/edite/elimine **planes de precio** y **add‑ons** para el checkout, controlando qué incluye cada plan (unidad o pack de documentos) y los extras opcionales.

**Modelos soportados**

- **Unitario**: pago por **1 documento** procesado.
- **Pack de documentos**: pago único por **N documentos** (bonos con consumo). Incluye reglas de **caducidad** y **consumo parcial**.
- **Add‑ons opcionales**: extras seleccionables en checkout (p. ej., **prioridad**, **revisión adicional**, **traducción a otro idioma**). Se cobran **además** del plan base.

**Gestión (solo Admin)**

- **Crear/editar/eliminar** planes y add‑ons; **activar/desactivar** visibilidad.
- Definir: **nombre**, **descripción**, **precio** (moneda/impuestos), **incluidos** (N documentos), **límite de tamaño/formatos**, **vigencia** y **política de reembolso**.
- Asociar **Stripe Product/Price IDs**; todo cambio queda en ``. Mutaciones restringidas por **RLS** a rol **admin**.

**Checkout & cumplimiento**

- UI de **selector de plan** + **checklist de add‑ons**.
- Webhook de Stripe **concilia** pagos y crea **derechos** de uso: para **unitario**, 1 crédito; para **pack**, N créditos; para add‑ons, marcas específicas por `request_id`.
- Entrega del informe final **bloqueada** hasta `payments.status='paid'`. Todos los accesos y descargas se registran en ``.

**KPIs**: ARPU, AOV, tasa de **attach** de add‑ons, tasa de conversión por plan, reembolsos.

**Riesgos**: claridad de **no asesoría**; gestión de expectativas en packs; reembolsos según política.

**Criterios de aceptación**

- Admin puede **crear/editar/eliminar** plan y **aparece**/desaparece en el checkout.
- Stripe Price ID **válido** y reflejado en compra; webhooks crean/actualizan `payments` y créditos.
- Add‑ons aplican correctamente al `request` y se muestran en el informe/descarga.

---

## 16) MCP para Cursor (Model Context/Communication Protocol)

**Objetivo**: Proveer un **protocolo común** para que **Cursor** (y otras IAs/IDEs compatibles con MCP) interactúen de forma **segura, coherente y auditada** con el proyecto (código, base de datos, storage, Edge Functions, Stripe, etc.), alineado con RGPD y nuestras políticas.

### Alcance

- **Sólo herramientas permitidas (allow‑list)** y **lectura preferente**. Las operaciones de escritura pasan por **Edge Functions** específicas (validaciones + RLS + auditoría).
- **Sin secretos en el cliente**: MCP Server gestiona claves vía **variables de entorno**. Nunca exponer `service_role` ni claves privadas.

### Componentes

- **Servidor MCP**: `tb-mcp` (Node.js v20). Provee *tools* y *resources* a Cursor.
- **Proveedores**: Supabase (DB/Storage/Edge), Stripe (pagos), FS (workspace), HTTP (allow‑list de endpoints internos), GitHub (repos), Email provider (sólo plantillas).

### Tools expuestas (catálogo mínimo)

1. `storage.get_signed_url`

   - **Descripción**: Obtiene **URL firmada** llamando a **Edge **`` (server‑side).
   - **Args (JSON Schema)**:
     ```json
     {"type":"object","properties":{"bucket":{"type":"string","enum":["reports","uploads"]},"path":{"type":"string"},"expiresIn":{"type":"integer","minimum":30,"maximum":3600}},"required":["bucket","path"]}
     ```
   - **Permisos**: requiere `auth.user` y comprobaciones (RLS/consentimientos/pagos).
   - **Rate limit**: 5/min por usuario.
   - **Audit**: registra en `audit_logs`.

2. `documents.process_document`

   - **Descripción**: Encola el **procesamiento** (extracción + normalización + IA opcional).
   - **Args**: `{ request_id: uuid }`.
   - **Ejecución**: delega en **Edge **``.
   - **Salida**: `{ status: 'accepted' | 'running' | 'done' | 'error' }`.

3. `documents.simplify_document`

   - **Descripción**: Ejecuta la **simplificación de jerga**.
   - **Args**: `{ request_id: uuid, language?: 'es' | 'en' }`.
   - **Ejecución**: **Edge **`` (incluye **sanitización PII** previa).
   - **Salida**: URL/ID del informe en `reports/`.

4. `requests.update_status`

   - **Descripción**: Cambia `requests.status` sólo a través de **Edge **`` (valida transiciones y rol).
   - **Args**: `{ request_id: uuid, to: 'ready' | 'rejected' | 'archived' }`.
   - **Permisos**: `agente`/`admin`.

5. `payments.lookup`

   - **Descripción**: Lectura segura del pago asociado a `request_id`.
   - **Args**: `{ request_id: uuid }`.
   - **Fuente**: DB `payments` (lectura con RLS).
   - **Salida**: estado + `purpose` + `amount_cents`.

6. `kb.load`

   - **Descripción**: Carga documentos de **KB** (ruta allow‑list) para contextos de IA.
   - **Args**: `{ path: string }`.
   - **Seguridad**: sólo rutas del repo `docs/`.

7. `pii.sanitize_preview`

   - **Descripción**: Simula sanitización (en local) para revisar redacciones antes de enviar al LLM.
   - **Args**: `{ text: string }`.
   - **Nota**: la sanitización **real** ocurre en Edge.

> **No se exponen** tools de escritura directa en DB/Storage. Toda mutación pasa por Edge Functions con controles y auditoría.

### Resources (lectura)

- `fs.read` (workspace del repo, allow‑list `src/`, `docs/`, `sql/`).
- `http.fetch` (allow‑list: `https://<supabase>/functions/v1/*`, `https://api.stripe.com/*` **sólo GET** con claves *restricted*).
- `git.*` (lecturas de ramas y diffs).

### Seguridad y cumplimiento (MCP)

- **PII & RGPD**: redacción de PII en **logs** (hash/mascarado).
- **Scopes**: cada tool define **rol mínimo** (cliente/agente/partner/admin).
- **Rate limiting** y **circuit breakers** por IP/usuario.
- **Auditoría**: todas las invocaciones relevantes → `audit_logs`.
- **Prohibido**: subir secretos o usar `service_role`.

### Ejemplo de configuración para Cursor

`cursor.mcp.json` (en la raíz del repo):

```json
{
  "mcpServers": {
    "tb-mcp": {
      "command": "node",
      "args": ["./mcp/server.js"],
      "env": {
        "SUPABASE_URL": "${env:SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${env:SUPABASE_ANON_KEY}",
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "STRIPE_RESTRICTED_KEY": "${env:STRIPE_RESTRICTED_KEY}"
      }
    }
  }
}
```

### DoD (MCP)

- Server `tb-mcp` con **Node.js v20** y tests básicos.
- Tools anteriores implementadas (stub si procede) + **allow‑list** de endpoints.
- `.env.example` actualizado (sin valores reales).
- **Docs** en `docs/visual-studio-mcp.md` con usos, ejemplos y roles.
- Prueba manual en Cursor: invocación `storage.get_signed_url` y `documents.process_document` con respuesta 202.

---

# 02. Documento de Tareas (Backlog ejecutable)

> Lista para abordar **una a una**. Cada tarea incluye **criterios de aceptación**.

## Sprint 0 — Fundaciones (1 semana)

1. **Repo & CI/CD**\
   *Hacer*: Configurar GitHub, ramas, ESLint/Prettier, Vitest, workflows CI.\
   *Aceptación*: PR crea app React+Vite base, CI verde, `README` y `.env.example`.
2. **Supabase bootstrap**\
   *Hacer*: Proyecto, auth email, RLS ON, tablas mínimas (§10), buckets.\
   *Aceptación*: Seeds + políticas RLS probadas con dos roles.
3. **Entregabilidad email**\
   *Hacer*: Proveedor SMTP/transactional, DNS SPF/DKIM/DMARC, plantillas.\
   *Aceptación*: 3 correos de prueba entregados (contacto, alta, ticket).
4. **MCP – Servidor **``** (bootstrap)**\
   *Hacer*: Estructura `mcp/server.ts|js`, configuración `cursor.mcp.json`, tool `storage.get_signed_url` → Edge.\
   *Aceptación*: Invocación desde Cursor devuelve URL firmada válida (demo) sin exponer secretos.

## Sprint 1 — Formularios y Operativa básica (1–2 semanas)

5. **Formulario Contacto**\
   *Hacer*: Validación FE, Edge Function `send-contact-email`, inserción `contact_messages`.\
   *Aceptación*: Registro en DB + email al equipo + respuesta automática al usuario.
6. **Formulario Partners**\
   *Hacer*: Alta en `partner_applications`, validación, notificaciones.\
   *Aceptación*: Cambiar estado `received→screening` desde panel admin.
7. **Panel Operaciones (mínimo)**\
   *Hacer*: Lista de `contact_messages` y `partner_applications`, filtros, estados.\
   *Aceptación*: Cambios de estado persistidos y auditados.

## Sprint 2 — Documentos y Traducción pedagógica (2–3 semanas)

8. **Upload & Storage**\
   *Hacer*: Subida segura (20MB), hash duplicados, vista previa.\
   *Aceptación*: Archivo en `uploads/`, registro en `documents`, **disparo de **``** vía Realtime/DB (recomendado)** o **llamada FE** (fallback); **trigger http/pg\_net opcional**. Respuesta **202 Accepted** y seguimiento de estado en UI.
9. **Extracción de texto (PDF/OCR)**\
   *Hacer*: Pipeline TS en Edge Function; fallback OCR para imágenes.\
   *Aceptación*: Texto normalizado guardado en `analyses`.
10. **Sanitización de PII (obligatoria)**\
    *Hacer*: Implementar rutina previa al LLM (en Edge) para filtrar/anonimizar PII no necesaria.\
    *Aceptación*: Logs de auditoría + tests unitarios de sanitización.
11. **Traducción pedagógica IA**\
    *Hacer*: Prompt estandarizado + flags (plazos/importes).\
    *Aceptación*: Resumen en lectura fácil + lista de acciones.
12. **Auditoría de Seguridad (Agente Auditor)**\
    *Hacer*: Revisión del código de Sprint 2 (RLS + Hardening checklist).\
    *Aceptación*: Informe de hallazgos + fixes priorizados.

## Sprint 3 — Pagos, Área de usuario y Partners (2 semanas)

13. **Stripe Checkout + Webhooks**\
    *Hacer*: Pago por servicio; `payments` y conciliación webhook.\
    *Aceptación*: Flujo end‑to‑end: sin pago no hay descarga final.
14. **Catálogo de Planes y Add‑ons (Admin)**\
    *Hacer*: CRUD de planes (unitario, pack) y add‑ons; asociar Stripe Product/Price; flags de visibilidad.\
    *Aceptación*: Planes y add‑ons configurables por Admin, visibles en checkout; webhooks asignan **créditos** (1 o N) y marcan add‑ons por request.
15. **Área Usuario**\
    *Hacer*: Historial de solicitudes, descargas, facturas, estados en tiempo real.\
    *Aceptación*: Usuario ve sus requests (RLS), su estado y puede re‑descargar informes.
16. **Auditoría de Seguridad (Agente Auditor)**\
    *Hacer*: Revisión del código de Sprint 3 (Stripe + permisos de acceso + Signed URLs).\
    *Aceptación*: Informe de hallazgos + fixes priorizados.

## Sprint 4 — Automatización: Simplificación de Jerga (1–2 semanas)

17. **Botón “Simplificar documento” (FE)**\
    *Hacer*: Añadir CTA en detalle de request; estado de procesamiento; mensajes de éxito/error.\
    *Aceptación*: Lanza `simplify_document` y muestra estado hasta “listo para ver/descargar”.
18. **Edge Function **``\
    *Hacer*: Descargar desde Storage, extraer texto, **sanitizar PII**, invocar LLM con prompt, guardar versión simplificada en `analyses`, generar PDF en `reports/`.\
    *Aceptación*: Registro completo en DB + fichero en `reports/` accesible vía Signed URL.
19. **Realtime & permisos**\
    *Hacer*: Notificación Realtime al cliente; verificación RLS/consentimientos/pagos antes de emitir URL firmada.\
    *Aceptación*: UI recibe evento y habilita ver/descargar; `audit_logs` registra acceso.

---

## Convenciones para la IA (Cursor/ChatGPT)

> Usa esto como *prompt de sistema* al trabajar con este repositorio.

1. **Rol principal**: *AI Dev Assistant* para Traductor Burocrático. Entrega código **listo para PR**, seguro (RLS/inputs), con comentarios breves y *DoD* cumplido.

2. **Subagentes especializados**:

   - **Agente Arquitecto**: valida arquitectura, genera **diagramas** (componentes, datos, permisos) y detecta puntos únicos de fallo; propone mitigaciones.
   - **Agente Auditor de Seguridad**: revisa código, **RLS**, **Hardening checklist**, cabeceras, CSP, CORS, Signed URLs y flujos de pago; emite informe y fixes.
   - **Agente PM**: genera planes de proyecto, estimaciones, **riesgos** y dependencias a partir de esta KB.

3. **Orquestación**: Las tareas **no críticas** (p. ej., *screening* de partners, informes de KPIs, recordatorios) pueden delegarse a un **Orquestador** externo. Las **Edge Functions** se reservan para **lógica crítica** (seguridad, rendimiento, LLM, Signed URLs, asíncronos).

4. **Estándares**: React+Vite, TypeScript, ESLint/Prettier, Vitest, **Node.js v20 LTS**. Supabase (Auth/DB/Storage, RLS). Stripe.

5. **Salidas**:

   - Código + explicación corta.
   - Migraciones SQL y políticas RLS.
   - Actualiza `.env.example` si introduces nuevas vars.
   - Tests (TDD) cuando tenga sentido.

6. **Seguridad & RGPD**: No registres datos sensibles en logs. Aplica **minimización**, **sanitización de PII previa al LLM** y **controles por rol**.

7. **Mensajería**: UI con **disclaimer** de no asesoría. Evita jerga; sé claro. Para **multas/recursos**, añade: *"El siguiente checklist de posibles recursos es ****orientativo****. Su procedencia puede requerir ****actuaciones o justificantes previos**** y ****no garantiza**** el éxito del recurso. Para una valoración profesional, contacta con un partner."*

8. **Ramas/Commits**: Conventional Commits (`feat:`, `fix:`). PR con checklist.

9. **UX**: Formularios con validación, estados vacíos, feedback de errores, accesibilidad.

10. **Performance**: Evita llamadas IA bloqueantes; usa Edge/colas si >10s.

11. **Guardarraíles legales**: No proponer **estrategias/argumentos legales específicos** ni afirmar **viabilidad**. Limitarse a opciones p

12. **Signed URLs (server‑side only)**: Para reports/, la generación de URLs firmadas debe estar encapsulada en get_signed_url; el FE no debe usar supabase.storage.createSignedUrl() directamente.

13. **Fuentes canónicas (KB)**: Antes de proponer cambios, consulta y prioriza las rutas de `docs/canonical-sources.md`. Si un cambio afecta a requisitos/esquema/MCP, actualiza ese fichero en la PR.
14. Placeholders y nombres: consulta la politica en docs/placeholders-policy.md

