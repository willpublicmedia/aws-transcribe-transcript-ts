import { TranscribeJobOutput } from "./types/transcribe-job-output";

export default class TranscriptFormatter {
    public format(data: TranscribeJobOutput): void {
        const results = data.results[0];

        console.debug('check if speaker labels present');
        if ('speaker_labels' in results) {
            console.debug('get speaker labels');
            const labels = results.speaker_labels?.segments;
            const speaker_start_times: { start_time: string, label: string }[] = [];

            console.debug('foreach speaker label get segments');
            labels?.forEach(label => {
                label.items.forEach(item => {
                    speaker_start_times.push({ start_time: item.start_time, label: item.speaker_label });
                });
            });

            console.debug('foreach segment get items');
            const items = results.items;
            const lines: { speaker: string, line: string, time: string }[] = [];
            let line = ''
            let time = '0'
            let speaker: string | null = null
            let i = 0

            items.forEach(item => {
                i = i + 1;

                let current_speaker: string | null = null;
                const content = item.alternatives[0].content;

                console.debug('foreach item get start_time, label speaker')
                if ('start_time' in item) {
                    current_speaker = speaker_start_times.find(s => s.start_time == item.start_time)?.label ?? '';
                }

                console.debug('foreach item get start time, get content or punctuation')
                if (item.type === 'punctuation') {
                    line = line + content;
                }

                if (current_speaker != speaker) {
                    if (speaker) {
                        lines.push({ speaker: speaker, line: line, time: time });
                    }

                    line = content;
                    speaker = current_speaker;
                    time = item.start_time;
                } else if (item.type !== 'punctuation') {
                    line = line + ' ' + content;
                }
            });

            lines.push({ speaker: speaker ?? '', line: line, time: time });

            console.debug('sort lines')
            const sorted_lines = lines.sort(l => Date.parse(l.time))
            sorted_lines.forEach(data => {
                let line = '[' + data.time + '] ';

                if ('speaker' in data) {
                    line = line + data.speaker + ' ';
                }

                if ('line' in data) {
                    line = line + data.line;
                }

                console.debug(line);
            });
        } else {
            console.debug('get raw transcript');
        }

        throw new Error("not implemented");
    }
}