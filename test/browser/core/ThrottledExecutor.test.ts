// File: test/browser/core/ThrottledExecutor.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ThrottledExecutor } from '../../../core/ThrottledExecutor';
import {sleep} from "moderndash"

interface LogEntry {
    call: string;
    start: number;
    end: number;
    duration: number;
}

describe('ThrottledExecutor Timeline (70 ms throttle, 300 ms exec, 60 ms spacing)', () => {
    let execLog: LogEntry[];
    let executor: ThrottledExecutor<[string], void>;
    let mockFn: (label: string) => Promise<void>;
    let t0: number;

    beforeEach(() => {
        execLog = [];
        mockFn = async (label: string) => {
            const start = Date.now() - t0;                              // record real-time start [2]
            await sleep(300);                                           // simulate 300 ms execution [2]
            const end = Date.now() -t0;                                // record real-time end [2]
            execLog.push({ call: label, start, end, duration: end - start });
            console.log(`Executed ${label} (start: ${start} ms, end: ${end} ms)`); // log execution [2]
        };
        executor = new ThrottledExecutor(mockFn, 70);            // 70 ms throttle interval [1]
    });

    it('matches the expected execution timeline with 10 calls 60 ms apart', async () => {
        t0 = Date.now();                                   // baseline timestamp [2]

        // Schedule 10 calls at 60 ms intervals
        for (let i = 1; i <= 10; i++) {
            executor.execute(`call${i} at ${i*10}ms`);                          // invoke throttle wrapper [1]
            if (i < 10) await sleep(60); // 60 ms spacing [2]
        }

        // Wait until all executions complete (max 1500 ms) plus buffer
        await executor.waitForCompletion();                      // wait for mutex queue empty [3]
        await new Promise(res => setTimeout(res, 100));          // safety buffer [2]

        // Expect exactly 5 executions: calls #1, #3, #5, #7, and #9
        expect(execLog).toHaveLength(5);                         // five starts in total [1]

        // Expected start times relative to t0: 0, 300, 600, 900, 1200 ms
        const expectedOffsets = [0, 300, 600, 900, 1200];
        execLog.forEach((log, idx) => {
            const offset = log.start;
            expect(offset).toBeGreaterThanOrEqual(expectedOffsets[idx] - 50);
            expect(offset).toBeLessThanOrEqual(expectedOffsets[idx] + 50);
            expect(log.duration).toBeGreaterThanOrEqual(250);
            expect(log.duration).toBeLessThanOrEqual(350);
        });
    });
});