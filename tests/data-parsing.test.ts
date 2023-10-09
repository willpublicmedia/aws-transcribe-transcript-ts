import { test, expect } from '@jest/globals';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { TranscribeJobOutput, TranscribeJobResult } from '../src/types/transcribe-job-output';

const dataDir = path.join(__dirname, 'data');
const filenames = [
    'newscast-transcript.no-speakers.json',
    'newscast-transcript.speakers.json'
];


test('test data exists', () => {
    const exists = fs.existsSync(dataDir);
    expect(exists).toBe(true);
});

test('parsed types are correct', () => {
    filenames.forEach(async name => {
        const file = path.join(dataDir, name);
        const data = await fsPromises.readFile(file, { encoding: 'utf8' });
        const parsed: TranscribeJobOutput = JSON.parse(data);
        expect(parsed).toHaveProperty('jobName');
        expect(parsed).toHaveProperty('accountId');
        expect(parsed).toHaveProperty('results');
        expect(parsed).toHaveProperty('status');

        const results: TranscribeJobResult = parsed.results;
        expect(results).toHaveProperty('transcripts');
        expect(results).toHaveProperty('items');
    });
});