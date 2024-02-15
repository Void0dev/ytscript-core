import CopyButton from "@/components/CopyButton";
import classNames from "@/util/classNames";
import isEmpty from "@/util/isEmpty";
import { Switch, Tab } from "@headlessui/react";
import { Fragment,  useState } from "react";

const colorMap = [
  "text-blue-400",
  "text-pink-400",
  "text-cyan-400",
  "text-orange-400",
  "text-red-400",
  "text-green-400",
  "text-magenta-400",
  "text-purple-400",
];

const SpeakerLine = ({
  transcriptSpeaker,
  speaker,
}: {
  transcriptSpeaker: number | undefined;
  speaker: number;
}) => {
  if (speaker === undefined || transcriptSpeaker !== speaker) {
    speaker = transcriptSpeaker ?? 0;
    return (
      <p className={`-mb-5 speaker ${colorMap[speaker]}`}>Speaker {speaker}:</p>
    );
  }

  return <></>;
};

const Utterances = ({ data }: { data: any }) => {
  let speaker: number;

  return (
    <>
      {data.results.utterances.map(
        (
          utterance: {
            channel: number;
            confidence: number;
            end: number;
            id: string;
            start: number;
            transcript: string;
            speaker?: number;
            words: [];
          },
          idx: number
        ) => (
          <Fragment key={idx}>
            {utterance.speaker !== undefined && (
              <SpeakerLine
                transcriptSpeaker={utterance.speaker}
                speaker={speaker}
              />
            )}
            <p>{utterance.transcript}</p>
          </Fragment>
        )
      )}
    </>
  );
};

const Paragraphs = ({ data }: { data: any }) => {
  let speaker: number;

  return (
    <>
      {data.results.channels[0].alternatives[0].paragraphs.paragraphs.map(
        (
          paragraph: {
            end: 29.446638;
            num_words: 40;
            sentences: { end: number; start: number; text: string }[];
            speaker?: number;
            words: [];
          },
          idx: number
        ) => (
          <Fragment key={idx}>
            {paragraph.speaker !== undefined && (
              <SpeakerLine
                transcriptSpeaker={paragraph.speaker}
                speaker={speaker}
              />
            )}
            <p>
              {paragraph.sentences.map((sentence, idxx: number) => (
                <Fragment key={idxx}> {sentence.text}</Fragment>
              ))}
            </p>
          </Fragment>
        )
      )}
    </>
  );
};

const UtterancesParagraphsSwitching = ({ data }: { data: any }) => {
  let speaker: number;

  const [paragraphs, setParagraphs] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <span className={paragraphs ? "text-gray-200" : "text-[#687ef7]"}>
          Utterances
        </span>
        <Switch
          checked={paragraphs}
          onChange={setParagraphs}
          className="bg-gray-500 relative inline-flex h-6 w-11 items-center rounded-full"
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              paragraphs ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span className={paragraphs ? "text-[#687ef7]" : "text-gray-200"}>
          Paragraphs
        </span>
      </div>
      <div>
        {paragraphs ? <Paragraphs data={data} /> : <Utterances data={data} />}
      </div>
    </>
  );
};

const Transcript = ({ data }: { data: any }) => {
  let speaker: number;

  if (data.results.channels[0].alternatives[0].paragraphs) {
    return <Paragraphs data={data} />;
  }

  return <p>{data.results.channels[0].alternatives[0].transcript}</p>;
};

const Words = ({ data }: { data: any }) => {
  if (data.results.channels[0].alternatives[0].paragraphs) {
    return <Paragraphs data={data} />;
  }

  const paragraphs: { speaker: undefined | number; text: string }[] = [];
  let currentSpeaker: undefined | number;
  let currentParagraph = "";

  data.results.channels[0].alternatives[0].words.forEach(
    (word: {
      word: string;
      start: number;
      end: number;
      confidence: number;
      speaker?: number;
      speaker_confidence?: number;
      punctuated_word?: string;
    }) => {
      if (currentSpeaker === undefined) {
        currentSpeaker = word.speaker;
      }

      if (currentSpeaker !== word.speaker) {
        paragraphs.push({
          speaker: currentSpeaker,
          text: currentParagraph.trim(),
        });
        currentSpeaker = word.speaker;
        currentParagraph = "";
      }

      currentParagraph += ` ${word.punctuated_word || word.word}`;
    }
  );

  paragraphs.push({ speaker: currentSpeaker, text: currentParagraph.trim() });
  let speaker: number;

  return (
    <>
      {paragraphs.map(
        (
          paragraph: { speaker: undefined | number; text: string },
          idx: number
        ) => (
          <Fragment key={idx}>
            {paragraph.speaker !== undefined && (
              <SpeakerLine
                transcriptSpeaker={paragraph.speaker}
                speaker={speaker}
              />
            )}
            <p>{paragraph.text}</p>
          </Fragment>
        )
      )}
    </>
  );
};

const TranscriptionTypes = ({
  data,
}: {
  data: any;
}) => {
  return (
     <Words data={data} />
  );
};



const FeatureTab = ({ children }: { children: any }) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <a
          className={classNames(
            selected ? "ghost--purple " : "ghost--black",
            "ghost whitespace-nowrap text-center rounded-md outline-0"
          )}
          href="#"
        >
          <span className="px-4 py-2 rounded-md">{children}</span>
        </a>
      )}
    </Tab>
  );
};

const TranscriptionResults = ({
  data,
}: {
  data: any;
}) => {
  if (isEmpty(data)) return <></>;


  return (
    <div className="mt-8 bg-[#101014] rounded-lg transcription-results">
      <TranscriptionTypes data={data}/>
    </div>
  );
};

export default TranscriptionResults;
