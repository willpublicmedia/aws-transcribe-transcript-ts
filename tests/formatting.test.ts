import { test, expect } from '@jest/globals';
import * as path from 'path';
import * as fs from 'fs/promises';
import TranscriptFormatter from '../src/transcript-formatter';
import { TranscribeJobOutput } from '../src/types/transcribe-job-output';

const dataDir = path.join(__dirname, 'data');
const filenames = [
    'WILLnewscast-transcript.txt',
];

test('formatter processes data correctly', async () => {
    await Promise.all(
        filenames.map(
            async name => {
                const file = path.join(dataDir, name);
                const content = await fs.readFile(file, { encoding: 'utf-8' });
                const data: TranscribeJobOutput = await JSON.parse(content);
                const formatter = new TranscriptFormatter();

                expect(() => formatter.format(data)).not.toThrow(Error);
            }
        )
    )
});