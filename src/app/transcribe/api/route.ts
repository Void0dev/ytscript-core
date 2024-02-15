import { createClient } from "@supabase/supabase-js";
import { Deepgram } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import { ReadStreamSource } from "@deepgram/sdk/dist/types";
import fs from "fs";
import urlParser from "@/util/urlParser";
import ytdl from "ytdl-core";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

const dg = new Deepgram(
  process.env.DEEPGRAM_API_KEY as string
);

export async function POST(request: Request) {
  const body: {
    source: { url: string };
  } = await request.json();
  const { source} = body;

  const videoId = urlParser(source.url);
  const mp3FilePath = `/tmp/ytdl-${videoId}.mp3`;
  const stream = fs.createWriteStream(mp3FilePath);

  const getVideo = new Promise((resolve, reject) => {
    const fetch = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    fetch.pipe(stream);
    fetch.on("end", async () => {
      const dgSource: ReadStreamSource = {
        stream: fs.createReadStream(mp3FilePath),
        mimetype: "audio/mp3",
      };

      const dgFeatures = {
        utterances: true,
        smart_format: true,
        detect_language: true,
        diarize: true,
        utt_split: 1.2,
      }

      try {
        const transcript: {
          results?: any;
          metadata?: any;
          err_msg?: string;
        } = await dg.transcription.preRecorded(dgSource, dgFeatures);

        if (transcript.err_msg) throw new Error(transcript.err_msg);

        const data = {
          source,
          ...transcript,
        };

        const result = {
          url: source.url,
          request_id: transcript.metadata.request_id,
          data,
        }

        const { error } = await supabase.from("transcriptions").insert(result);

        if (error) throw new Error(error.message);

        resolve(result);
      } catch (error) {
        if (error instanceof Error) {
          reject(error.message);
        }
      }
    });
  });

  return NextResponse.json(await getVideo);
}
