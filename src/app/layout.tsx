import Brand from "@/components/Brand";
import Errors from "@/components/Errors";

import "./globals.css";
import { Inter } from "next/font/google";
import { TranscriptionContextProvider } from "@/context/transcription";
import { ErrorContextProvider } from "@/context/error";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Transcribe a YouTube video!",
  description: "Seedz.ai - Voice transcriber.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-color-scheme="dark">
      <body className={`${inter.className} body`}>
        <ErrorContextProvider>
          <TranscriptionContextProvider>
            <main className="flex justify-center mt-20 mx-auto p-8 lg:p-4">
              <div className="w-[48em] gap-2">
                <Brand />
                <Errors />
                <div>{children}</div>
              </div>
            </main>
          </TranscriptionContextProvider>
        </ErrorContextProvider>
      </body>
    </html>
  );
}
