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

test('formatter splits on speakers', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData();
    await Promise.all(
        items.map(
            async item => {
                const content = await fs.readFile(item.file, { encoding: 'utf-8' });
                const data: TranscribeJobOutput = await JSON.parse(content);
                const formatter = new TranscriptFormatter();
                const transcript = formatter.format(data);

                const lines = transcript.split(/\r?\n|\r|\n/g);
                const firstline = lines[0];

                const expectedEmpty = '[0] spk_1: '

                if (item.hasSpeakers) {
                    expect(lines.length).toBeGreaterThan(1);
                    expect(firstline).not.toBe(expectedEmpty);
                } else {
                    const unformattedText = data.results.transcripts[0].transcript;
                    expect(lines.length).toEqual(1);
                    expect(firstline).toBe(unformattedText);
                }
            }
        )
    );
});