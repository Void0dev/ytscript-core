"use client";

import YouTubeLogo from "@/components/YouTubeLogo";
import PaginationBar from "@/components/pagination/Bar";
import PaginationButton from "@/components/pagination/Button";
import { useErrorContext } from "@/context/error";
import { useTranscriptionContext } from "@/context/transcription";
import {
  ArrowLongRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const Next = () => {
  const { url } = useTranscriptionContext();

  return (
    <PaginationButton
      href="/transcribe"
      error="Please enter a YouTube link."
    >
        Get results
        <ArrowLongRightIcon className="ml-3 h-6" aria-hidden="true" />
    </PaginationButton>
  );
};

const Home = () => {
  const { setError } = useErrorContext();
  const { url, setUrl } = useTranscriptionContext();

  return (
    <div className="flex flex-col prose prose-invert max-w-full gap-2">
      <div className="bg-[#101014] rounded-md min-w-full p-5 ring-1 ring-inset ring-[#88888C] focus-within:ring-2 focus-within:ring-[#677df5] flex gap-4">
        <YouTubeLogo />
        <div className="grow flex flex-col gap-2">
          <label htmlFor="name" className="block font-medium text-[#E1E1E5]">
            YouTube video link
          </label>
          <input
            type="url"
            name="youtube"
            value={url}
            onChange={(event) => {
              setError("");
              setUrl(event.target.value);
            }}
            className="block w-2/3 border-0 border-b border-gray-600 p-0 px-2 focus:border-[#677df5] bg-[#101014] text-[#E1E1E5] placeholder:text-gray-400 focus:outline-none focus:ring-0 text-sm leading-6"
            placeholder="Paste a YouTube link here."
          />
        </div>
      </div>
      <PaginationBar next={Next} />

    </div>
  );
};

export default Home;
