import * as path from 'path';

export interface TestData {
    file: string;
    minimumLines: number
}

export default class DataBuilder {
    private readonly dataDir = path.join(__dirname, 'data');

    private testData: TestData[] = [
        { file: path.join(this.dataDir, 'newscast-transcript.no-speakers.json'), minimumLines: 1 },
        { file: path.join(this.dataDir, 'newscast-transcript.speakers.json'), minimumLines: 2}
    ]

    public GenerateTestData(): TestData[] {
        return this.testData;
    }
}