import { ReactNode } from 'react';

interface LinkProps {
  texto?: string;
  redirect?: string;
  openInANewTab?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function Link({
  texto,
  redirect,
  openInANewTab,
  children,
  onClick,
  className = ''
}: LinkProps) {
  return (
    <a
      href={redirect}
      target={openInANewTab ? '_blank' : ''}
      rel="noreferrer"
      className={className}
      onClick={onClick}
    >
      {children || texto}
    </a>
  );
}
