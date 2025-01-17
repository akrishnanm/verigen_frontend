'use client';

import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { CustomLinkProps } from './types/link';

// Styled anchor tag for the hover effect
const StyledAnchor = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'text-decoration 0.3s ease',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default function Link({
  children,
  className,
  ...props
}: CustomLinkProps) {
  return (
    <NextLink {...props} passHref legacyBehavior>
      <StyledAnchor className={className}>{children}</StyledAnchor>
    </NextLink>
  );
}
