import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CapPageProps {
  onNavigate?: (page: string) => void;
}

const capAssets = [
  '/for CAP page/0_4x.webp',
  '/for CAP page/1_4x.webp',
  '/for CAP page/2_4x.webp',
  '/for CAP page/3_4x.webp',
  '/for CAP page/4_4x.webp',
  '/for CAP page/5_4x.webp',
  '/for CAP page/6_4x.webp',
  '/for CAP page/7_4x.webp',
  '/for CAP page/8_4x.webp',
];

const CollegeAccessProgram: React.FC<CapPageProps> = ({ onNavigate }) => {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [prevAssetIndex, setPrevAssetIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Preload all assets
    capAssets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setActiveAssetIndex((current) => {
        setPrevAssetIndex(current);
        return (current + 1) % capAssets.length;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const workSection = document.getElementById('work');
        if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.location.hash = '#work';
    }
  };

  const handleNextProject = () => {
    // Currently no redirect anywhere; destination will be defined later
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#120F17] text-white selection:bg-[#F05C6D]/30 min-h-screen">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION (Dark Background #120F17)                */}
      {/* ---------------------------------------------------- */}
      <section className="w-full pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto flex flex-col items-start z-10">
        {/* Top Category Label (PP Mori) */}
        <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-6">
          COLLEGE ACCESS PROGRAM
        </span>

        {/* Big Size Title (Stardos Stencil - Warm Ivory) */}
        <h1 className="font-stardos text-4xl sm:text-6xl md:text-[68px] font-normal leading-[1.12] text-[#F5F2EC] tracking-tight mb-8">
          Helping students find what they need on a content-heavy education site
        </h1>

        {/* Subtitle / Overview Reading Text (PP Mori - Warm Paper Grey) */}
        <p className="font-ppmori text-sm sm:text-base text-[#ADA8B6] leading-relaxed max-w-2xl font-light mb-14">
          CAP publishes articles, sessions, deadlines and counsellor tools for students applying to college. The content was all there but students just could not find it. This is a redesign of how the site is organised.
        </p>

        {/* Metadata Row (PP Mori) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-white/10 text-xs font-ppmori">
          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              ROLE
            </span>
            <span className="text-[#D6D1DE] font-light">
              Product Designer, solo
            </span>
          </div>

          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              TYPE
            </span>
            <span className="text-[#D6D1DE] font-light">
              Design assignment
            </span>
          </div>

          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              WHAT I DID
            </span>
            <span className="text-[#D6D1DE] font-light">
              Research, site structure, key screens
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 01 / GOAL, PROBLEMS AND LIMITS (Warm Paper Cream)     */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col">
          {/* Section Number & Title (PP Mori) */}
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-10">
            01 / GOAL, PROBLEMS AND LIMITS
          </span>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Column 1: Goal */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Goal
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Get the right content in front of the right person without making them dig for it, and make moving between sections feel obvious rather than something you learn by trial.
              </p>
            </div>

            {/* Column 2: Problems */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Problems
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                CAP publishes a lot of articles, exam guides, scholarships, advisor sessions. But it all sits behind a menu that treats every item the same way, so students browse instead of finding. New sessions and deadlines get added often, and there is nowhere on the site that shows them.
              </p>
            </div>

            {/* Column 3: Limits I worked inside */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Limits I worked inside
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Use the existing visual language, no new brand direction. No new pages reorganise what already exists. Key screens only, no motion or polish work. No access to users, so everything came from the CAP team directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 02 / WHAT I LEARNED (Warm Paper Cream)                */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col pt-12">
          {/* Section Number & Title (PP Mori) */}
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-10">
            02 / WHAT I LEARNED
          </span>

          <div className="flex flex-col gap-8 text-xs sm:text-sm font-ppmori max-w-3xl mb-12">
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-3">
                Who uses it
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Most articles are written for high school students in grades 10 to 12, across Indian admissions, Indian exams, international admissions, international exams, career guidance, scholarships and university spotlights. Counselors and schools use the site too, but for different things.
              </p>
            </div>

            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-3">
                How people move around today
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                The team told me most users get around through the main menu and the resource sections, and that they were open to making the experience more useful for different kinds of visitors in the next version. They knew something needed to change what that change should be was the open question.
              </p>
            </div>

            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-3">
                How often things change
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                New sessions, events, deadlines and opportunities are added regularly, and much more during admissions season. None of that is visible when you land you only find it if you happen to open the right page.
              </p>
            </div>

            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-3">
                Where this pointed
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Three things came out of this. The site needed a way to search. The menu needed to be grouped by who you are rather than by what type of content it is. And anything time-sensitive needed to be visible the moment you land instead of buried a few clicks deep. Everything after this follows from those three.
              </p>
            </div>
          </div>

          {/* Ultra Minimal Editorial Flow Container */}
          <div className="w-full rounded-[8px] border border-black/[0.07] bg-white p-6 sm:p-8 md:p-10 mb-10 shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-black/[0.06] mb-8">
              <span className="font-ppmori text-xs uppercase tracking-[0.18em] text-[#F05C6D] font-semibold">
                RESEARCH FINDINGS
              </span>
              <span className="font-ppmori text-xs text-[#8A8594] font-light hidden sm:inline-block">
                Problem &middot; Direction &middot; Solution
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
              {/* Pillar 1: Navigation / Structure */}
              <div className="flex flex-col pt-6 md:pt-0 md:px-5 first:pl-0 last:pr-0">
                <span className="font-ppmori text-[11px] font-semibold text-[#F05C6D] uppercase tracking-wider mb-4">
                  01 &middot; Structure
                </span>

                <div className="flex flex-col gap-4">
                  {/* Problem */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Problem
                    </span>
                    <p className="font-editorial text-xl text-[#221F28] font-normal">
                      Same menu for all
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Direction */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Direction
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-medium">
                      Group by audience
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Solution */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Solution
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-semibold">
                      For You section
                    </p>
                    <span className="font-ppmori text-xs text-[#6B6577] font-light mt-0.5">
                      one per visitor type
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Discovery */}
              <div className="flex flex-col pt-6 md:pt-0 md:px-5 first:pl-0 last:pr-0">
                <span className="font-ppmori text-[11px] font-semibold text-[#F05C6D] uppercase tracking-wider mb-4">
                  02 &middot; Discovery
                </span>

                <div className="flex flex-col gap-4">
                  {/* Problem */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Problem
                    </span>
                    <p className="font-editorial text-xl text-[#221F28] font-normal">
                      Updates hidden
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Direction */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Direction
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-medium">
                      Surface on landing
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Solution */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Solution
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-semibold">
                      Updates strip
                    </p>
                    <span className="font-ppmori text-xs text-[#6B6577] font-light mt-0.5">
                      newest items first
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Searchability */}
              <div className="flex flex-col pt-6 md:pt-0 md:px-5 first:pl-0 last:pr-0">
                <span className="font-ppmori text-[11px] font-semibold text-[#F05C6D] uppercase tracking-wider mb-4">
                  03 &middot; Searchability
                </span>
                
                <div className="flex flex-col gap-4">
                  {/* Problem */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Problem
                    </span>
                    <p className="font-editorial text-xl text-[#221F28] font-normal">
                      No search
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Direction */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Direction
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-medium">
                      Add search
                    </p>
                  </div>

                  <div className="w-4 h-[1px] bg-black/15 my-0.5" />

                  {/* Solution */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ppmori uppercase tracking-widest text-[#948F9E] font-medium mb-1">
                      Solution
                    </span>
                    <p className="font-ppmori text-sm text-[#221F28] font-semibold">
                      Header search
                    </p>
                    <span className="font-ppmori text-xs text-[#6B6577] font-light mt-0.5">
                      filter by category
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 02 Auto-Morph Framed Canvas (Decreased Height) */}
          <div className="w-full rounded-[8px] bg-[#DDE8F8] py-2 sm:py-3 md:py-4 px-3 sm:px-6 flex items-center justify-center">
            <div className="w-full relative rounded-[6px] overflow-hidden aspect-[16/8.5]">
              {/* Outgoing Dissolving Frame */}
              {prevAssetIndex !== null && prevAssetIndex !== activeAssetIndex && (
                <motion.img
                  key={`prev-${prevAssetIndex}`}
                  src={capAssets[prevAssetIndex]}
                  alt="Outgoing prototype screen"
                  initial={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  animate={{ opacity: 0, scale: 1.02, y: 14, filter: 'blur(10px)' }}
                  transition={{
                    duration: 2.0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none rounded-[6px]"
                />
              )}

              {/* Active Incoming Frame with Soft Living Ease */}
              <motion.img
                key={`curr-${activeAssetIndex}`}
                src={capAssets[activeAssetIndex]}
                alt={`CAP prototype screen ${activeAssetIndex + 1}`}
                initial={{ opacity: 0, scale: 0.985, y: -14, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 2.0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none rounded-[6px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03 / THE SCREENS (Dark #120F17)                       */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#120F17] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col gap-24">
          {/* Section Number & Title (PP Mori) */}
          <div className="flex flex-col items-start">
            <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              03 / THE KEY COMPONENTS
            </span>
          </div>

          {/* Screen 1: SEARCH */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/making_the_site_searchable_4x.webp"
                alt="Making the site searchable"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Making the site searchable
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              The site had no search at all. I put a search bar in the header where people already expect it, letting results filter across existing categories like exams, scholarships, and admissions so a student who knows what they want can skip the menu entirely.
            </p>
          </div>

          {/* Screen 2: NAVIGATION */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/grouping_the_menu_by_who_you_are_not_what_the_content_is_4x.webp"
                alt="Grouping the menu by who you are, not what the content is"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Grouping the menu by who you are, not what the content is
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              The old menu listed everything at the same level, so a student and a school counselor saw the same wall of links. I pulled the audience-specific destinations into one group called For You, giving each visitor one obvious place to start. I also removed the Partner With Us link from the main menu since it already appeared elsewhere on the page and was competing with the links people actually came for.
            </p>
          </div>

          {/* Screen 3: MEGA MENU */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/what_sits_inside_for_you_4x.webp"
                alt="What sits inside For You"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              What sits inside For You
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              Each audience gets a card with the few things that matter to them rather than a full list of everything available. Students see exam guides and scholarships, schools see programme information. The point was to make the first screen a shortcut, not another index.
            </p>
          </div>

          {/* Screen 4: COUNSELORS */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/giving_counselors_their_own_entry_point_4x.webp"
                alt="Giving counselors their own entry point"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Giving counselors their own entry point
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              Counselors come to the site for very different reasons than students, such as code lookups, application platform guidance, and school-level information. Mixing that into the student path made both harder to use, so it became its own dedicated destination inside For You.
            </p>
          </div>

          {/* Screen 5: STUDENT QUERIES */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/putting_questions_next_to_answers_4x.webp"
                alt="Putting questions next to answers"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Putting questions next to answers
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              CAP runs Ask an Advisor sessions where students get their questions answered. I placed the question form directly alongside the existing FAQs, so a student often finds their answer before they need to ask, and if they do ask, they are already in the right place.
            </p>
          </div>

          {/* Screen 6: RECENT UPDATES */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/showing_what_is_new_the_moment_you_land_4x.webp"
                alt="Showing what is new the moment you land"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Showing what is new the moment you land
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              This was the fix for the biggest problem the team described. Deadlines and sessions change constantly, especially during admissions season, but nothing on the site reflected that. A strip near the top now surfaces the newest items, so returning visitors can see what changed without hunting for it.
            </p>
          </div>

          {/* Screen 7: MOBILE */}
          <div className="flex flex-col gap-4">
            {/* Component Screen Canvas */}
            <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
              <img
                src="/for CAP page/key component/moving_the_main_actions_within_thumb_reach_4x.webp"
                alt="Moving the main actions within thumb reach"
                className="w-full h-auto object-contain rounded-[6px] select-none"
                loading="lazy"
              />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-[#F5F2EC] mt-2">
              Moving the main actions within thumb reach
            </h3>
            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
              Most students open the site on a phone. A bottom bar holds the few things people do repeatedly, like search, resources, and asking a question, so the common paths do not require reaching for a menu at the top of the screen every time.
            </p>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 04 / WHAT IT NEEDS TO ACTUALLY WORK (Paper Cream)     */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col">
          {/* Section Number & Title (PP Mori) */}
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            04 / WHY THE SCREENS WORK THIS WAY
          </span>

          {/* Table Container with Soft Paper & Ink Tones */}
          <div className="w-full rounded-[8px] border border-black/[0.08] bg-white overflow-hidden shadow-sm">
            <div className="w-full bg-[#FCE6EC] px-6 sm:px-8 py-3.5 flex items-center border-b border-black/[0.06]">
              <span className="w-1/3 sm:w-[32%] text-[#2D2936] font-ppmori text-xs uppercase tracking-widest font-semibold">
                FRAMEWORK
              </span>
              <span className="w-2/3 sm:w-[68%] text-[#2D2936] font-ppmori text-xs uppercase tracking-widest font-semibold">
                WHERE IT SHOWED UP
              </span>
            </div>

            <div className="divide-y divide-black/[0.06]">
              {/* Row 1: Jakob's Law */}
              <div className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start gap-2 sm:gap-0 hover:bg-[#FAF7F2]/60 transition-colors">
                <div className="w-full sm:w-[32%] pr-4">
                  <span className="font-ppmori text-xs text-[#6B6577] italic block mb-1">
                    (familiarity)
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#221F28]">
                    Jakob's Law
                  </h4>
                </div>
                <div className="w-full sm:w-[68%]">
                  <p className="font-ppmori text-xs sm:text-sm text-[#555160] leading-relaxed font-light">
                    Placed the search bar in the header at the top-right corner, right where users instinctively expect search on almost every website. This eliminated the friction of having to learn a new pattern.
                  </p>
                </div>
              </div>

              {/* Row 2: Hick's Law */}
              <div className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start gap-2 sm:gap-0 hover:bg-[#FAF7F2]/60 transition-colors">
                <div className="w-full sm:w-[32%] pr-4">
                  <span className="font-ppmori text-xs text-[#6B6577] italic block mb-1">
                    (easy navigation)
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#221F28]">
                    Hick's Law
                  </h4>
                </div>
                <div className="w-full sm:w-[68%]">
                  <p className="font-ppmori text-xs sm:text-sm text-[#555160] leading-relaxed font-light">
                    Shifted the navigation from content-type to audience-type by replacing 8 to 10 fragmented categories like "Exams", "Scholarships", and "Career Guidance" with just 4 intuitive hubs: "For You", "Our Events", "Sessions", and "Counselor". Fewer choices led to faster decision-making.
                  </p>
                </div>
              </div>

              {/* Row 3: Von Restorff Effect */}
              <div className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start gap-2 sm:gap-0 hover:bg-[#FAF7F2]/60 transition-colors">
                <div className="w-full sm:w-[32%] pr-4">
                  <span className="font-ppmori text-xs text-[#6B6577] italic block mb-1">
                    (discoverability)
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#221F28]">
                    Von Restorff Effect
                  </h4>
                </div>
                <div className="w-full sm:w-[68%]">
                  <p className="font-ppmori text-xs sm:text-sm text-[#555160] leading-relaxed font-light">
                    Designed a "Recently Updated" badge and a dedicated updates strip to visually distinguish new and updated items from the rest of the content so they get noticed immediately without requiring deep browsing.
                  </p>
                </div>
              </div>

              {/* Row 4: Recency Bias */}
              <div className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start gap-2 sm:gap-0 hover:bg-[#FAF7F2]/60 transition-colors">
                <div className="w-full sm:w-[32%] pr-4">
                  <span className="font-ppmori text-xs text-[#6B6577] italic block mb-1">
                    (first come, first seen)
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#221F28]">
                    Recency Bias
                  </h4>
                </div>
                <div className="w-full sm:w-[68%]">
                  <p className="font-ppmori text-xs sm:text-sm text-[#555160] leading-relaxed font-light">
                    Organized the updates strip in newest-first order so the most recently added deadline or session appears first. This was essential because the team noted deadlines change constantly, but legacy content previously lingered at the top.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 05 / WHAT CHANGED AND WHAT I LEARNED (Paper Cream)    */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col">
          {/* Section Number & Title (PP Mori) */}
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            05 / WHAT CHANGED AND WHAT I LEARNED
          </span>

          <div className="flex flex-col gap-5 text-sm sm:text-base font-ppmori text-[#524E5C] font-light leading-relaxed max-w-3xl">
            <p>
              Before this, CAP's content sat behind a menu that treated a student and a school counselor the same way, and nothing on the site showed what had recently been added. After it, there is a way to search, a menu grouped by who you are, and a place where new sessions and deadlines show up on their own.
            </p>
            <p>
              What I would do differently: I locked the menu structure before sketching screens, and while sketching I found two groupings that did not hold up. Next time I would keep both moving together rather than treating structure as something to finish first.
            </p>
            <p>
              What I am still unsure about: I grouped by audience, which assumes people know which group they belong to. A student who is also applying abroad might fit two. I would want to watch a few people use it before calling that settled.
            </p>
            <p>
              What I would push back on: everything I know about these users came through the team, not from the users. That was the constraint, but for a project this dependent on how people search, even three conversations with actual students would have changed how much I could claim.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 06 / WHAT I WOULD DO NEXT (Paper Cream)               */}
      {/* ---------------------------------------------------- */}
      <section className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] pb-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col pt-12">
          {/* Section Number & Title (PP Mori) */}
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            06 / WHAT I WOULD DO NEXT
          </span>

          <div className="flex flex-col gap-5 text-sm sm:text-base font-ppmori text-[#524E5C] font-light leading-relaxed max-w-3xl mb-16">
            <p>
              The first thing I would test is whether the For You grouping actually matches how students think about themselves, by watching a handful of people try to find something specific and seeing where they go first.
            </p>
            <p>
              After that, the categories inside search are worth checking. I used the ones CAP already writes with, but the words a team uses to organise content are not always the words a student types.
            </p>
            <p>
              If this had shipped, I would have looked at how often search gets used and whether people who use it reach a page faster than people who browse. That would tell us whether search solved the finding problem or just added another way to browse.
            </p>
          </div>

          {/* Bottom Action Navigation Bar (PP Mori) */}
          <div className="flex items-center justify-between pt-12 border-t border-black/10">
            <button
              onClick={handleBackToHome}
              className="text-[#F05C6D] font-ppmori text-xs uppercase tracking-wider font-semibold hover:underline transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ← BACK TO HOME
            </button>

            <button
              onClick={handleNextProject}
              className="px-6 py-2.5 rounded-[4px] bg-[#FCE6EC] text-[#E04556] font-ppmori text-xs uppercase tracking-wider font-semibold hover:bg-[#fbd3dc] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>NEXT PROJECT</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegeAccessProgram;
