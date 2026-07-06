import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button.js';

describe('Button', () => {
  describe('semantic HTML / polymorphism', () => {
    it('renders a native button by default', () => {
      render(<Button>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders an anchor when as="a"', () => {
      render(
        <Button as="a" href="/docs">
          Learn more
        </Button>,
      );

      const link = screen.getByRole('link', { name: 'Learn more' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/docs');
    });
  });

  describe('ref behavior', () => {
    it('forwards a ref to the underlying button element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Save</Button>);

      expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
    });

    it('forwards a ref to the underlying anchor element', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Button as="a" href="/docs" ref={ref}>
          Learn more
        </Button>,
      );

      expect(ref.current).toBe(screen.getByRole('link', { name: 'Learn more' }));
    });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is reachable via Tab and activates via Enter and Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <>
          <button type="button">before</button>
          <Button onClick={onClick}>Save</Button>
        </>,
      );

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();

      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('disabled / loading behavior', () => {
    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Save
        </Button>,
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('natively disables the button while loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toBeDisabled();

      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('blocks navigation and onClick on a loading anchor', () => {
      const onClick = vi.fn();
      render(
        <Button as="a" href="/docs" loading onClick={onClick}>
          Learn more
        </Button>,
      );

      const notPrevented = fireEvent.click(
        screen.getByRole('link', { name: 'Learn more' }),
      );

      expect(notPrevented).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('marks aria-busy while loading without polluting the accessible name', () => {
      render(<Button loading>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('hides icons in favor of the loading indicator', () => {
      render(
        <Button
          loading
          iconLeft={<span data-testid="icon-left" />}
          iconRight={<span data-testid="icon-right" />}
        >
          Save
        </Button>,
      );

      expect(screen.queryByTestId('icon-left')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-right')).not.toBeInTheDocument();
    });
  });
});
