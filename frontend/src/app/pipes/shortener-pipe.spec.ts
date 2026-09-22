import { describe, it, expect } from 'vitest';
import { ShortenerPipe } from './shortener-pipe';

describe('ShortenerPipe', () => {
  const pipe = new ShortenerPipe();

  it('should return empty string for null, undefined, or empty string', () => {
    expect(pipe.transform(null, 10)).toBe('');
    expect(pipe.transform(undefined, 10)).toBe('');
    expect(pipe.transform('', 10)).toBe('');
  });

  it('should return unchanged string if length is less than or equal to maxCharacters', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
    expect(pipe.transform('Hello', 5)).toBe('Hello');
  });

  it('should truncate string and append ellipsis if length exceeds maxCharacters', () => {
    expect(pipe.transform('Hello World', 5)).toBe('Hello...');
    expect(pipe.transform('Pazolastock Skitour über den Tomasee', 11)).toBe('Pazolastock...');
  });

  it('should handle maxCharacters = 0', () => {
    expect(pipe.transform('Text', 0)).toBe('...');
  });

  it('should handle unicode characters and emojis correctly', () => {
    expect(pipe.transform('🏔️ Bergwanderung', 3)).toBe('🏔️...');
    expect(pipe.transform('Grüezi mitenand', 6)).toBe('Grüezi...');
  });
});
