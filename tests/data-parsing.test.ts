import { test, expect } from '@jest/globals';
import * as fsPromises from 'fs/promises';
import { TranscribeJobOutput, TranscribeJobResult } from '../src/types/transcribe-job-output';
import DataBuilder from './data-builder';
import TranscriptFormatter from '../src/transcript-formatter';

test('parsed types are correct', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData();

    await Promise.all(
        items.map(async item => {
            const data = await fsPromises.readFile(item.file, { encoding: 'utf8' });
            const parsed: TranscribeJobOutput = JSON.parse(data);
            expect(parsed).toHaveProperty('jobName');
            expect(parsed).toHaveProperty('accountId');
            expect(parsed).toHaveProperty('results');
            expect(parsed).toHaveProperty('status');

            const results: TranscribeJobResult = parsed.results;
            expect(results).toHaveProperty('transcripts');
            expect(results).toHaveProperty('items');
        })
    );
});

test('account ID has been anonymized', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData();
    await Promise.all(
        items.map(async item => {
            const expected = '111111111111';
            const data = await fsPromises.readFile(item.file, { encoding: 'utf-8' });
            const parsed: TranscribeJobOutput = JSON.parse(data);
            const actual = parsed.accountId;
            expect(actual).toBe(expected);
        })
    );
});

test('formatter generates timestamps from seconds', () => {
    const data: { in: string, expected: string }[] = [
        { in: '0', expected: '00:00:00' },
        { in: '60', expected: '00:01:00' },
        { in: '120', expected: '00:02:00' },
        { in: '5400', expected: '01:30:00' }
    ];

    const formatter = new TranscriptFormatter();

    data.map(item => {
        const actual = formatter.convertTimestamp(item.in);
        expect(actual).toBe(item.expected);
    });
});