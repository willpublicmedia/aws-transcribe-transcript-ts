import { test, expect } from '@jest/globals';
import * as fs from 'fs/promises';
import TranscriptFormatter from '../src/transcript-formatter';
import { type TranscribeJobOutput } from '../src/interfaces/transcribe-job-output';
import DataBuilder, { SpeakerStatus } from './data-builder';

/**
 * @internal
 */
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

/**
 * @internal
 */
test('formatter splits on speakers', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData(SpeakerStatus.HasSpeakers);
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

                // console.debug(transcript);
                expect(lines.length).toBeGreaterThan(1);
                expect(firstline).not.toBe(expectedEmpty);
            }
        )
    );
});

test('formatter returns unformatted text if no speakers', async () => {
    const builder = new DataBuilder();
    const items = builder.GenerateTestData(SpeakerStatus.NoSpeakers);
    await Promise.all(
        items.map(
            async item => {
                const content = await fs.readFile(item.file, { encoding: 'utf-8' });
                const data: TranscribeJobOutput = await JSON.parse(content);
                const formatter = new TranscriptFormatter();
                const transcript = formatter.format(data);

                const lines = transcript.split(/\r?\n|\r|\n/g);
                const firstline = lines[0];
                const unformattedText = data.results.transcripts[0].transcript;

                expect(lines.length).toBe(1);
                expect(firstline).toBe(unformattedText);
            }
        )
    );
})

// test('formatter orders speakers correctly', async () => {
//     const builder = new DataBuilder();
//     const items = builder.GenerateTestData(SpeakerStatus.HasSpeakers);

//     await Promise.all(
//         items.map(
//             async item => {
//                 expect(1).toEqual(2);
//             }
//         )
//     );
// })