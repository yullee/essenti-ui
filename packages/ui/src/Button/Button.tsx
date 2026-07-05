import * as React from 'react';

import { cn } from '../cn.js';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  as?: React.ElementType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      type = 'button',
      fullWidth = false,
      loading = false,
      disabled = false,
      iconLeft = null,
      iconRight = null,
      as: Tag = 'button',
      className,
      children,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const isNativeInteractive = Tag === 'button' || Tag === 'a';

    const tagProps = isNativeInteractive
      ? Tag === 'button'
        ? { type, disabled: isDisabled }
        : { 'aria-disabled': isDisabled, tabIndex: isDisabled ? -1 : undefined }
      : {
          role: 'button',
          tabIndex: isDisabled ? -1 : 0,
          'aria-disabled': isDisabled,
        };

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onKeyDown?.(event);
      if (isNativeInteractive || isDisabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          'es-btn',
          `es-btn--${variant}`,
          `es-btn--${size}`,
          fullWidth && 'es-btn--block',
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-busy={loading || undefined}
        {...tagProps}
        {...rest}
      >
        {loading ? (
          <span className="es-btn__spin" role="status" aria-label="Loading" />
        ) : (
          iconLeft
        )}
        {children}
        {!loading && iconRight}
      </Tag>
    );
  },
);
