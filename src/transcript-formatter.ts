export default class TranscriptFormatter {
    public format(path: string): void {
        console.debug('read file as json');
        const data: JSON = JSON.parse('');

        console.debug('check if speaker labels present');
        if ('speaker_labels' in data) {
            console.debug('get speaker labels');

            console.debug('foreach speaker label get segments');
            console.debug('foreach segment get items');
            console.debug('foreach item get start_time, label speaker')
            console.debug('foreach item get start time, get content or punctuation')
            console.debug('sort lines')
        } else {
            console.debug('get raw transcript');
        }

    }
}