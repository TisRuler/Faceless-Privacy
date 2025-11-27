import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Bars3Icon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { openErrorLogModal, openGeneralSettingsModal } from "../../Modals/modalUtils";
import { masterConfig } from "~~/src/config/masterConfig";
import { externalLinks } from "~~/src/config/externalLinks";
import TwitterIcon from "~~/src/assets/images/icons/TwitterIcon.svg";
import GithubIcon from "~~/src/assets/images/icons/GithubIcon.svg";
import DiscordIcon from "~~/src/assets/images/icons/DiscordIcon.svg";
import Image from "next/image";
import Link from "next/link";

const textSize = "text-xs sm:text-sm";

// Helper
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "font-isb text-main-base" : "text-main-base lg:font-im lg:text-main-100"
      } hover:text-main-base ${textSize}`}
    >
      {children}
    </Link>
  );
};

// Helper
const MoreMenuTextLinks = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`${textSize} flex w-full cursor-pointer items-center gap-2 whitespace-nowrap px-2 py-1 text-main-base hover:rounded-xl hover:hover:bg-main-500`}
    >
      <ArrowUpRightIcon className="h-6 w-4" />
      <span className="whitespace-nowrap">{text}</span>
    </button>
  );
};

// Helper
const MoreMenuItems = () => (
  <>
    <div className="px-2 sm:my-2">
      <MoreMenuTextLinks text="View Your Errors" onClick={openErrorLogModal} />
      <MoreMenuTextLinks text="Documentation" onClick={() => {console.log("Documentation link not added yet");}} />
    
      {/* socials */}
      <div className="flex items-center justify-between  gap-3 px-1 py-1">
  <a
    href={externalLinks.twitter}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-main-500"
  >
    <Image alt="Twitter" src={TwitterIcon} width={22} height={22} />
  </a>

  <a
    href={externalLinks.discord}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-main-500"
  >
    <Image alt="Discord" src={DiscordIcon} width={22} height={22} />
  </a>

  <a
    href={externalLinks.github}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-main-500"
  >
    <Image alt="Github" src={GithubIcon} width={22} height={22} />
  </a>
</div>
      <p className="text-center text-xs text-main-300">Version {masterConfig.version}</p>
    </div>
  </>
);

// Main
export const Nav = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(burgerMenuRef, () => setIsDrawerOpen(false));
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));
  useOutsideClick(moreMenuRef, () => setIsMoreOpen(false));

  const MoreLinks = (
    <div className="flex items-center justify-center text-main-100 hover:text-main-base">
      <div className="dropdown-centre dropdown leading-3 lg:flex" ref={dropdownRef}>
        <label
          tabIndex={0}
          className={`dropdown-toggle flex h-[1.75em] cursor-pointer items-center gap-0 rounded-xl border ${
            isDropdownOpen ? "border hover:bg-primary-button-gradient" : "border-transparent"
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <h1 className="mx-1 mt-[-13px] text-2xl text-main-100 hover:text-main-base">...</h1>
        </label>
        {isDropdownOpen && (
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box z-[2] mt-7 gap-1 border border-main-100 bg-black p-1"
          >
            <MoreMenuItems />
          </ul>
        )}
      </div>
    </div>
  );

  const navLinks = (
    <div className="ml-2 mt-1 flex flex-col lg:ml-0 lg:flex-[unset] lg:flex-none lg:flex-row">
      <span className="list-none px-2 py-2 lg:mx-4">
        <NavLink href="/wallet">Wallet</NavLink>
      </span>
      <span className="mr-3 list-none px-2 py-2">
        <NavLink href="/analytics">Privacy Analytics</NavLink>
      </span>
      <span className="mr-3 list-none px-2 py-2 lg:hidden">
        <button onClick={openGeneralSettingsModal} className={`lg:font-im ${textSize}`}>Settings</button>
      </span>
      <ul className="menu menu-horizontal hidden gap-2 font-im lg:flex lg:flex-nowrap">
        {MoreLinks}
      </ul>
    </div>
  );

  return (
    <div className="text-main-base">
      {/* Mobile nav */}
      <div className="dropdown lg:hidden" ref={burgerMenuRef}>
        <button
          className={"btn btn-ghost"}
          onClick={() => {
            setIsDrawerOpen(prev => !prev);
            setIsMoreOpen(false);
          }}
        >
          <Bars3Icon className="h-1/2" style={{ strokeWidth: 2 }} />
        </button>

        {isDrawerOpen && (
          <ul
            tabIndex={0}
            className="menu-compact menu dropdown-content rounded-box ml-4 w-32 border border-main-base bg-black"
            onClick={() => {
              if (!isMoreOpen) setIsDrawerOpen(prev => prev);
            }}
          >
            {navLinks}
            <button
              className="navbar-start mb-2 ml-4 mt-[-0.1em] grid w-full rounded-full text-lg sm:text-xl lg:border-2"
              onClick={() => setIsMoreOpen(prev => !prev)}
            >
              <span>...</span>
            </button>

            {isMoreOpen && (
              <ul
                className="menu dropdown-content rounded-box z-[2] ml-[-8px] mt-[185px] border border-main-base bg-black"
              >
                <MoreMenuItems />
              </ul>
            )}
          </ul>
        )}
      </div>

      {/* Desktop nav */}
      <div className="hidden items-center justify-center text-sm lg:flex">
        {navLinks}
      </div>
    </div>
  );
};
