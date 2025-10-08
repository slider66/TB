import type { SupabaseClient } from "@supabase/supabase-js";

export type UploadDocumentInput = {
  client: SupabaseClient;
  file: File;
  documentType: string;
  notes?: string;
};

export type UploadDocumentResult = {
  storagePath: string;
  bucket: string;
};

export async function uploadDocument({
  client,
  file,
  documentType,
  notes,
}: UploadDocumentInput): Promise<UploadDocumentResult> {
  const bucket = 'uploads';
  const storagePath = `incoming/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await client.storage.from(bucket).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(`No se pudo subir el documento. ${uploadError.message}`);
  }

  try {
    await client.functions.invoke('process_document', {
      body: {
        storage_path: storagePath,
        bucket,
        document_type: documentType,
        notes,
      },
    });
  } catch (invokeError) {
    console.warn(
      '[uploadDocument] La función process_document aún no está disponible. El documento quedó almacenado en Storage.',
      invokeError,
    );
  }

  return { storagePath, bucket };
}

