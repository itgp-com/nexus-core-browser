// File: test/browser/core/DebouncedExecutor.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';          // Vitest API[1]
import { DebouncedExecutor } from '../../../core/DebouncedExecutor'; // DebouncedExecutor implementation[2]
import { sleep } from 'moderndash';                                  // Sleep helper for timing[3]

interface LogEntry {
    call: string;
    start: number;
    end: number;
    duration: number;
}

describe('DebouncedExecutor Timeline (70 ms debounce, 300 ms execution, 60 ms spacing)', () => {
    let execLog: LogEntry[];
    let executor: DebouncedExecutor<[string], void>;
    let mockFn: (label: string) => Promise<void>;
    let t0: number;

    beforeEach(() => {
        execLog = [];
        mockFn = async (label: string) => {
            const start = Date.now() - t0;                                // record start[4]
            await sleep(300);                                             // simulate 300 ms work[3]
            const end = Date.now() - t0;                                  // record end[4]
            execLog.push({ call: label, start, end, duration: end - start });
            console.log(`Executed ${label} (start: ${start} ms, end: ${end} ms)`); // log execution[4]
        };
        executor = new DebouncedExecutor(mockFn, 70);                  // 70 ms debounce interval[2]
    });

    it('matches the expected DebouncedExecutor timeline with 10 calls 60 ms apart', async () => {
        t0 = Date.now();                                               // baseline timestamp[4]

        // Schedule 10 calls at 60 ms intervals
        for (let i = 1; i <= 10; i++) {
            executor.execute(`call${i} at ${(i - 1) * 60}ms`);
            if (i < 10) await sleep(60);                                 // spacing between calls[3]
        }

        // Wait for the debounced execution and a small buffer
        await executor.waitForCompletion();                            // await completion[2]
        await sleep( 100);                // safety buffer[4]

        // Only one execution should have occurred
        expect(execLog).toHaveLength(1);                               // single invocation[1]

        // Validate timing and duration of that single execution
        const log = execLog[0];
        expect(log.call).toBe('call10 at 540ms');                      // last call triggers execution[2]
        expect(log.start).toBeGreaterThanOrEqual(610 - 50);            // start ~610 ms ±50 ms[4]
        expect(log.start).toBeLessThanOrEqual(610 + 50);               // start ~610 ms ±50 ms[4]
        expect(log.duration).toBeGreaterThanOrEqual(250);              // duration ~300 ms ±50 ms[3]
        expect(log.duration).toBeLessThanOrEqual(350);                 // duration ~300 ms ±50 ms[3]
    });
});