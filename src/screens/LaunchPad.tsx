import React from "react";
import { useRouter } from "next/navigation";
import { externalLinks } from "../config/externalLinks";
import Image from "next/image";
import Link from "next/link";
import logo from "~~/src/assets/images/logo/text-logo.svg";

export const LaunchPad = () => {
  const router = useRouter();

  return (
    <div className="h-screen overflow-y-auto bg-black/30 text-white">

      {/* Main Content */}
      <div className="flex min-h-screen flex-col overflow-y-auto bg-black/30 text-white">

        {/* Hero Section */}
        <section className="mt-[-6em] flex min-h-screen flex-col items-center justify-center px-4 text-center sm:mt-[-8em] sm:px-0">

          {/* Logo */}
          <div className="relative mb-4 flex w-full items-center justify-center">
            {/* White glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-white opacity-20 blur-3xl sm:h-40 sm:w-40"></div>
            </div>

            {/* SVG */}
            <Link href="/" passHref className="relative flex h-8 w-64 sm:h-24 sm:w-full">
              <Image alt="Logo" className="relative z-10 cursor-pointer" fill src={logo} />
            </Link>
          </div>

          {/* Heading */}
          <h2 className="mb-6 font-isb text-xl sm:mb-10 sm:text-4xl">
              Send & Receive Crypto Privately
          </h2>

          {/* Button */}
          <button 
            className="z-10 flex h-12 cursor-pointer items-center whitespace-nowrap rounded-full border-2 border-white px-6 transition-all duration-300 hover:bg-primary-button-gradient sm:h-[3em] sm:px-8"
            onClick={() => router.push("/wallet")}
          >
            <span className="text-base font-semibold sm:text-lg">Launch App</span>
          </button>
        </section>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 w-full border-t border-white/10 py-6 text-center sm:py-12">
          <p className="mb-2 text-lg text-main-300 sm:mb-6">Connect your wallet to access your private address.</p>
          <div className="flex justify-center space-x-6">
            <a href={externalLinks.twitter} target="_blank" className="text-main-300 hover:text-main-base">Twitter</a>
            <a href={externalLinks.discord} target="_blank" className="text-main-300 hover:text-main-base">Discord</a>
            <a href={externalLinks.docs} target="_blank" className="text-main-300 hover:text-main-base">Docs</a>
            <a href={externalLinks.github} target="_blank" className="text-main-300 hover:text-main-base">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
};