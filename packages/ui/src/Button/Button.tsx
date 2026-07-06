import * as React from 'react';

import { cn } from '../cn.js';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

type NativeButtonProps = Props &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof Props> & {
    as?: 'button';
    ref?: React.Ref<HTMLButtonElement>;
  };

type AnchorButtonProps = Props &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props> & {
    as: 'a';
    ref?: React.Ref<HTMLAnchorElement>;
  };

export type ButtonProps = NativeButtonProps | AnchorButtonProps;

function handleOnClick<T extends HTMLElement>(
  loading: boolean,
  onClick?: React.MouseEventHandler<T>,
): React.MouseEventHandler<T> {
  return (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
}

function Content({
  loading,
  iconLeft,
  iconRight,
  children,
}: Pick<Props, 'loading' | 'iconLeft' | 'iconRight' | 'children'>) {
  return (
    <>
      {loading ? (
        <span className="es-btn__spin" role="status" aria-label="Loading" />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    className,
    children,
  } = props;

  const classes = cn(
    'es-btn',
    `es-btn--${variant}`,
    `es-btn--${size}`,
    className,
  );

  if (props.as === 'a') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars -- drop discriminant so it isn't spread onto the DOM node
    const { as, onClick, ref, ...anchorProps } = props;

    return (
      <a
        {...anchorProps}
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        onClick={handleOnClick(loading, onClick)}
      >
        <Content loading={loading} iconLeft={iconLeft} iconRight={iconRight}>
          {children}
        </Content>
      </a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars -- drop discriminant so it isn't spread onto the DOM node
  const { as, type = 'button', disabled, onClick, ref, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      aria-busy={loading || undefined}
      onClick={handleOnClick(loading, onClick)}
    >
      <Content loading={loading} iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </Content>
    </button>
  );
}
