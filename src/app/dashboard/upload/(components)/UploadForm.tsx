'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadMutation } from './upload.api';

const fileSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'File is required')
    .refine((files) => files[0].size <= 5 * 1024 * 1024, 'File must be < 5MB'),
});

type FileFormValues = z.infer<typeof fileSchema>;

export default function UploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
  });

  const [upload, { isLoading, isError, isSuccess }] = useUploadMutation();

  const onSubmit = async (data: FileFormValues) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);

    try {
      await upload(formData).unwrap();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="file" {...register('file')} />
      {errors.file && <p className="text-red-500">{errors.file.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded bg-blue-500 p-2 text-white"
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {isSuccess && <p className="text-green-500">Upload successful!</p>}
      {isError && <p className="text-red-500">Upload failed.</p>}
    </form>
  );
}
