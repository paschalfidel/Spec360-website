import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import WhatsAppButton from "../components/WhatsAppButton";
import ExitIntentPopup from "../components/ExitIntentPopup";

import {
  AnnouncementBar,
  BackToTop,
  Footer,
  Navbar,
  ScrollToTop,
  SearchOverlay,
} from "./";

export default function Layout({
  cartCount = 0,
}) {
  const [searchOpen, setSearchOpen] =
    useState(false);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const handleOpenSearch = () => {
      setSearchOpen(true);
    };

    window.addEventListener(
      "spec360:open-search",
      handleOpenSearch
    );

    return () => {
      window.removeEventListener(
        "spec360:open-search",
        handleOpenSearch
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <ScrollToTop />

      <AnnouncementBar />

      <Navbar
        cartCount={cartCount}
        onSearch={openSearch}
      />

      <main className="min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />

      <BackToTop />

      <WhatsAppButton />

      <ExitIntentPopup />

      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
      />
    </div>
  );
}