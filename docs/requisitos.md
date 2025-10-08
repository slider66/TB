---

## title: "Traductor Burocratico – Requisitos (Contexto) y Plan de Tareas"

version: 1.3\
last\_updated: 2025-10-05\
owners: ["Producto: Usuario", "Tech: Usuario"]\
status: Draft\
kb\_scope: ["Traductor Burocratico", "Directorios de profesionales", "IA asistentes (Cursor, ChatGPT)"]

## indice

- [01. Requisitos (Contexto)](#01-documento-de-requisitos-contexto)
  - [1) Problema y contexto](#1-problema-a-resolver-y-contexto)
  - [2) PUblico y casos de uso](#2-pUblico-objetivo-y-casos-de-uso)
  - [3) Propuesta de valor](#3-propuesta-de-valor)
  - [4) Alcance y no-alcance](#4-alcance-scope-y-no-alcance-out-of-scope)
  - [5) Stack tecnolOgico](#5-stack-tecnolOgico-recomendado)
  - [6) Arquitectura](#6-arquitectura-alto-nivel)
  - [Pipeline de documentos](#pipeline-de-documentos-detallado)
  - [AutomatizaciOn futura: SimplificaciOn de Jerga (Agente IA) 🤖](#automatizaciOn-futura-simplificaciOn-de-jerga-el-agente-de-ia-)
  - [VisualizaciOn y Descarga (Frontend)](#visualizaciOn-y-descarga-de-documentos-frontend-)
  - [ExplicaciOn sencilla](#explicaciOn-en-lenguaje-sencillo-para-cualquiera)
  - [7) Funcionalidades](#7-funcionalidades-mvp-y-roadmap)
  - [8) Requisitos no funcionales](#8-requisitos-no-funcionales)
  - [9) KPIs](#9-metricas-clave-kpis)
  - [10) Esquema de Base de Datos](#10-esquema-de-base-de-datos-resumen)
  - [11) Cumplimiento](#11-cumplimiento-rgpd--entregabilidad)
  - [12) Riesgos y mitigaciOn](#12-riesgos-y-mitigaciOn)
  - [13) DefiniciOn de Hecho](#13-definiciOn-de-hecho-dod)
  - [14) Estandares de desarrollo](#14-estandares-de-desarrollo)
  - [15) Planes y Precios (Admin)](#15-planes-y-precios-admin)
  - [16) MCP para Cursor (Model Context/Communication Protocol)](#16-mcp-para-cursor-model-contextcommunication-protocol)
- [02. Backlog](#02-documento-de-tareas-backlog-ejecutable)
- [Convenciones IA](#convenciones-para-la-ia-cursorchatgpt)
- [Guias de Mensajeria/UI](#guias-de-mensajeriaui-texto-base)
- [Anexos](#anexos)

# 01. Documento de Requisitos (Contexto)

> Finalidad: servir como **base de conocimiento** para IAs de desarrollo (Cursor, ChatGPT) y para el equipo. No contiene asesoramiento legal; el servicio **no** presta asesoria juridica/fiscal, solo **traducciOn pedagOgica** y conexiOn con profesionales.

* *Principio DRY y consolidaciOn**: este documento evita redundancias; cada tema se define una Unica vez y las demas secciones remiten aqui. *ExcepciOn*: se mantiene el **texto resumen del proyecto** para comunicaciOn a usuarios no tecnicos.

## 1) Problema a resolver y contexto

- **Problema**: Muchas personas no entienden el **lenguaje legal, tecnico o administrativo** y reciben documentos administrativos/legales (AEAT, Seguridad Social, ayuntamientos, banca, seguros, multas y otros documentos administrativos o legales de lectura compleja) dificiles de comprender, por lo que a menudo no saben exactamente **que se les pide** (administraciOn, gabinetes, gestorias, reclamaciones de terceros, etc.). Esto provoca errores, plazos incumplidos y ansiedad.
- **SoluciOn**: Plataforma que **traduce** (explica en lenguaje comUn) los documentos, extrae puntos clave (plazos, importes, acciones) y **conecta** con profesionales (gestorias/abogados) cuando se requiere intervenciOn humana especializada.
- **Modelo**: B2C (usuarios finales) + B2B2C (directorio/red de partners). **RevisiOn humana** presente en fases iniciales por control de calidad.
- **LimitaciOn**: Sin asesoria legal directa. Toda salida incluye **disclaimer** y propuesta de derivaciOn a profesional cuando corresponda.

## 2) PUblico objetivo y casos de uso

- **PUblico**: Personas sin formaciOn juridica, autOnomos, pymes; segmentaciOn por tipo de tramite (AEAT, Seguridad Social, DGT, multas/expedientes sancionadores, banca/seguros, vivienda/IBI/ITV, etc.).
- **Casos de uso**:
  1. Subir PDF/captura de una carta oficial → obtener **resumen claro**, pasos a seguir y **plazos**.
  2. Consultar dudas sobre un concepto (p. ej., recargo/apremio) con explicaciOn simple.
  3. **Encuentra partner** (gestoria/abogado) por especialidad y provincia.
  4. Generar **checklist** de documentos para un tramite.
  5. Interpretar una **multa de trafico** o **sanciOn administrativa** (p. ej., DGT/municipal): identificar plazos (pronto pago/recurso), importes y **opciones** (alegaciones, reposiciOn) en lenguaje claro.
  6. Generar **checklist orientativo de posibles recursos** (alegaciones, reposiciOn, recurso de alzada/revisiOn, etc.), con aviso de que son **orientativos** y pueden requerir **acciones o justificantes previos**; **no garantizan** el exito del recurso y se recomienda valoraciOn de un partner.

## 3) Propuesta de valor

- **Entiende que te piden** (administraciOn, gabinetes, gestorias o terceros) y **que hacer ahora** (pasos y plazos claros).
- ExplicaciOn **pedagOgica** y accionable en **minutos** cuando el flujo este automatizado; **en esta fase inicial puede requerir horas**.
- **EstandarizaciOn** de respuestas y trazabilidad (historial del usuario).
- **Escalabilidad** via IA + red de partners.
- **Cumplimiento** de las leyes espanolas aplicables (**RGPD/LOPDGDD**) y **buenas practicas de programaciOn, seguridad y hardening** para garantizar la ciberseguridad de todos los elementos del proyecto; ademas, **entregabilidad** (SPF/DKIM/DMARC).

## 4) Alcance (Scope) y No-alcance (Out of scope)

* *Alcance inicial (MVP):**

- Formularios **Contacto** y **Partners** plenamente operativos.
- Subida de documentos (PDF/JPG/PNG), extracciOn de texto y **traducciOn pedagOgica**.
- **RecepciOn y tratamiento por agente**: en **fase inicial**, los documentos se **almacenan en la base de datos** y se **notifica por email al equipo** ([**hola@traductorburocratico.es**](mailto\:hola@traductorburocratico.es)) para revisiOn; el usuario recibe el **informe por email**. En una **fase avanzada**, se guardan en DB, pasan por **interpretaciOn previa de IA**, **revisiOn humana** y aparecen **botones de ValidaciOn/Rechazo** para gestionar pedidos y asegurar maxima calidad.
- **Pagos** (Stripe) para servicios bajo demanda.
- **Area de usuario** (historial, descargas, facturas) + **Panel admin/operaciones** basico.
- **Directorio de partners** con captaciOn de leads.

* *Fuera de alcance** (MVP):

- RepresentaciOn ante la administraciOn.
- Firma electrOnica, registro oficial de escritos, y custodia legal de expedientes.
- Asesoria legal personalizada (se deriva a partner).

## 5) Stack tecnolOgico recomendado

- **Frontend**: React + Vite. UI components (shadcn/ui opcional), Tailwind. Routing (react-router). State (Zustand/Context). i18n (es/es-ES prioritario).
- **Backend**: Supabase (Postgres + Auth + Storage **para el almacenamiento de documentos**) + **Edge Functions** (TypeScript). **Node.js v20 LTS** para **Edge Functions** y scripts/CLI.
- **AI**: ChatGPT / OpenAI API (textos), pipelines para extracciOn de texto (pdfparse/ocr) y normalizaciOn.
- **Pagos**: Stripe (Checkout + Webhooks).
- **Infra/Hosting**: **Hostinger** (despliegue **actual**). **Frontend** React + Vite servido como sitio estatico en Hostinger. **Backend** en **Supabase** gestionado: Postgres/Auth/Storage y **Edge Functions**. *(Alternativa futura para FE: Vercel/Netlify).*
- **Email**: Proveedor SMTP/transactional; DNS con **SPF, DKIM, DMARC** activos; dominio de envio: **mail.traductorburocratico.es**.
- **DevEx**: GitHub, ramas `feat/`, `fix/`, `chore/`. CI/CD (ESLint + Prettier; Vitest/Playwright donde aplique). `.env`, `.env.local`, `.env.example`.

## 6) Arquitectura (alto nivel)

* *Alojamiento y despliegue**: Frontend **React+Vite** alojado en **Hostinger** (estatico). Backend en **Supabase Edge Functions** con **Postgres/Auth/Storage** gestionado por Supabase.

* *Orquestador externo (no critico)**: Para **workflows operativos no criticos** (p. ej., *screening* de nuevos partners, informes periOdicos de KPIs, tareas programadas), se usara un **Orquestador** (p. ej., *n8n*, *Temporal*, *cron workers*). Mantener las **Edge Functions** centradas en la **ruta critica** (seguridad/rendimiento): ``, ``, ``, **procesamiento asincrono** y **prompts LLM**.

* *Flujo B2C**: Usuario → FE (React) → Supabase Auth → Storage (`uploads/`, privado; subida directa desde FE) → DB (`documents`, insert con `storage_path`) → ActivaciOn (A: FE llama `process_document`; B **recomendado**: Realtime/DB tras *INSERT*; C: trigger Postgres http/pg\_net opcional) → Edge (extracciOn/IA) → DB (`analyses` + actualizaciOn de `requests`) → Storage (`reports/`, privado; entrega mediante **Signed URL**) → Email/Stripe → FE (resultado/descarga) → derivaciOn a partner.

* *Flujo Partners**: Form → validaciOn interna → alta en directorio → recepciOn de leads → panel basico de estado.

### Pipeline de documentos (detallado)

1. **Subida (Frontend)**: componente React selecciona archivo y lo sube **directo a Supabase Storage** (`uploads/`).
2. **Registro (DB)**: FE crea fila en `` con `storage_path`, `mime`, `sha256`, y asocia/crea ``.
3. **ActivaciOn**:
   - **A. Llamada directa** desde FE a **Edge Function **`` con `storage_path` y `request_id`.
   - **B. Realtime/DB (recomendado)**: suscripciOn a `documents` que, tras *INSERT*, **notifica/lanza** el procesamiento en servidor (sin exponer endpoint ni depender de extensiones).
   - **C. Trigger DB (opcional)**: *INSERT* en `documents` dispara **trigger Postgres** (ext. http/pg\_net) que invoca la Edge Function.
4. **Descarga del archivo (Edge)**: la funciOn obtiene el binario desde Storage. 4.5 **OptimizaciOn (opcional)**: si el `mime` es **imagen** y el tamano supera el umbral (p. ej., > **X MB**), la Edge Function **reduce resoluciOn/peso** antes de OCR para acelerar el procesamiento.
5. **ExtracciOn**: segUn tipo de archivo → PDF (`pdf-parse`/`pdfjs`), imagen (OCR), DOCX (`mammoth`), CSV/JSON (parsers nativos). **Normaliza** texto (encoding, ruido, idioma).
6. **SanitizaciOn/AnonimizaciOn de PII (obligatoria)**: antes de invocar al LLM, la Edge Function **filtra/anonimiza** PII **no necesaria** para la traducciOn pedagOgica.
7. **Analisis IA (opcional)**: envia el texto al LLM (API) para **resumen**, **flags** (plazos/importes) y ``** (orientativo)**.
8. **Persistencia**: guarda en `` y actualiza `` (`processing`→`needs_review`).
9. **RevisiOn humana**: el agente valida/edita y marca **Validar/Rechazar**; si valida, genera **PDF** en `reports/` y entrega via **Signed URL**.

### AutomatizaciOn Futura: SimplificaciOn de Jerga (El Agente de IA) 🤖

* *Objetivo**: transformar textos legales/administrativos en lenguaje claro, manteniendo la **exactitud** del significado y resaltando **plazos**, **documentos requeridos** y **opciones**.

* *A) ActivaciOn y ExtracciOn (Edge Function – Fase inicial)**

- **ActivaciOn**: el usuario pulsa **“Simplificar documento”** en el frontend (React).
- **ExtracciOn de texto**: la Edge Function (TypeScript) descarga el archivo desde **Supabase Storage** y extrae el **texto plano** con librerias Node/TS (p. ej., `pdf-parse`, `mammoth`, OCR si es imagen).

* *B) Procesamiento de Jerga (Edge – Agente de IA)**

- **Llamada al LLM**: se envia el texto a un **LLM** (OpenAI/Gemini u otro) con una **instrucciOn precisa** (*prompt*) que define tareas y limites.
- **Prompt ejemplo**:

> Eres un experto en comunicaciOn legal y administrativa. Toma el siguiente texto y **simplifica su jerga**. Debes crear un documento con cada clausula o parrafo en **terminos sencillos** y comprensibles para un ciudadano **sin conocimientos legales**, manteniendo la **exactitud** del significado original y realizando un **resumen de fechas de entrega**, **documentos o datos que reclaman** (si procede) asi como un **texto breve** con las **mejores opciones** o alternativas a tomar. Si se necesitan **alegaciones**, indica **por dOnde se puede atacar**, **siempre** con un **disclaimer** de que **esto no es asesoria**, solo **pedagOgico**.
>
> **Guardarrailes**: no propongas **argumentos legales especificos** ni afirmes la **viabilidad** de recursos. Limitate a **opciones procedimentales** (alegaciOn/reposiciOn/alzada **si procede**) con **disclaimer** y recomendaciOn de consultar a un profesional. Si faltan datos, **pide aclaraciones** o senala **ambigüedades**.

- **Seguridad**: las **Edge Functions** preservan las **claves** de la API; nunca se exponen en el frontend.

* *C) Resultado y Persistencia (Edge – Fase final)**

- **Formato de salida**: texto simplificado → (i) **guardar en DB** (campo en `analyses` vinculado al original) y/o (ii) **generar PDF/DOCX** y subirlo a ``.
- **ActualizaciOn de UI**: notificar al frontend (por ejemplo, **Supabase Realtime**) cuando la versiOn este lista para **ver/descargar**.

---

### VisualizaciOn y Descarga de Documentos (Frontend) 🖥️

* *Contexto**: Los archivos se guardan en **Supabase Storage** (buckets **privados**). Para mostrarlos o descargarlos desde la web necesitamos una **URL firmada temporal**.

* *A) Estrategias de acceso**

- **OpciOn 1 — (No aplicable)**: **No se usaran buckets pUblicos para documentos de usuarios; todos son sensibles**.
- **OpciOn 2 — URLs firmadas (obligatorio)**: bucket **privado** → generar **URL firmada temporal** (p. ej., 60 s) **siempre** desde **Edge Function **`` tras verificar **RLS/consentimientos/pagos** y registrar en `audit_logs`.
  - **En Edge Function (obligatorio en prod)** para no exponer rutas ni lOgicas, verificar permisos y auditar accesos.
  - **Desde el cliente** con supabase-js **(NO permitido en producciOn para documentos de usuario)**; solo valido en demos/sandbox.

* *B) ImplementaciOn en React**

- **Descarga** (enlace con `download`):

```jsx
<a href={documentUrl} target="_blank" rel="noopener noreferrer" download={fileName}>
  Descargar Documento
</a>
```

- **VisualizaciOn** (PDF en `<iframe>`, imagenes con `<img>`):

```jsx
{fileType === 'pdf' && (
  <iframe src={documentUrl} width="100%" height="600" title="Visualizador de Documento" />
)}
```

- **Obtener URL firmada (solo demo, NO producciOn)**:

```ts
// Evitar en producciOn para documentos de usuario
const { data } = await supabase.storage.from('reports').createSignedUrl(storagePath, 60);
const documentUrl = data?.signedUrl;
```

- **Edge Function recomendada (esquema)**:

```ts
// POST /functions/v1/get_signed_url { bucket, path, expiresIn }
// Valida autenticaciOn/rol, verifica RLS/consentimientos/pagos, registra audit log y devuelve URL firmada
```

* *C) Buenas practicas**

- Usa **buckets privados** y **expiraciones cortas**; registra **todas** las descargas.
- Verifica que el usuario es **owner** o tiene autorizaciOn valida **antes** de emitir la URL.
- Muestra en UI: fuente, fecha, tamano y aviso de confidencialidad.

---

### ExplicaciOn en lenguaje sencillo (para cualquiera)

1. **Subes tu documento** (foto o PDF) desde la web.
2. **Lo guardamos de forma privada** en nuestro almacen seguro.
3. **Creamos una ficha de tu caso** con los datos minimos (para poder seguirlo y entregarte el resultado).
4. **Lo leemos automaticamente**: extraemos el texto y, si hace falta, una **IA** identifica que te piden, los **plazos** y los **importes**.
5. **Una persona lo revisa** y **valida o rechaza** el resultado para asegurar calidad.
6. **Te entregamos un resumen claro** con **que te piden**, **que hacer ahora** y **cuando**. Si procede, anadimos un **checklist orientativo de recursos** y la opciOn de hablar con un **partner**.

> **Tiempos**: estamos en fase inicial y el proceso puede tardar **horas**; cuando este plenamente automatizado, la entrega sera en **minutos**.
>
> **Seguridad y privacidad**: almacenamos y transmitimos los datos de forma segura, con acceso limitado y por el tiempo **minimo necesario**. Puedes solicitar su **borrado** cuando quieras.

* *Resumen (Edge Function)**

| Paso | AcciOn                      | Herramienta                                      |
| ---- | --------------------------- | ------------------------------------------------ |
| 1    | Obtener archivo del Storage | Supabase Client (Edge)                           |
| 2    | Extraer texto               | Libreria Node/TS (pdf-parse/mammoth/OCR)         |
| 3    | Sanitizar PII               | Rutina de anonimizaciOn previa al LLM            |
| 4    | Analisis IA (opcional)      | API LLM (OpenAI/Gemini/otro)                     |
| 5    | Guardar resultado           | Supabase Client → Postgres (`analyses/requests`) |

### Estados visibles para el cliente (UX & Realtime)

- **Tras enviar**: el usuario ve un mensaje **“Solicitud aceptada”** y vuelve a su **dashboard**. La nueva solicitud aparece con estado **“En proceso”**.

- **Estados de la traducciOn** (mapeo UI ⇄ backend):

  | Backend `requests.status` | UI (cliente)             | Quien lo cambia       | Disparadores                                        |
  | ------------------------- | ------------------------ | --------------------- | --------------------------------------------------- |
  | `new`                     | **Aceptado**             | Sistema (FE/Edge)     | InserciOn de `request` y acuse al usuario           |
  | `processing`              | **En proceso**           | Edge/worker           | ExtracciOn/IA en curso                              |
  | `needs_review`            | **En revisiOn**          | Edge → Revisor humano | IA finaliza; pendiente de validaciOn                |
  | `ready`                   | **Listo para descargar** | Revisor (Validar)     | GeneraciOn de informe en `reports/`                 |
  | `delivered`               | **Entregado**            | Sistema               | Usuario descarga/confirmaciOn de entrega            |
  | `rejected`                | **Rechazado**            | Revisor (Rechazar)    | Informe invalido/incompleto; se notifica al usuario |
  | `archived`                | **Archivado**            | Admin/Automatico      | Cierre por antigüedad/solicitud del usuario         |

- **Realtime**: el dashboard suscribe a `requests` del usuario y **actualiza en vivo** el estado y las acciones disponibles (p. ej., mostrar botOn **Descargar** solo en `ready/delivered`).

> **Fase inicial**: el revisor humano puede tardar **horas** en estudiar/trasladar el caso. **Futuro**: IA reducira tiempos y dejara los casos **a la espera del revisor**.

## 7) Funcionalidades (MVP y roadmap)

1. **Auth/Perfiles**: registro/email OTP, roles: `cliente`, `agente`, `partner`, `admin`.
2. **Subida de documentos** con validaciOn de tamano/formatos; hash para duplicados.
3. **ExtracciOn de texto** (pdf, ocr si imagen) y normalizaciOn (limpieza, detecciOn de idioma).
4. **TraducciOn pedagOgica** con IA (prompting estandarizado) y **flags de riesgo** (plazos, importes, sanciones, **recursos\_posibles orientativos**).
5. **RevisiOn humana**: checklist de QA, ediciOn del informe y **botones Validar/Rechazar** (transiciones `needs_review` → `ready`/`archived`; registro en `audit_logs`).
6. **Entrega**: vista web + **PDF** descargable con branding y disclaimer.
7. **Pagos**: precio por servicio, packs y **add‑ons**. FacturaciOn y recibos via Stripe.
8. **Area de usuario**: historial, documentos, facturas.
9. **Directorio de partners** y **lead routing**.
10. **Formularios** Contacto/Partners con notificaciones y estado.
11. **Operaciones/Admin**: panel de tickets, SLAs, asignaciOn.
12. **Cumplimiento**: RGPD consent, politicas, retenciOn/borrado.
13. **Checklist de recursos (orientativo)**: generaciOn automatica segUn el tipo de documento (p. ej., multas), explicando **requisitos previos** posibles y **limites**; incluir CTA de derivaciOn a partner.

> Cada funcionalidad debe incluir **Criterios de AceptaciOn**, **tracking** (eventos) y **metricas** (ver §9–12).

## 8) Requisitos no funcionales

- **Seguridad**: RLS activa en todas las tablas, principio de minimo privilegio, cifrado en transito y en reposo. ValidaciOn de inputs. Politicas de caducidad de datos.
- **Privacidad**: minimizaciOn, consentimiento explicito, logs anonimizados.
- **Rendimiento**: TTFB < 500ms FE (estatico). **Limite de archivo: 20 MB**. Las Edge Functions deben **responder en <5s** con **202 Accepted** si el trabajo excede el tiempo permitido y **continuar en asincrono** (Realtime + colas/cron/worker). **Time‑outs**: segmentar documentos largos, paginar OCR y **resumir** antes de enviar al LLM para controlar tokens.
- **Disponibilidad**: 99.5%.
- **Observabilidad**: logs estructurados, metricas y alertas basicas.

### Checklist de Hardening (resumen)

- **Cuentas & Auth**: 2FA/TOTP para `admin`/`agente`; sesiones con expiraciOn; principio de minimo privilegio; roles separados (`cliente`, `agente`, `partner`, `admin`).
- **Supabase**: **RLS ON en todas las tablas**; tests de politicas; claves `anon`/`service_role` rotadas y nunca expuestas en FE; buckets privados con **Signed URLs**.
- **Secretos & Config**: variables en gestor de secretos; rotaciOn trimestral; nada de secretos en el repo; particiOn de permisos por entorno (dev/pre/prod).
- **Red & AppSec**: TLS ≥1.2 + **HSTS**; **CSP** restrictiva; `X-Content-Type-Options: nosniff`; `Referrer-Policy: no-referrer`; `Permissions-Policy` minima; `frame-ancestors` limitado; **CORS** con allowlist; WAF/rate‑limit para endpoints y webhooks.
- **Abuso/Formularios**: validaciOn server‑side; limites de tamano; comprobaciOn MIME; antivirus/clamd opcional; **CAPTCHA** (Turnstile/reCAPTCHA) en formularios pUblicos.
- **Pagos**: verificaciOn de firma de **Stripe Webhooks** + idempotency keys; lOgica sensible solo en servidor/Edge.
- **Datos & Backups**: cifrado en reposo; backups diarios cifrados (retenciOn ≥30 dias); prueba de restauraciOn mensual; politica de retenciOn/borrado.
- **Dependencias**: Dependabot/SCA activado; lockfiles y versiones fijadas; revisiOn de licencias.
- **MonitorizaciOn/Auditoria**: logs estructurados; **audit\_logs** para acciones admin/partner; alertas por picos 401/403/5xx.

### SLA de Seguridad (resumen)

- **Sev 0 – Brecha activa/PII exfiltrada**: *ACK ≤1h*, mitigaciOn inmediata, notificaciOn a afectados/autoridad **≤72h** (RGPD).
- **Sev 1 – Vulnerabilidad critica explotable**: *ACK ≤4h*, correcciOn o mitigaciOn **≤24h**.
- **Sev 2 – Alta sin explotaciOn confirmada**: *ACK ≤8h*, correcciOn **≤3 dias**.
- **Sev 3 – Media/Baja**: *ACK ≤2 dias*, correcciOn **≤14 dias**.
- **Backups/DR**: **RPO 24h**, **RTO 24h**; restauraciOn probada mensualmente.
- **Parches**: ventana mensual de actualizaciones de seguridad.

> **RLS y riesgo**: La **Row-Level Security** esta disenada para **mitigar Broken Access Control**, asegurando que cada usuario accede **solo** a **sus** documentos y solicitudes.

## 9) Metricas clave (KPIs)

- ConversiOn: visita→subida doc→pago.
- Tasa de derivaciOn a partner y NPS.
- Tiempo medio de entrega (IA + revisiOn).
- Tasa de reembolso/incidencias.
- Entregabilidad email (open rate, bounce, spam-rate).

## 10) Esquema de Base de Datos (resumen)

> NotaciOn simplificada; tipos Postgres. **RLS = ON** por defecto.

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

- **pricing\_plans** (catalogo de planes)

  - id **uuid** PK, name **text**, description **text**
  - kind **text** CHECK IN ('unit','pack'), docs\_included **int** NULL
  - stripe\_product\_id **text**, stripe\_price\_id **text**, currency **text** DEFAULT 'EUR', amount\_cents **int**
  - active **bool** DEFAULT true, visible **bool** DEFAULT true, created\_at **timestamptz**

- **pricing\_addons** (catalogo de add‑ons)

  - id **uuid** PK, name **text**, description **text**
  - stripe\_product\_id **text**, stripe\_price\_id **text**, currency **text** DEFAULT 'EUR', amount\_cents **int**
  - active **bool** DEFAULT true, visible **bool** DEFAULT true, created\_at **timestamptz**

- **purchase\_items** (detalle de compra)

  - id **uuid** PK, payment\_id **uuid** FK→payments
  - item\_type **text** CHECK IN ('plan','addon'), item\_id **uuid** (FK lOgico a `pricing_plans`/`pricing_addons`)
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

* *Buckets de Storage**: `uploads/` (privado; documentos de entrada), `reports/` (privado; PDFs entregables via **Signed URL**), `public/branding/` (pUblico lectura; solo admin escribe). **Nunca** almacenar documentos de usuario en buckets pUblicos. **RetenciOn** alineada con §11 (12 meses por defecto).

* *Politicas RLS**: cada fila visible/gestionable por su **owner** o por `admin`.

- **Agente**: puede ver/editar los **requests asignados** (`requests.agent_id = auth.uid()`). Puede **leer** `documents` y `profiles` **solo** cuando estan **relacionados** con esos `requests` (joins controlados por politicas). No puede listar documentos de otros casos.
- **Partner**: acceso **solo** cuando: (i) el `partner` esta **asignado** al `request`; (ii) existe **consentimiento** del cliente (`consents.scope='share_with_partner'`); y (iii) constan **pagos confirmados**: cliente (`payments.status='paid'`) y partner (suscripciOn activa o pago por lead).
- **Trazabilidad**: todo acceso queda en `audit_logs`.

## 11) Cumplimiento (RGPD & entregabilidad)

- **Consentimiento** granular (finalidades: traducciOn pedagOgica, contacto comercial, derivaciOn a partner).
- **MinimizaciOn**: solo datos necesarios. **RetenciOn**: 12 meses por defecto (configurable), opciOn de borrado.
- **Encargos**: contratos con proveedores (Supabase, Stripe, email, hosting).
- **Email**: SPF + DKIM + DMARC `p=reject` en dominios productivos, monitorizaciOn `rua=`.

## 12) Riesgos y mitigaciOn

- **Intrusismo profesional**: disclaimers claros, derivaciOn temprana a partner, registro de limites del servicio.
- **Calidad IA**: revisiOn humana, datasets de ejemplo, feedback loop.
- **Privacidad**: PIA/DPIA ligera, cifrado y RLS, controles de acceso.
- **Entregabilidad**: warmup dominios, bounce handling.

## 13) DefiniciOn de Hecho (DoD)

- **TDD obligatorio**: *tests primero*. La suite debe cubrir los **criterios de aceptaciOn** de cada historia.
- COdigo con lint/tests, cobertura clave (unit + e2e donde aplique).
- Logs + metricas de uso basicos.
- Textos legales y consentimientos visibles.
- Accesibilidad AA basica.
- Manual de operaciOn actualizado en KB.

## 14) Estandares de desarrollo

- **Convenciones Git**: `feat/xxx`, `fix/xxx`, Conventional Commits.
- **Calidad**: ESLint + Prettier; PR con checklist (seguridad, RLS, RGPD, DX).
- **Config**: `.env.example` completo; nunca secretos en repo.
- **Nomenclatura**:
  - COdigo/archivos/rutas → **snake\_case**.
  - Componentes React/clases → **PascalCase**.
- **Docs**: cada cambio relevante → actualizaciOn de esta KB.
- **Runtime**: **Node.js v20 LTS** (Edge Functions y tooling). Define `engines.node: ">=20 <21"` en `package.json`, anade `.nvmrc` con `20` y usa `actions/setup-node@v4` con `node-version: 20` en CI.

## 15) Planes y Precios (Admin)

* *Objetivo**: permitir que **AdministraciOn** cree/edite/elimine **planes de precio** y **add‑ons** para el checkout, controlando que incluye cada plan (unidad o pack de documentos) y los extras opcionales.

* *Modelos soportados**

- **Unitario**: pago por **1 documento** procesado.
- **Pack de documentos**: pago Unico por **N documentos** (bonos con consumo). Incluye reglas de **caducidad** y **consumo parcial**.
- **Add‑ons opcionales**: extras seleccionables en checkout (p. ej., **prioridad**, **revisiOn adicional**, **traducciOn a otro idioma**). Se cobran **ademas** del plan base.

* *GestiOn (solo Admin)**

- **Crear/editar/eliminar** planes y add‑ons; **activar/desactivar** visibilidad.
- Definir: **nombre**, **descripciOn**, **precio** (moneda/impuestos), **incluidos** (N documentos), **limite de tamano/formatos**, **vigencia** y **politica de reembolso**.
- Asociar **Stripe Product/Price IDs**; todo cambio queda en ``. Mutaciones restringidas por **RLS** a rol **admin**.

* *Checkout & cumplimiento**

- UI de **selector de plan** + **checklist de add‑ons**.
- Webhook de Stripe **concilia** pagos y crea **derechos** de uso: para **unitario**, 1 credito; para **pack**, N creditos; para add‑ons, marcas especificas por `request_id`.
- Entrega del informe final **bloqueada** hasta `payments.status='paid'`. Todos los accesos y descargas se registran en ``.

* *KPIs**: ARPU, AOV, tasa de **attach** de add‑ons, tasa de conversiOn por plan, reembolsos.

* *Riesgos**: claridad de **no asesoria**; gestiOn de expectativas en packs; reembolsos segUn politica.

* *Criterios de aceptaciOn**

- Admin puede **crear/editar/eliminar** plan y **aparece**/desaparece en el checkout.
- Stripe Price ID **valido** y reflejado en compra; webhooks crean/actualizan `payments` y creditos.
- Add‑ons aplican correctamente al `request` y se muestran en el informe/descarga.

---

## 16) MCP para Cursor (Model Context/Communication Protocol)

* *Objetivo**: Proveer un **protocolo comUn** para que **Cursor** (y otras IAs/IDEs compatibles con MCP) interactUen de forma **segura, coherente y auditada** con el proyecto (cOdigo, base de datos, storage, Edge Functions, Stripe, etc.), alineado con RGPD y nuestras politicas.

### Alcance

- **SOlo herramientas permitidas (allow‑list)** y **lectura preferente**. Las operaciones de escritura pasan por **Edge Functions** especificas (validaciones + RLS + auditoria).
- **Sin secretos en el cliente**: MCP Server gestiona claves via **variables de entorno**. Nunca exponer `service_role` ni claves privadas.

### Componentes

- **Servidor MCP**: `tb-mcp` (Node.js v20). Provee *tools* y *resources* a Cursor.
- **Proveedores**: Supabase (DB/Storage/Edge), Stripe (pagos), FS (workspace), HTTP (allow‑list de endpoints internos), GitHub (repos), Email provider (sOlo plantillas).

### Tools expuestas (catalogo minimo)

1. `storage.get_signed_url`

   - **DescripciOn**: Obtiene **URL firmada** llamando a **Edge **`` (server‑side).
   - **Args (JSON Schema)**:
     ```json
     {"type":"object","properties":{"bucket":{"type":"string","enum":["reports","uploads"]},"path":{"type":"string"},"expiresIn":{"type":"integer","minimum":30,"maximum":3600}},"required":["bucket","path"]}
     ```
   - **Permisos**: requiere `auth.user` y comprobaciones (RLS/consentimientos/pagos).
   - **Rate limit**: 5/min por usuario.
   - **Audit**: registra en `audit_logs`.

2. `documents.process_document`

   - **DescripciOn**: Encola el **procesamiento** (extracciOn + normalizaciOn + IA opcional).
   - **Args**: `{ request_id: uuid }`.
   - **EjecuciOn**: delega en **Edge **``.
   - **Salida**: `{ status: 'accepted' | 'running' | 'done' | 'error' }`.

3. `documents.simplify_document`

   - **DescripciOn**: Ejecuta la **simplificaciOn de jerga**.
   - **Args**: `{ request_id: uuid, language?: 'es' | 'en' }`.
   - **EjecuciOn**: **Edge **`` (incluye **sanitizaciOn PII** previa).
   - **Salida**: URL/ID del informe en `reports/`.

4. `requests.update_status`

   - **DescripciOn**: Cambia `requests.status` sOlo a traves de **Edge **`` (valida transiciones y rol).
   - **Args**: `{ request_id: uuid, to: 'ready' | 'rejected' | 'archived' }`.
   - **Permisos**: `agente`/`admin`.

5. `payments.lookup`

   - **DescripciOn**: Lectura segura del pago asociado a `request_id`.
   - **Args**: `{ request_id: uuid }`.
   - **Fuente**: DB `payments` (lectura con RLS).
   - **Salida**: estado + `purpose` + `amount_cents`.

6. `kb.load`

   - **DescripciOn**: Carga documentos de **KB** (ruta allow‑list) para contextos de IA.
   - **Args**: `{ path: string }`.
   - **Seguridad**: sOlo rutas del repo `kb/`.

7. `pii.sanitize_preview`

   - **DescripciOn**: Simula sanitizaciOn (en local) para revisar redacciones antes de enviar al LLM.
   - **Args**: `{ text: string }`.
   - **Nota**: la sanitizaciOn **real** ocurre en Edge.

> **No se exponen** tools de escritura directa en DB/Storage. Toda mutaciOn pasa por Edge Functions con controles y auditoria.

### Resources (lectura)

- `fs.read` (workspace del repo, allow‑list `src/`, `kb/`, `sql/`).
- `http.fetch` (allow‑list: `https://<supabase>/functions/v1/*`, `https://api.stripe.com/*` **sOlo GET** con claves *restricted*).
- `git.*` (lecturas de ramas y diffs).

### Seguridad y cumplimiento (MCP)

- **PII & RGPD**: redacciOn de PII en **logs** (hash/mascarado).
- **Scopes**: cada tool define **rol minimo** (cliente/agente/partner/admin).
- **Rate limiting** y **circuit breakers** por IP/usuario.
- **Auditoria**: todas las invocaciones relevantes → `audit_logs`.
- **Prohibido**: subir secretos o usar `service_role`.

### Ejemplo de configuraciOn para Cursor

`cursor.mcp.json` (en la raiz del repo):

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

- Server `tb-mcp` con **Node.js v20** y tests basicos.
- Tools anteriores implementadas (stub si procede) + **allow‑list** de endpoints.
- `.env.example` actualizado (sin valores reales).
- **Docs** en `kb/mcp.md` con usos, ejemplos y roles.
- Prueba manual en Cursor: invocaciOn `storage.get_signed_url` y `documents.process_document` con respuesta 202.

---

# 02. Documento de Tareas (Backlog ejecutable)

> Lista para abordar **una a una**. Cada tarea incluye **criterios de aceptaciOn**.

## Sprint 0 — Fundaciones (1 semana)

1. **Repo & CI/CD**\
   *Hacer*: Configurar GitHub, ramas, ESLint/Prettier, Vitest, workflows CI.\
   *AceptaciOn*: PR crea app React+Vite base, CI verde, `README` y `.env.example`.
2. **Supabase bootstrap**\
   *Hacer*: Proyecto, auth email, RLS ON, tablas minimas (§10), buckets.\
   *AceptaciOn*: Seeds + politicas RLS probadas con dos roles.
3. **Entregabilidad email**\
   *Hacer*: Proveedor SMTP/transactional, DNS SPF/DKIM/DMARC, plantillas.\
   *AceptaciOn*: 3 correos de prueba entregados (contacto, alta, ticket).
4. **MCP – Servidor **``** (bootstrap)**\
   *Hacer*: Estructura `mcp/server.ts|js`, configuraciOn `cursor.mcp.json`, tool `storage.get_signed_url` → Edge.\
   *AceptaciOn*: InvocaciOn desde Cursor devuelve URL firmada valida (demo) sin exponer secretos.

## Sprint 1 — Formularios y Operativa basica (1–2 semanas)

5. **Formulario Contacto**\
   *Hacer*: ValidaciOn FE, Edge Function `send-contact-email`, inserciOn `contact_messages`.\
   *AceptaciOn*: Registro en DB + email al equipo + respuesta automatica al usuario.
6. **Formulario Partners**\
   *Hacer*: Alta en `partner_applications`, validaciOn, notificaciones.\
   *AceptaciOn*: Cambiar estado `received→screening` desde panel admin.
7. **Panel Operaciones (minimo)**\
   *Hacer*: Lista de `contact_messages` y `partner_applications`, filtros, estados.\
   *AceptaciOn*: Cambios de estado persistidos y auditados.

## Sprint 2 — Documentos y TraducciOn pedagOgica (2–3 semanas)

8. **Upload & Storage**\
   *Hacer*: Subida segura (20MB), hash duplicados, vista previa.\
   *AceptaciOn*: Archivo en `uploads/`, registro en `documents`, **disparo de **``** via Realtime/DB (recomendado)** o **llamada FE** (fallback); **trigger http/pg\_net opcional**. Respuesta **202 Accepted** y seguimiento de estado en UI.
9. **ExtracciOn de texto (PDF/OCR)**\
   *Hacer*: Pipeline TS en Edge Function; fallback OCR para imagenes.\
   *AceptaciOn*: Texto normalizado guardado en `analyses`.
10. **SanitizaciOn de PII (obligatoria)**\
    *Hacer*: Implementar rutina previa al LLM (en Edge) para filtrar/anonimizar PII no necesaria.\
    *AceptaciOn*: Logs de auditoria + tests unitarios de sanitizaciOn.
11. **TraducciOn pedagOgica IA**\
    *Hacer*: Prompt estandarizado + flags (plazos/importes).\
    *AceptaciOn*: Resumen en lectura facil + lista de acciones.
12. **Auditoria de Seguridad (Agente Auditor)**\
    *Hacer*: RevisiOn del cOdigo de Sprint 2 (RLS + Hardening checklist).\
    *AceptaciOn*: Informe de hallazgos + fixes priorizados.

## Sprint 3 — Pagos, Area de usuario y Partners (2 semanas)

13. **Stripe Checkout + Webhooks**\
    *Hacer*: Pago por servicio; `payments` y conciliaciOn webhook.\
    *AceptaciOn*: Flujo end‑to‑end: sin pago no hay descarga final.
14. **Catalogo de Planes y Add‑ons (Admin)**\
    *Hacer*: CRUD de planes (unitario, pack) y add‑ons; asociar Stripe Product/Price; flags de visibilidad.\
    *AceptaciOn*: Planes y add‑ons configurables por Admin, visibles en checkout; webhooks asignan **creditos** (1 o N) y marcan add‑ons por request.
15. **Area Usuario**\
    *Hacer*: Historial de solicitudes, descargas, facturas, estados en tiempo real.\
    *AceptaciOn*: Usuario ve sus requests (RLS), su estado y puede re‑descargar informes.
16. **Auditoria de Seguridad (Agente Auditor)**\
    *Hacer*: RevisiOn del cOdigo de Sprint 3 (Stripe + permisos de acceso + Signed URLs).\
    *AceptaciOn*: Informe de hallazgos + fixes priorizados.

## Sprint 4 — AutomatizaciOn: SimplificaciOn de Jerga (1–2 semanas)

17. **BotOn “Simplificar documento” (FE)**\
    *Hacer*: Anadir CTA en detalle de request; estado de procesamiento; mensajes de exito/error.\
    *AceptaciOn*: Lanza `simplify_document` y muestra estado hasta “listo para ver/descargar”.
18. **Edge Function **``\
    *Hacer*: Descargar desde Storage, extraer texto, **sanitizar PII**, invocar LLM con prompt, guardar versiOn simplificada en `analyses`, generar PDF en `reports/`.\
    *AceptaciOn*: Registro completo en DB + fichero en `reports/` accesible via Signed URL.
19. **Realtime & permisos**\
    *Hacer*: NotificaciOn Realtime al cliente; verificaciOn RLS/consentimientos/pagos antes de emitir URL firmada.\
    *AceptaciOn*: UI recibe evento y habilita ver/descargar; `audit_logs` registra acceso.

---

## Convenciones para la IA (Cursor/ChatGPT)

> Usa esto como *prompt de sistema* al trabajar con este repositorio.

1. **Rol principal**: *AI Dev Assistant* para Traductor Burocratico. Entrega cOdigo **listo para PR**, seguro (RLS/inputs), con comentarios breves y *DoD* cumplido.

2. **Subagentes especializados**:

   - **Agente Arquitecto**: valida arquitectura, genera **diagramas** (componentes, datos, permisos) y detecta puntos Unicos de fallo; propone mitigaciones.
   - **Agente Auditor de Seguridad**: revisa cOdigo, **RLS**, **Hardening checklist**, cabeceras, CSP, CORS, Signed URLs y flujos de pago; emite informe y fixes.
   - **Agente PM**: genera planes de proyecto, estimaciones, **riesgos** y dependencias a partir de esta KB.

3. **OrquestaciOn**: Las tareas **no criticas** (p. ej., *screening* de partners, informes de KPIs, recordatorios) pueden delegarse a un **Orquestador** externo. Las **Edge Functions** se reservan para **lOgica critica** (seguridad, rendimiento, LLM, Signed URLs, asincronos).

4. **Estandares**: React+Vite, TypeScript, ESLint/Prettier, Vitest, **Node.js v20 LTS**. Supabase (Auth/DB/Storage, RLS). Stripe.

5. **Salidas**:

   - COdigo + explicaciOn corta.
   - Migraciones SQL y politicas RLS.
   - Actualiza `.env.example` si introduces nuevas vars.
   - Tests (TDD) cuando tenga sentido.

6. **Seguridad & RGPD**: No registres datos sensibles en logs. Aplica **minimizaciOn**, **sanitizaciOn de PII previa al LLM** y **controles por rol**.

7. **Mensajeria**: UI con **disclaimer** de no asesoria. Evita jerga; se claro. Para **multas/recursos**, anade: *"El siguiente checklist de posibles recursos es ****orientativo****. Su procedencia puede requerir ****actuaciones o justificantes previos**** y ****no garantiza**** el exito del recurso. Para una valoraciOn profesional, contacta con un partner."*

8. **Ramas/Commits**: Conventional Commits (`feat:`, `fix:`). PR con checklist.

9. **UX**: Formularios con validaciOn, estados vacios, feedback de errores, accesibilidad.

10. **Performance**: Evita llamadas IA bloqueantes; usa Edge/colas si >10s.

11. **Guardarrailes legales**: No proponer **estrategias/argumentos legales especificos** ni afirmar **viabilidad**. Limitarse a opciones p

12. **Signed URLs (server‑side only)**: Para reports/, la generaciOn de URLs firmadas debe estar encapsulada en get_signed_url; el FE no debe usar supabase.storage.createSignedUrl() directamente.

13. **Fuentes canOnicas (KB)**: Antes de proponer cambios, consulta y prioriza las rutas de `kb/canonical_sources.md`. Si un cambio afecta a requisitos/esquema/MCP, actualiza ese fichero en la PR.
14. Placeholders y nombres: consulta la politica en docs/PLACEHOLDERS.md

