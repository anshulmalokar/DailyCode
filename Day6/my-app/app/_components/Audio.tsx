import { Loader2, Volume2, Zap } from "lucide-react";
import React, { useCallback, useState } from "react";

type Props = {};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Converts signed 16-bit PCM audio data (from the API) into a playable WAV Blob.
 * @param pcm16 Raw Int16Array of audio data.
 * @param sampleRate The sample rate of the audio (API returns 24000 Hz).
 */
const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit PCM
  const bufferLength = pcm16.length * bytesPerSample;

  const arrayBuffer = new ArrayBuffer(44 + bufferLength);
  const dataView = new DataView(arrayBuffer);

  // RIFF Chunk
  writeString(dataView, 0, "RIFF"); // Chunk ID
  dataView.setUint32(4, 36 + bufferLength, true); // Chunk size
  writeString(dataView, 8, "WAVE"); // Format

  // FMT Sub-chunk
  writeString(dataView, 12, "fmt "); // Sub-chunk 1 ID
  dataView.setUint32(16, 16, true); // Sub-chunk 1 size (PCM)
  dataView.setUint16(20, 1, true); // Audio format (1 = PCM)
  dataView.setUint16(22, numChannels, true); // Number of channels
  dataView.setUint32(24, sampleRate, true); // Sample rate
  dataView.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // Byte rate
  dataView.setUint16(32, numChannels * bytesPerSample, true); // Block align
  dataView.setUint16(34, 16, true); // Bits per sample (16 bit)

  // Data Sub-chunk
  writeString(dataView, 36, "data"); // Sub-chunk 2 ID
  dataView.setUint32(40, bufferLength, true); // Sub-chunk 2 size
  let offset = 44;
  for (let i = 0; i < pcm16.length; i++) {
    dataView.setInt16(offset, pcm16[i], true);
    offset += 2;
  }

  return new Blob([dataView], { type: "audio/wav" });
};

const Audio = (props: Props) => {
  const [textInput, setTextInput] = useState<string>(
    "Hello! My name is Kore. I am a firm and reliable voice. Generating audio within a modern Next.js environment."
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loding, setLoding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generteSpeech = useCallback(async () => {
    if (loding) return;
    if (textInput.trim() === "") {
      setError("Please enter the text to generate speech");
      return;
    }

    setLoding(true);
    setError(null);
    setAudioUrl(null);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const TTS_SAMPLE_RATE = 24000;

    const payload = {
      contents: [
        {
          parts: [{ text: textInput }],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
      model: "gemini-2.5-flash-preview-tts",
    };

    try {
      let response;
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) break;

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        } else {
          throw new Error(
            `Failed to fetch audio after ${maxRetries} attempts.`
          );
        }
      }

      if (!response || !response.ok) {
        throw new Error("API request failed or maximum retries exceeded.");
      }

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType; // Should be audio/L16;rate=24000

      if (!audioData || !mimeType || !mimeType.startsWith("audio/L16")) {
        throw new Error("Invalid or missing audio data in API response.");
      }

      // 1. Convert base64 data to raw signed 16-bit PCM
      const pcmDataBuffer = base64ToArrayBuffer(audioData);
      const pcm16 = new Int16Array(pcmDataBuffer);

      // 2. Convert raw PCM to a playable WAV Blob
      const wavBlob = pcmToWav(pcm16, TTS_SAMPLE_RATE);

      // 3. Create a temporary URL for the HTML <audio> element
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (e) {
      console.error("TTS Generation Error:", e);
      setError(
        `Audio generation failed: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    } finally {
      setLoding(false);
    }
  }, [textInput, loding]);

  return <>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center space-x-3 mb-6 border-b pb-4">
          <Zap className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">AI Speech Synthesizer (Next.js)</h1>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Enter text below to convert it into human-like speech using the Gemini Text-to-Speech API.
        </p>

        {/* Text Input Area */}
        <div className="mb-6">
          <label htmlFor="tts-input" className="block text-sm font-medium text-gray-700 mb-2">
            Text to Speak
          </label>
          <textarea
            id="tts-input"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none shadow-sm"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loding}
            placeholder="Type your message here..."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={generteSpeech}
          disabled={loding}
          className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md transition duration-200 
            ${loding 
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {loding ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Volume2 className="w-5 h-5 mr-2" />
          )}
          {loding ? 'Generating Audio...' : 'Generate Speech'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Audio Player */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Playback</p>
          {audioUrl ? (
            <audio controls src={audioUrl} className="w-full rounded-lg shadow-inner"></audio>
          ) : (
            <div className="p-4 text-center bg-gray-100 border border-dashed border-gray-300 rounded-lg text-gray-500">
              Generated audio will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  </>
};

const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};