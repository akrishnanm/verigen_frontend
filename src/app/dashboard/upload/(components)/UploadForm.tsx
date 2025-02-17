'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadMutation } from './upload.api';
import { Button, TextField, Typography } from '@mui/material';

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
interface UploadFormProps {
  onFileUpload: (
    files: { filename: string; url: string; timestamp: string }[]
  ) => void;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
  });

  const [upload, { isLoading, isError, isSuccess }] = useUploadMutation();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FileFormValues) => {
    const file = data.file[0];
    if (file.name.endsWith('.v')) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await upload(formData).unwrap();
        const files = response.files;
        onFileUpload(files);
        setError(null);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    } else {
      setError('Invalid file type. Please upload a .v file.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <TextField
        label="Select a file"
        type="file"
        InputLabelProps={{ shrink: true }}
        {...register('file')}
        error={!!errors.file}
        helperText={errors.file?.message as string}
      />

      {error && <Typography color="error">{error}</Typography>}

      <Button
        type="submit"
        variant="contained"
        color="success"
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </Button>

      {isSuccess && (
        <Typography color="success.main">Upload successful!</Typography>
      )}
      {isError && <Typography color="error.main">Upload failed.</Typography>}
    </form>
  );
}
