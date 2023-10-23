import { test, expect } from '@jest/globals';
import * as fsPromises from 'fs/promises';
import { TranscribeJobOutput, TranscribeJobResult } from '../src/types/transcribe-job-output';
import DataBuilder from './data-builder';

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