'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadMutation } from './upload.api';
import FileInput from '@/components/FileInput';

const fileSchema = z.object({
  file: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      'File is required'
    )
    .refine(
      (files) => files instanceof FileList && files[0].size <= 5 * 1024 * 1024,
      'File must be < 5MB'
    ),
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
      <FileInput
        label="Select a file"
        name="file"
        register={register}
        error={errors.file?.message as string}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-green-500 px-4 py-2 text-white"
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {isSuccess && <p className="text-green-500">Upload successful!</p>}
      {isError && <p className="text-red-500">Upload failed.</p>}
    </form>
  );
}
