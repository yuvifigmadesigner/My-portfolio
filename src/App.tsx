
import React, { useState, useEffect, Suspense } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './pages/Home';
import Timeline from './components/Timeline';
// Lazy load heavy sections
const About = React.lazy(() => import('./pages/About'));
const Work = React.lazy(() => import('./pages/Work'));
const CollegeAccessProgram = React.lazy(() => import('./pages/CollegeAccessProgram'));
const SupplierQueryManagement = React.lazy(() => import('./pages/SupplierQueryManagement'));
const ClickSpark = React.lazy(() => import('./components/ClickSpark'));
import { Reveal } from './components/Reveal';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'contact' | 'cap' | 'sqm'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#contact' || hash === '#about') return 'contact';
      if (hash === '#cap' || hash === '#college-access-program') return 'cap';
      if (hash === '#sqm' || hash === '#supplier-query-management') return 'sqm';
    }
    return 'home';
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#contact' || hash === '#about') {
        setCurrentPage('contact');
      } else if (hash === '#cap' || hash === '#college-access-program') {
        setCurrentPage('cap');
      } else if (hash === '#sqm' || hash === '#supplier-query-management') {
        setCurrentPage('sqm');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigate = (page: string) => {
    let targetPage: 'home' | 'contact' | 'cap' | 'sqm' = 'home';
    if (page === 'about' || page === 'contact') {
      targetPage = 'contact';
      window.history.pushState(null, '', '#contact');
    } else if (page === 'cap' || page === 'college-access-program') {
      targetPage = 'cap';
      window.history.pushState(null, '', '#cap');
    } else if (page === 'sqm' || page === 'supplier-query-management') {
      targetPage = 'sqm';
      window.history.pushState(null, '', '#sqm');
    } else {
      targetPage = 'home';
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Content = (
    <div className="min-h-screen w-full flex flex-col font-sans relative bg-[#120F17] text-white selection:bg-white/20 items-center overflow-x-clip">

      {/* Solid Background Layer */}
      <Background isMobile={isMobile} />

      {/* Foreground Content Header */}
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="relative z-10 flex flex-col w-full min-h-screen justify-between">
        {currentPage === 'home' ? (
          <div className="flex flex-col w-full">
            <section id="home" className="min-h-screen">
              <MainContent />
            </section>
            <section id="timeline">
              <Timeline />
            </section>
            <section id="work" className="min-h-screen">
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Work onNavigate={handleNavigate} />
              </Suspense>
            </section>
          </div>
        ) : currentPage === 'contact' ? (
          <div className="flex flex-col w-full min-h-screen">
            <section id="contact" className="min-h-screen">
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <About />
              </Suspense>
            </section>
          </div>
        ) : currentPage === 'cap' ? (
          <div className="flex flex-col w-full min-h-screen">
            <section id="cap" className="min-h-screen">
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <CollegeAccessProgram onNavigate={handleNavigate} />
              </Suspense>
            </section>
          </div>
        ) : (
          <div className="flex flex-col w-full min-h-screen">
            <section id="sqm" className="min-h-screen">
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <SupplierQueryManagement onNavigate={handleNavigate} />
              </Suspense>
            </section>
          </div>
        )}

        {/* Global Ultra Minimal Footer */}
        <Footer />
      </main>
    </div>
  );

  // Disable ClickSpark on mobile for performance
  return isMobile ? Content : (
    <Suspense fallback={Content}>
    <ClickSpark
      sparkColor='rgba(255, 255, 255, 0.5)'
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={400}
    >
      {Content}
    </ClickSpark>
    </Suspense>
  );
};

export default App;
