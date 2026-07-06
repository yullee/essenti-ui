import * as React from 'react';

import { cn } from '../cn.js';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  tabular?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  size = 'md',
  invalid = false,
  disabled = false,
  prefix = null,
  suffix = null,
  tabular = false,
  className,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ref,
  ...rest
}: InputProps) {
  return (
    <label
      className={cn(
        'es-input',
        `es-input--${size}`,
        invalid && 'es-input--invalid',
        disabled && 'es-input--disabled',
        tabular && 'es-input--tnum',
        className,
      )}
      htmlFor={id}
    >
      {prefix && (
        <span className="es-input__affix" aria-hidden="true">
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        id={id}
        className="es-input__control"
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        aria-describedby={describedBy}
        {...rest}
      />
      {suffix && (
        <span className="es-input__affix" aria-hidden="true">
          {suffix}
        </span>
      )}
    </label>
  );
}
