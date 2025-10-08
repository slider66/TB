# Política de Placeholders y Nombres Explícitos

Antes de crear cualquier placeholder (función Edge, endpoint, tabla, columna, tool MCP, job/cron, variable de entorno, etc.), el asistente debe pedir confirmación al usuario proponiendo 1–3 nombres claros y explícitos basados en lo que hace la pieza.

Cada propuesta debe incluir:
- Qué hace exactamente (1–2 frases)
- Por qué ese nombre es adecuado (semántico y específico)
- Alternativas si hay ambigüedades

Si el usuario no responde, usar un nombre por defecto autoexplicativo y no genérico. Ejemplos válidos:
- `storage.get_signed_url` → Emite URL firmada temporal para `reports/` o `uploads/`
- `documents.process_document` → Encola extracción + normalización del documento
- `documents.simplify_document` → Genera versión simplificada pedagógica del documento
- `requests.update_status` → Cambia `requests.status` validando rol y transición

Evitar nombres genéricos como `process`, `runTask`, `doStuff` o abreviaturas crípticas.

