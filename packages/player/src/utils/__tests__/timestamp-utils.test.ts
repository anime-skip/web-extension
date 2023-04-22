import { describe, it, expect } from 'vitest';
import {
  fakeTimestampFragment,
  fakeVideoDuration,
} from '../testing/fake-objects';
import {
  Section,
  buildSections,
  getNextTimestamp,
  getPreviousTimestamp,
} from '../timestamp-utils';

describe('Timestamp Utils', () => {
  describe('buildSections', () => {
    it('should return sections ending at the final duration', () => {
      const duration = fakeVideoDuration();
      const timestamps = [
        fakeTimestampFragment({ at: 0 }),
        fakeTimestampFragment({ at: duration / 2 }),
        fakeTimestampFragment({ at: duration - 5 }),
      ];
      const expected: Section[] = [
        { ...timestamps[0], endAt: duration / 2 },
        { ...timestamps[1], endAt: duration - 5 },
        { ...timestamps[2], endAt: duration },
      ];

      expect(buildSections(timestamps, duration)).toEqual(expected);
    });

    it('should return sections not starting at 0', () => {
      const duration = fakeVideoDuration();
      const timestamps = [fakeTimestampFragment({ at: 5 })];
      const expected: Section[] = [{ ...timestamps[0], endAt: duration }];

      expect(buildSections(timestamps, duration)).toEqual(expected);
    });

    it("should not clamp sections to the video's duration", () => {
      const duration = fakeVideoDuration();
      const timestamps = [
        fakeTimestampFragment({ at: duration - 5 }),
        fakeTimestampFragment({ at: duration + 30 }),
      ];
      const expected: Section[] = [
        { ...timestamps[0], endAt: duration + 30 },
        { ...timestamps[1], endAt: timestamps[1].at },
      ];

      expect(buildSections(timestamps, duration)).toEqual(expected);
    });
  });

  describe('getNextTimestamp', () => {
    it("should return the next timestamp's .at", () => {
      const timestamps = [
        fakeTimestampFragment({ at: 0 }),
        fakeTimestampFragment({ at: 20 }),
        fakeTimestampFragment({ at: 40 }),
      ];

      expect(getNextTimestamp(timestamps, 0)).toEqual(timestamps[1]);
      expect(getNextTimestamp(timestamps, 25)).toEqual(timestamps[2]);
    });

    it('should return undefined if there are no more timestamps', () => {
      const timestamps = [fakeTimestampFragment({ at: 10 })];

      expect(getNextTimestamp(timestamps, 20)).toBeUndefined();
    });
  });

  describe('getPreviousTimestamp', () => {
    it("should return the previous timestamp's .at", () => {
      const timestamps = [
        fakeTimestampFragment({ at: 0 }),
        fakeTimestampFragment({ at: 20 }),
        fakeTimestampFragment({ at: 40 }),
      ];

      expect(getPreviousTimestamp(timestamps, 20)).toEqual(timestamps[0]);
      expect(getPreviousTimestamp(timestamps, 30)).toEqual(timestamps[1]);
    });

    it('should return 0 if there are no more timestamps', () => {
      const timestamps = [fakeTimestampFragment({ at: 10 })];

      expect(getNextTimestamp(timestamps, 20)).toBeUndefined();
    });
  });
});
