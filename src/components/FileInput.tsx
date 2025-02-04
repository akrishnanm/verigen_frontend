'use client';

import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploadProps {
  label: string;
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
}

export default function FileUpload({
  label,
  name,
  register,
  error,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          {...register(name, {
            onChange: (event) => {
              const file = event.target.files?.[0];
              if (file) setFileName(file.name);
            },
          })}
        />
      </Button>

      {fileName && <p className="text-gray-600">Selected: {fileName}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
