import { describe, expect, it } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  it('joins truthy class names with a space', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'c')).toBe('a c');
  });

  it('supports conditional object syntax', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b');
  });
});
