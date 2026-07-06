import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Input } from './Input.js';

describe('Input', () => {
  describe('semantic HTML', () => {
    it('renders a native text input', () => {
      render(<Input aria-label="Email" />);

      expect(
        screen.getByRole('textbox', { name: 'Email' }),
      ).toBeInTheDocument();
    });
  });

  describe('ref behavior', () => {
    it('forwards a ref to the underlying input element, not the wrapping label', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input aria-label="Email" ref={ref} />);

      expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
    });
  });

  describe('keyboard interaction', () => {
    it('accepts typed input', async () => {
      const user = userEvent.setup();
      render(<Input aria-label="Email" />);

      const input = screen.getByRole('textbox', { name: 'Email' });
      await user.type(input, 'hello@example.com');

      expect(input).toHaveValue('hello@example.com');
    });

    it('is reachable via Tab', async () => {
      const user = userEvent.setup();
      render(<Input aria-label="Email" />);

      await user.tab();

      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
    });
  });

  describe('disabled behavior', () => {
    it('disables the native input and blocks typing', async () => {
      const user = userEvent.setup();
      render(<Input aria-label="Email" disabled />);

      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toBeDisabled();

      await user.type(input, 'hello');
      expect(input).toHaveValue('');
    });
  });

  describe('accessibility', () => {
    it('marks aria-invalid when invalid', () => {
      render(<Input aria-label="Email" invalid />);

      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('lets an explicit aria-invalid override the invalid prop', () => {
      render(<Input aria-label="Email" invalid aria-invalid="false" />);

      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'false',
      );
    });

    it('hides prefix and suffix decorations from assistive tech', () => {
      render(
        <Input
          aria-label="Amount"
          prefix={<span data-testid="prefix">$</span>}
          suffix={<span data-testid="suffix">USD</span>}
        />,
      );

      expect(screen.getByTestId('prefix').parentElement).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      expect(screen.getByTestId('suffix').parentElement).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });
});
