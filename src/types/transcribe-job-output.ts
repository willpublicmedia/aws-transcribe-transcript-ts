export interface TranscribeJobOutput {
    jobName: string,
    accountId: string,
    results: TranscribeJobResult[],
    status: string
}

export interface TranscribeJobResult {
    transcripts: {
        transcript: string
    }[],
    items: {
        start_time: string,
        end_time: string,
        alternatives: {
            confidence: string,
            content: string
        }[],
        type: string
    }[]
}