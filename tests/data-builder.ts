import * as path from 'path';

export interface TestData {
    file: string;
    hasSpeakers: boolean
}

export default class DataBuilder {
    private readonly dataDir = path.join(__dirname, 'data');

    private testData: TestData[] = [
        { file: path.join(this.dataDir, 'newscast-transcript.no-speakers.json'), hasSpeakers: false },
        { file: path.join(this.dataDir, 'newscast-transcript.speakers.json'), hasSpeakers: true }
    ]

    public GenerateTestData(): TestData[] {
        return this.testData;
    }
}