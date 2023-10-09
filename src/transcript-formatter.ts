import { TranscribeJobOutput } from "./types/transcribe-job-output";

export default class TranscriptFormatter {
    public format(data: TranscribeJobOutput): void {
        const results = data.results[0];

        console.debug('check if speaker labels present');
        if ('speaker_labels' in results) {
            console.debug('get speaker labels');
            const labels = results.speaker_labels?.segments;
            const speaker_start_times: { start_time: string, label: string }[] = [];

            labels?.forEach(label => {
                label.items.forEach(item => {
                    speaker_start_times.push({ start_time: item.start_time, label: item.speaker_label });
                });
            });

            console.debug('foreach speaker label get segments');
            console.debug('foreach segment get items');
            console.debug('foreach item get start_time, label speaker')
            console.debug('foreach item get start time, get content or punctuation')
            console.debug('sort lines')
        } else {
            console.debug('get raw transcript');
        }

        throw new Error("not implemented");
    }
}