import { useState } from "react";
import { z } from "zod";

import { useSupabase } from "@/providers/SupabaseProvider";
import { uploadDocument } from "@/services/document-service";


const formSchema = z.object({
  documentType: z.string().min(1, "Selecciona el tipo de documento"),
  notes: z.string().max(500, "El resumen no puede superar los 500 caracteres").optional(),
  acceptDisclaimer: z
    .boolean()
    .refine((value) => value, {
      message: "Debes aceptar que entiendes que no ofrecemos asesoría legal.",
    }),
});
type FormState = z.infer<typeof formSchema> & {
  file: File | null;
};
const initialState: FormState = {
  documentType: "",
  notes: "",
  acceptDisclaimer: false,
  file: null,
};
const UploadDocumentCard = () => {
  const { client, isConfigured } = useSupabase();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleChange = (field: keyof FormState, value: FormState[typeof field]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!formState.file) {
      setErrorMessage("Selecciona un archivo antes de continuar.");
      return;
    }
    const validation = formSchema.safeParse({
      documentType: formState.documentType,
      notes: formState.notes,
      acceptDisclaimer: formState.acceptDisclaimer,
    });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setErrorMessage(firstError?.message ?? "Formulario incompleto.");
      return;
    }
    if (!client || !isConfigured) {
      setErrorMessage(
        "Supabase no está configurado en este entorno. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }
    try {
      setStatus("submitting");
      await uploadDocument({
        client,
        file: formState.file,
        documentType: validation.data.documentType,
        notes: validation.data.notes,
      });
      setStatus("success");
      setFormState(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo subir el documento. Inténtalo de nuevo en unos minutos.",
      );
    }
  };
  return (
    <section
      id="upload"
      aria-labelledby="upload-card-title"
      className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card"
    >
      <div className="mb-6 flex flex-col gap-2 text-center md:text-left">
        <h2 id="upload-card-title" className="text-h2 text-tb-text-base">
          Sube tu documento burocrático
        </h2>
        <p className="text-body text-tb-text-muted">
          Lo analizamos y lo traducimos a un lenguaje claro. Antes de procesarlo, realizamos un
          escaneo antivirus y comprobamos que el formato respete los límites de 20&nbsp;MB y 200 páginas.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="document-file"
            className="mb-2 block text-sm font-semibold text-tb-text-base"
          >
            Documento (PDF, DOCX, JPG o PNG)
          </label>
          <input
            id="document-file"
            name="document-file"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full rounded-[12px] border border-tb-border-subtle bg-tb-bg-base px-4 py-3 text-sm text-tb-text-base file:mr-4 file:rounded-[12px] file:border-0 file:bg-tb-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-tb-primaryHover focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              handleChange("file", file);
            }}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="document-type" className="mb-2 text-sm font-semibold text-tb-text-base">
              Tipo de documento
            </label>
            <select
              id="document-type"
              name="document-type"
              value={formState.documentType}
              onChange={(event) => handleChange("documentType", event.target.value)}
              className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm text-tb-text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="tax-notice">Notificación tributaria</option>
              <option value="traffic-fine">Multa de tráfico</option>
              <option value="subsidy">Solicitud de ayuda/subsidio</option>
              <option value="education">Comunicación educativa</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="document-notes" className="mb-2 text-sm font-semibold text-tb-text-base">
              Contexto opcional
            </label>
            <textarea
              id="document-notes"
              name="document-notes"
              value={formState.notes ?? ""}
              onChange={(event) => handleChange("notes", event.target.value)}
              rows={3}
              maxLength={500}
              className="min-h-[120px] rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm text-tb-text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
              placeholder="Fechas límite, dudas principales o situación del expediente."
            />
          </div>
        </div>
        <label className="flex items-start gap-3 rounded-[12px] border border-transparent bg-tb-bg-alt px-4 py-3 text-sm text-tb-text-muted">
          <input
            type="checkbox"
            checked={formState.acceptDisclaimer}
            onChange={(event) => handleChange("acceptDisclaimer", event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-tb-border-subtle text-tb-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
            required
          />
          <span>
            He leído y entiendo que Traductor Burocrático no ofrece asesoría legal. Recibiré un resumen
            pedagógico con opciones generales y contacto con partners colegiados cuando proceda.
          </span>
        </label>
        {errorMessage ? (
          <p role="alert" className="rounded-[12px] border border-tb-state-error bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        {status === "success" ? (
          <p className="rounded-[12px] border border-tb-state-success bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Documento recibido. Te avisaremos por email cuando la versión simplificada esté preparada.
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-[12px] bg-tb-primary px-6 py-3 font-semibold text-white shadow-button transition-colors hover:bg-tb-primaryHover focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Subiendo…" : "Subir documento para simplificar"}
        </button>
      </form>
    </section>
  );
};
export default UploadDocumentCard;
