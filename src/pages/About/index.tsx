import React, { useEffect } from 'react';
import { Mail, Phone, Coffee } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import Footer from '../../components/Footer';

const ContactCard = React.lazy(() => import('../../components/ContactCard'));

const About: React.FC = () => {
  const [outerHeight, setOuterHeight] = React.useState<number | null>(null);
  const [isFormStep, setIsFormStep] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const calContainerRef = React.useRef<HTMLDivElement>(null);
  const outerFrameRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "30min" });
      cal("ui", {
        "cssVarsPerTheme": {
          "dark": { "cal-brand": "#F05C6D" },
          "light": { "cal-brand": "#F05C6D" }
        },
        "hideEventTypeDetails": true,
        "layout": "month_view"
      });

      // Cal.com Embed API Event Subscriptions
      cal("on", {
        action: "*",
        callback: (e: any) => {
          const actionName = e?.detail?.action || e?.action || e?.type;
          if (actionName === 'slotSelected' || actionName === 'bookingFormLoaded') {
            setIsFormStep(true);
          } else if (actionName === 'eventTypeViewed') {
            setIsFormStep(false);
          }
        }
      });
    })();
  }, []);

  // Dynamic ResizeObserver, MutationObserver & postMessage listener to auto-adjust outer frame width & height for desktop
  useEffect(() => {
    const updateDimensions = () => {
      if (!calContainerRef.current) return;
      
      const iframe = calContainerRef.current.querySelector('iframe');
      const target = iframe || calContainerRef.current;
      
      const rect = target.getBoundingClientRect();
      const measuredHeight = rect.height || calContainerRef.current.offsetHeight;
      const isMob = window.innerWidth < 768;

      if (measuredHeight > 200) {
        if (isMob) {
          setOuterHeight(Math.max(580, Math.round(measuredHeight)));
        } else {
          setOuterHeight(Math.max(480, Math.min(680, Math.round(measuredHeight - 16))));
        }
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      const dataStr = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      const isMob = window.innerWidth < 768;

      // Detect step changes: Form step vs Month view
      if (
        dataStr.includes('slotSelected') || 
        dataStr.includes('bookingForm') || 
        dataStr.includes('confirmBooking') ||
        dataStr.includes('bookingFormLoaded')
      ) {
        setIsFormStep(true);
      } else if (dataStr.includes('eventTypeViewed') || dataStr.includes('month_view')) {
        setIsFormStep(false);
      }

      if (dataStr.includes('resize') || dataStr.includes('height') || dataStr.includes('dimension')) {
        let calHeight = 0;
        try {
          const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          calHeight = parsed?.data?.height || parsed?.detail?.data?.height || 0;
        } catch (e) {}

        if (calHeight > 200) {
          if (isMob) {
            setOuterHeight(calHeight + 16);
          } else {
            setOuterHeight(Math.max(480, Math.min(680, Math.round(calHeight))));
          }
        } else {
          updateDimensions();
        }
      }
    };

    if (calContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(calContainerRef.current);
      
      const iframe = calContainerRef.current.querySelector('iframe');
      if (iframe) resizeObserver.observe(iframe);

      const mutationObserver = new MutationObserver(() => {
        updateDimensions();
        const newIframe = calContainerRef.current?.querySelector('iframe');
        if (newIframe) resizeObserver.observe(newIframe);
      });

      mutationObserver.observe(calContainerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });

      window.addEventListener('resize', updateDimensions);
      window.addEventListener('message', handleMessage);

      updateDimensions();
      const interval = setInterval(updateDimensions, 1000);

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('message', handleMessage);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <>
      <main className="w-full min-h-screen flex flex-col justify-start px-6 md:px-12 relative z-10 text-white max-w-screen-xl 2xl:max-w-screen-2xl mx-auto pt-10 md:pt-14 pb-16 select-none">
        
        {/* Page Header (Centered Signature Badge with Highlighter & Dots) */}
        <div className="w-full flex justify-center items-center mb-10 md:mb-14 font-stardos shrink-0 pt-2">
          <div className="relative inline-block select-none z-10">
            <div className="absolute -top-3.5 left-0 bottom-0 w-[2px] bg-[#F05C6D] z-10">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
            </div>
            <h1 className="px-5 py-2.5 lg:px-6 lg:py-2.5 bg-[#F05C6D]/20 backdrop-blur-md text-white font-stardos text-[22px] sm:text-[26px] lg:text-[30px] font-bold tracking-[0.1em] uppercase whitespace-nowrap leading-none relative z-0">
              CONNECT
            </h1>
            <div className="absolute top-0 right-0 -bottom-3.5 w-[2px] bg-[#F05C6D] z-10">
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch flex-1 min-h-0 overflow-hidden max-w-7xl mx-auto w-full">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between gap-3 order-2 lg:order-1 shrink-0">
            
            <div className="flex flex-col gap-2.5 2xl:gap-3 flex-1 justify-center">
              <ContactCard
                index={0}
                label="Email"
                value="yuvrajkumar0221@gmail.com"
                href="mailto:yuvrajkumar0221@gmail.com"
                icon={Mail}
                color="#EDEDED"
              />
              <ContactCard
                index={1}
                label="Phone"
                value="+91 76988 93369"
                href="tel:+917698893369"
                icon={Phone}
                color="#F05C6D"
              />
              <ContactCard
                index={2}
                label="Support"
                value="Buy Me a Coffee"
                href="https://buymeacoffee.com/yuvraj.gupta"
                icon={Coffee}
                color="#FFDD00"
              />
            </div>
          </div>

          {/* Right Column: Calendar Widget */}
          <div className="lg:col-span-8 xl:col-span-8 w-full flex items-center justify-center order-1 lg:order-2 shrink-0">
            <div 
              ref={outerFrameRef}
              style={{
                height: outerHeight ? `${outerHeight}px` : undefined,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className={`w-full transition-all duration-400 ease-out rounded-2xl overflow-hidden shadow-2xl relative bg-[#120F17] border border-white/10 p-0 shrink-0 mx-auto min-h-[580px] md:min-h-0 ${
                isFormStep ? 'max-w-[480px] sm:max-w-[510px]' : 'max-w-full'
              }`}
            >
               {/* Inner Edge Glass Blur & Soft Vignette Ring Overlay */}
               <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_20px_6px_rgba(18,15,23,0.9)] ring-1 ring-inset ring-white/10" />

               <div 
                 ref={calContainerRef}
                 onClick={(e) => {
                   const text = (e.target as HTMLElement)?.innerText || '';
                   if (/\d{1,2}:\d{2}/.test(text)) {
                     setIsFormStep(true);
                   } else if (text.toLowerCase().includes('back')) {
                     setIsFormStep(false);
                   }
                 }}
                 className="w-full md:w-[calc(100%+16px)] h-full md:h-[calc(100%+56px)] rounded-2xl overflow-hidden bg-[#120F17] pt-2 md:pt-6 ml-0 md:ml-[-8px] mb-0 md:mb-[-56px]"
               >
                 <Cal 
                  namespace="30min"
                  calLink="book-with-yuvi/30min"
                  style={{ width: "100%", height: "100%", overflow: "hidden" }}
                  config={{ "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": "dark" }}
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default About;
