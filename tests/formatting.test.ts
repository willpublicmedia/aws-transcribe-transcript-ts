import { test, expect } from '@jest/globals';
import * as fs from 'fs/promises';
import TranscriptFormatter from '../src/transcript-formatter';
import { TranscribeJobOutput } from '../src/types/transcribe-job-output';
import DataBuilder from './data-builder';

test('formatter completes data processing', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData();
    await Promise.all(
        items.map(
            async item => {
                const content = await fs.readFile(item.file, { encoding: 'utf-8' });
                const data: TranscribeJobOutput = await JSON.parse(content);
                const formatter = new TranscriptFormatter();

                expect(() => formatter.format(data)).not.toThrow(Error);
            }
        )
    )
});

test('first formatted line should not be empty', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData();
    await Promise.all(
        items.map(
            async item => {
                const content = await fs.readFile(item.file, { encoding: 'utf-8' });
                const data: TranscribeJobOutput = await JSON.parse(content);
                const formatter = new TranscriptFormatter();
                const transcript = formatter.format(data);

                const lines = transcript.split('\n');
                const firstLine = lines[0];

                const expectedEmpty = '[0] spk_1: ,'
                const actualEmpty = firstLine.startsWith(expectedEmpty);

                expect(lines.length).toBeGreaterThanOrEqual(item.minimumLines);
                expect(actualEmpty).toBe(false);
            }
        )
    )
});