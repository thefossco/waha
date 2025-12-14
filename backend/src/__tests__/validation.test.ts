import { validatePhone } from '../utils/validation';

describe('Validation Utils', () => {
  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('+12345678901234')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('+0123456789')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('123456789012345678')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validatePhone('+1')).toBe(false);
      expect(validatePhone('+12')).toBe(true);
      expect(validatePhone('12')).toBe(true);
    });
  });
});
