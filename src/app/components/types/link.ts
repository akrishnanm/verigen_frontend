import { ReactNode } from 'react';
import { LinkProps as NextLinkProps } from 'next/link';

export interface CustomLinkProps extends NextLinkProps {
  children: ReactNode;
  className?: string;
}
