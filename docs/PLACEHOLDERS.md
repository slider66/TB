# Politica de Placeholders y Nombres Explicitos

Antes de crear cualquier placeholder (funciOn Edge, endpoint, tabla, columna, tool MCP, job/cron, variable de entorno, etc.), el asistente debe pedir confirmaciOn al usuario proponiendo 1–3 nombres claros y explicitos basados en lo que hace la pieza.

Cada propuesta debe incluir:
- Que hace exactamente (1–2 frases)
- Por que ese nombre es adecuado (semantico y especifico)
- Alternativas si hay ambigüedades

Si el usuario no responde, usar un nombre por defecto autoexplicativo y no generico. Ejemplos validos:
- `storage.get_signed_url` → Emite URL firmada temporal para `reports/` o `uploads/`
- `documents.process_document` → Encola extracciOn + normalizaciOn del documento
- `documents.simplify_document` → Genera versiOn simplificada pedagOgica del documento
- `requests.update_status` → Cambia `requests.status` validando rol y transiciOn

Evitar nombres genericos como `process`, `runTask`, `doStuff` o abreviaturas cripticas.

