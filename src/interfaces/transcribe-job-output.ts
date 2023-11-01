export interface TranscribeJobOutput {
    jobName: string,
    accountId: string,
    results: TranscribeJobResult,
    status: string
}

export interface TranscribeJobResult {
    transcripts: {
        transcript: string
    }[],
    speaker_labels?: undefined | {
        segments: {
            start_time: string,
            end_time: string,
            speaker_label: string,
            items: {
                speaker_label: string,
                start_time: string,
                end_time: string
            }[]
        }[]
    }
    items: {
        start_time?: string,
        end_time?: string,
        alternatives: {
            confidence: string,
            content: string
        }[],
        type?: string
    }[]
}