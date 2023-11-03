import { TranscribeJobOutput } from "./interfaces/transcribe-job-output";

export default class TranscriptFormatter {
    public format(data: TranscribeJobOutput): string {
        const results = data.results;

        if ('speaker_labels' in results && results.speaker_labels !== undefined) {
            const labels = results.speaker_labels?.segments;

            let speaker = labels[0].speaker_label ?? 'spk_0';
            let recent_speaker = speaker;

            const speaker_start_times: { start_time: string, label: string }[] = this.findSpeakerStartTimes(labels);

            let lines = [];
            let line = '';
            let time = '0';

            const items = results.items;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if ('start_time' in item && item.start_time !== undefined) { // this is a spoken item
                    speaker = speaker_start_times.find(s => s.start_time === item.start_time)?.label ?? 'Anon';
                    if (speaker === recent_speaker) {
                        let alt_content: string;
                        try {
                            alt_content = item.alternatives[0].content;
                        } catch {
                            alt_content = '';
                        }

                        line = line + ' ' + alt_content; // append to content and repeat
                    } else { // new speaker
                        lines.push({ speaker: recent_speaker, line: line, time: time });
                        recent_speaker = speaker;
                        line = item.alternatives[0].content;
                        time = item.start_time as string;
                    }
                } else if (item.type === 'punctuation') {
                    line = line + item.alternatives[0].content;
                }
            }

            lines.push({ speaker: speaker, line: line, time: time });
            const sorted_lines = lines.sort((x, y) => { return Date.parse(x.time) - Date.parse(y.time) });

            const formatted = sorted_lines.map(item => {
                const time = this.convertTimestamp(item.time);
                return `[${time}] ${item.speaker}: ${item.line}`;
            }).join('\n');

            return formatted;
        } else {
            const transcript = results.transcripts[0].transcript;
            return transcript;
        }
    }

    public convertTimestamp(delta: string): string {
        const seconds = Number(delta);
        let date = new Date(0);
        date.setSeconds(seconds);
        const timestamp = date.toISOString().substring(11, 19);
        return timestamp;
    }

    private findSpeakerStartTimes(labels: { start_time: string, end_time: string, speaker_label: string, items: { speaker_label: string, start_time: string, end_time: string }[] }[]): { start_time: string, label: string }[] {
        const speaker_start_times: { start_time: string, label: string }[] = [];
        labels.forEach(label => {
            label.items.forEach(item => {
                speaker_start_times.push({
                    start_time: item.start_time,
                    label: item.speaker_label ?? 'Anon'
                });
            });
        });

        return speaker_start_times;
    }
}