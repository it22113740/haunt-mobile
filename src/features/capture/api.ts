import { api } from '@/api/client';
import { appendUploadPart, postMultipart } from '@/api/multipart';
import { uploadResultSchema } from '@/features/profile/schemas';
import { z } from 'zod';

export type VisitFile = {
  uri: string;
  name: string;
  mime: string;
  type: 'PHOTO' | 'VIDEO';
};

const uploadManySchema = z.object({
  uploads: z.array(uploadResultSchema),
});

type ProgressHandler = (ratio: number) => void;

function resourceType(files: VisitFile[]): 'image' | 'video' | 'auto' {
  if (files.every((file) => file.type === 'PHOTO')) return 'image';
  if (files.every((file) => file.type === 'VIDEO')) return 'video';
  return 'auto';
}

async function appendFile(body: FormData, field: string, file: VisitFile) {
  await appendUploadPart(body, field, { uri: file.uri, name: file.name, type: file.mime });
}

export async function uploadOne(file: VisitFile, onProgress?: ProgressHandler) {
  const body = new FormData();
  body.append('resourceType', file.type === 'VIDEO' ? 'video' : 'image');
  await appendFile(body, 'file', file);
  const data = await postMultipart<unknown>('/upload', body, onProgress);
  return uploadResultSchema.parse(data);
}

export async function uploadMany(files: VisitFile[], onProgress?: ProgressHandler) {
  const body = new FormData();
  body.append('resourceType', resourceType(files));
  for (const file of files) await appendFile(body, 'files', file);
  const data = await postMultipart<unknown>('/upload/multiple', body, onProgress);
  const parsed = uploadManySchema.parse(data);
  if (parsed.uploads.length !== files.length) {
    throw new Error('Upload did not return every file.');
  }
  return parsed.uploads;
}

export async function submitVisit(venueId: string, files: VisitFile[], onProgress?: ProgressHandler) {
  onProgress?.(0);
  const uploaded =
    files.length === 1
      ? [await uploadOne(files[0], onProgress)]
      : await uploadMany(files, onProgress);

  const items = files.map((file, index) => ({
    type: file.type,
    mediaUrl: uploaded[index]?.mediaUrl ?? '',
  }));
  if (items.some((item) => !item.mediaUrl)) {
    throw new Error('Upload did not return every file.');
  }

  onProgress?.(1);
  const first = items[0];
  if (items.length === 1 && first) {
    await api.post('/submissions', { venueId, type: first.type, mediaUrl: first.mediaUrl });
    return;
  }

  await api.post('/submissions/batch', { venueId, items });
}
