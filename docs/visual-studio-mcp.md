# Integración MCP en Visual Studio

Este proyecto expone el contrato MCP (Model Communication Protocol) vía OpenAPI para que Visual Studio pueda generar clientes tipados y probar los comandos.

## Archivos relevantes

- `openapi/mcp.yaml`: especificación OpenAPI 3.0.3 de los comandos MCP y el envelope estándar.
- `api/mcp.http`: ejemplos de llamadas HTTP para depurar localmente (recomendado con Supabase CLI).

## Usar en Visual Studio (Service Reference)

1. En Visual Studio, botón derecho sobre tu proyecto .NET → `Add` → `Service Reference...`.
2. Elige `OpenAPI` y selecciona el archivo `openapi/mcp.yaml` de este repo.
3. Configura el namespace (por ejemplo, `TB.Mcp`) y genera el cliente.
4. En tu código, inyecta un `HttpClient` con `BaseAddress` apuntando a:
   - Producción: `https://<PROJECT_REF>.functions.supabase.co`
   - Local: `http://127.0.0.1:54321/functions/v1`
5. Añade el header `Authorization: Bearer <TOKEN>` y `X-Correlation-Id` por llamada.

## Ejemplo de uso (C#)

```csharp
var http = new HttpClient { BaseAddress = new Uri("http://127.0.0.1:54321/functions/v1") };
http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
http.DefaultRequestHeaders.Add("X-Correlation-Id", Guid.NewGuid().ToString());

var envelope = new
{
  mcp_version = "1.0.0",
  contract_version = "2025-10-05",
  id = Guid.NewGuid(),
  ts = DateTime.UtcNow,
  channel = "command",
  verb = "documents.simplify_document",
  resource = $"requests/{requestId}",
  actor = new { id = "system", role = "system" },
  auth = new { subject = "service", scopes = new[] { "write:analysis" } },
  meta = new { correlation_id = correlationId, schema = "tb.mcp.1" },
  privacy = new { classification = "SENSITIVE", consents = Array.Empty<string>() },
  payload = new { request_id = requestId, language = "es" }
};

var resp = await http.PostAsJsonAsync("/documents.simplify_document", envelope);
resp.EnsureSuccessStatusCode();
```

## Notas de cumplimiento MCP

- Propaga `X-Correlation-Id` y (si aplica) `X-Causation-Id` en headers.
- Mantén `classification` acorde a la sensibilidad de los datos.
- Usa 202 Accepted cuando el trabajo continúe en background.
- Los prompts de IA deben respetar guardarraíles (sin asesoramiento legal específico).

