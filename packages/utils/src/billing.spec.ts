import { describe, expect, test } from 'vitest'
import { calculateSavings, formatPrice, getCurrency } from './billing'

describe('getCurrency', () => {
  test("should return 'USD' when the country is 'US'", () => {
    expect(getCurrency('US')).toBe('USD')
  })

  test("should return 'NOK' when the country is 'NO'", () => {
    expect(getCurrency('NO')).toBe('NOK')
  })

  test("should return 'EUR' when the country is 'DE'", () => {
    expect(getCurrency('DE')).toBe('EUR')
  })

  test("should return 'USD' when the country is unexpected", () => {
    expect(getCurrency('FROG')).toBe('USD')
  })
})

describe('formatPrice', () => {
  test('should format price correctly for USD', () => {
    expect(formatPrice('en-US', 123456, 'USD')).toBe('$1,234.56')
  })

  test('should format price correctly for EUR', () => {
    expect(formatPrice('de-DE', 123456, 'EUR')).toBe('1.234,56\xa0€')
  })

  test('should format price correctly for JPY', () => {
    expect(formatPrice('ja-JP', 123456, 'JPY')).toBe('￥123,456')
  })

  test('should format price correctly for GBP', () => {
    expect(formatPrice('en-GB', 123456, 'GBP')).toBe('£1,234.56')
  })
})

describe('calculateSavings', () => {
  test('should return 0% when price is the same', () => {
    expect(calculateSavings(100, 100 * 12)).toBe(0)
  })

  test('should return 50% when price is half', () => {
    expect(calculateSavings(100, 100 * 12 * 0.5)).toBe(50)
  })

  test('should handle fractions', () => {
    expect(calculateSavings(4.99, 4.99 * 12 * 0.82)).toBe(18)
  })

  test('should handle higher yearly price', () => {
    expect(calculateSavings(4.99, 5.99 * 12)).toBe(-21)
  })
})
