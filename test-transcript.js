import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('xHRHV0aovIg');
    console.log('SUCCESS: Extracted ' + transcript.length + ' lines.');
  } catch (err) {
    console.error('ERROR (ID):', err.message);
  }
}

test();
