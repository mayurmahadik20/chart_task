import { jest } from '@jest/globals';
import { updateDataArray } from './dataManager.mjs';

describe('updateDataArray', () => {
  it('should add a new item when length is under 20', () => {
    const data = [{ name: '1', value: 10 }];
    const result = updateDataArray(data, 2, 20);
    expect(result.length).toBe(2);
    expect(result[1]).toEqual({ name: 2, value: 20 });
  });

  it('should add a new item and shift out the oldest when length is exactly 20', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ name: i, value: i * 10 }));
    expect(data[0].name).toBe(0); // oldest item

    const result = updateDataArray(data, 20, 200);
    expect(result.length).toBe(20);
    expect(result[0].name).toBe(1); // oldest item shifted out
    expect(result[19]).toEqual({ name: 20, value: 200 }); // new item at the end
  });

  it('should shift down to 20 elements if initial length is greater than 20', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ name: i, value: i * 10 }));

    const result = updateDataArray(data, 25, 250);

    // Original length was 25, plus 1 new = 26. Shifted down to 20.
    // Elements 0 to 5 should be removed. Element 6 should now be at index 0.
    expect(result.length).toBe(20);
    expect(result[0].name).toBe(6);
    expect(result[19]).toEqual({ name: 25, value: 250 });
  });

  it('should handle an empty array correctly', () => {
    const data = [];
    const result = updateDataArray(data, 1, 100);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ name: 1, value: 100 });
  });
});
