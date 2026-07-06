import * as React from 'react';

import { cn } from '../cn.js';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function Field({
  label,
  description,
  error,
  required = false,
  optional = false,
  htmlFor,
  className,
  children,
  ref,
  ...rest
}: FieldProps) {
  const autoId = React.useId();
  const childId = React.isValidElement(children)
    ? ((children.props as Record<string, unknown>).id as string | undefined)
    : undefined;
  const id = childId ?? htmlFor ?? autoId;
  const descId = description ? `${id}-desc` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error
            ? true
            : (children.props as Record<string, unknown>)['aria-invalid'],
          invalid: error
            ? true
            : (children.props as Record<string, unknown>).invalid,
        },
      )
    : children;

  return (
    <div ref={ref} className={cn('es-field', className)} {...rest}>
      {label && (
        <label className="es-field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="es-field__req" aria-hidden="true">
              *
            </span>
          )}
          {!required && optional && (
            <span className="es-field__opt">optional</span>
          )}
        </label>
      )}
      {description && (
        <div className="es-field__desc" id={descId}>
          {description}
        </div>
      )}
      {control}
      {error && (
        <div className="es-field__msg" id={errId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
