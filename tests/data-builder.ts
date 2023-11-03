import * as path from 'path';

/**
 * @internal
 */
export interface TestData {
    file: string;
    hasSpeakers: boolean
}

/**
 * @internal
 */
export enum SpeakerStatus {
    All,
    HasSpeakers,
    NoSpeakers
}

/**
 * @internal
 */
export default class DataBuilder {
    private readonly dataDir = path.join(__dirname, 'data');

    private testData: TestData[] = [
        { file: path.join(this.dataDir, 'newscast-transcript.no-speakers.json'), hasSpeakers: false },
        { file: path.join(this.dataDir, 'newscast-transcript.speakers.json'), hasSpeakers: true },
        { file: path.join(this.dataDir, 'newscast-transcript.2023-10-23.0704.speakers.json'), hasSpeakers: true },
        { file: path.join(this.dataDir, 'newscast.2023-11-02.0804.incorrect-speaker-order.speakers.json'), hasSpeakers: true }
    ]

    public GenerateTestData(speakerStatus: SpeakerStatus = SpeakerStatus.All): TestData[] {
        switch (speakerStatus) {
            case SpeakerStatus.All:
                return this.testData;
            case SpeakerStatus.HasSpeakers:
                return this.testData.filter(i => i.hasSpeakers == true);
            case SpeakerStatus.NoSpeakers:
                return this.testData.filter(i => i.hasSpeakers == false);
        }
    }
}