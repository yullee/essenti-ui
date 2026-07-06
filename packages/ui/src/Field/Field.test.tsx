import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Field } from './Field.js';

describe('Field', () => {
  describe('semantic HTML / form wiring', () => {
    it('associates the label with the control via htmlFor/id', () => {
      render(
        <Field label="Email">
          <input />
        </Field>,
      );

      expect(
        screen.getByRole('textbox', { name: 'Email' }),
      ).toBeInTheDocument();
    });

    it('respects an id already set on the control', () => {
      render(
        <Field label="Email">
          <input id="custom-email" />
        </Field>,
      );

      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
        'id',
        'custom-email',
      );
    });

    it('passes through non-element children unchanged', () => {
      render(<Field label="Note">plain text</Field>);

      expect(screen.getByText('plain text')).toBeInTheDocument();
    });
  });

  describe('ref behavior', () => {
    it('forwards a ref to the wrapping element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Field label="Email" ref={ref}>
          <input />
        </Field>,
      );

      expect(ref.current).toContainElement(screen.getByRole('textbox'));
    });
  });

  describe('accessibility', () => {
    it('links the description via aria-describedby', () => {
      render(
        <Field label="Email" description="We will never share this.">
          <input />
        </Field>,
      );

      const input = screen.getByRole('textbox', { name: 'Email' });
      const descId = input.getAttribute('aria-describedby');

      expect(descId).toBeTruthy();
      expect(document.getElementById(descId as string)).toHaveTextContent(
        'We will never share this.',
      );
    });

    it('marks the control invalid and links the error message as an alert', () => {
      render(
        <Field label="Email" error="Required">
          <input />
        </Field>,
      );

      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toHaveAttribute('aria-invalid', 'true');

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Required');
      expect(input.getAttribute('aria-describedby')).toContain(
        alert.getAttribute('id'),
      );
    });

    it('shows a required indicator and suppresses the optional indicator', () => {
      render(
        <Field label="Email" required optional>
          <input />
        </Field>,
      );

      expect(screen.queryByText('optional')).not.toBeInTheDocument();
    });

    it('shows an optional indicator when not required', () => {
      render(
        <Field label="Email" optional>
          <input />
        </Field>,
      );

      expect(screen.getByText('optional')).toBeInTheDocument();
    });
  });
});
