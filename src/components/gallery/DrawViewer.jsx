import { useCallback, useEffect, useState } from "react";

export default function DrawViewer({ draws }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeViewer = useCallback(() => setIsVisible(false), []);
  const nextDraw = useCallback(
    () => setCurrentIndex((i) => (i + 1) % draws.length),
    [draws.length]
  );
  const prevDraw = useCallback(
    () => setCurrentIndex((i) => (i - 1 + draws.length) % draws.length),
    [draws.length]
  );

  useEffect(() => {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    const handleGalleryClick = (e) => {
      const wrapper = e.target.closest("[data-id]");
      if (!wrapper) return;

      const id = wrapper.dataset.id;
      const drawIndex = draws.findIndex((draw) => draw.id === id);

      if (drawIndex !== -1) {
        setCurrentIndex(drawIndex);
        setIsVisible(true);
      }
    };

    gallery.addEventListener("click", handleGalleryClick);
    return () => gallery.removeEventListener("click", handleGalleryClick);
  }, [draws]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextDraw();
      if (e.key === "ArrowLeft") prevDraw();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, closeViewer, nextDraw, prevDraw]);

  if (!isVisible || !draws.length) return null;

  const currentDraw = draws[currentIndex];

  const handleViewerClick = (e) => {
    // Cierra el visor si el clic ocurre en el fondo oscuro
    if (e.target.id === 'viewer-overlay') {
      closeViewer();
    }
  };

  return (
    <div 
      id="viewer-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--brown)]/20 backdrop-blur-sm animate-fade-in"
      onClick={handleViewerClick}
    >
      <div 
        className="relative w-full h-full sm:h-full max-w-screen-xl max-h-screen-xl flex flex-col md:flex-row items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Evita que los clics en el contenido cierren el visor
      >
        {/* Imagen */}
        <div className="relative flex items-center justify-center flex-grow w-full h-full p-2 md:p-4">
          <img
            src={currentDraw.image}
            alt={`Dibujo ${currentDraw.id} en Técnica: ${currentDraw.technique}`}
            className="max-h-[80vh] md:max-h-[85vh] max-w-full object-contain rounded-md shadow-xl border border-[var(--coffee)]/40"
          />

          {/* Prev */}
          <button
            onClick={prevDraw}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 
            bg-[var(--coffee)]/60 hover:bg-[var(--coffee)]/80 
            text-[var(--highlight)] rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Dibujo anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={nextDraw}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 
            bg-[var(--coffee)]/60 hover:bg-[var(--coffee)]/80 
            text-[var(--highlight)] rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Siguiente dibujo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Panel Desktop */}
        <div className="hidden md:flex flex-col gap-3 text-[var(--grey)] bg-[var(--brown)]/30 rounded-lg p-4 w-72 backdrop-blur-sm max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
          {/* Botón cerrar */}
          <button
            onClick={closeViewer}
            className="absolute top-2 right-2 bg-[var(--coffee)]/50 hover:bg-[var(--coffee)]/70 
            text-[var(--highlight)] rounded-full w-7 h-7 flex items-center justify-center"
            aria-label="Cerrar visor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <h2 className="text-xl font-semibold text-[var(--gold)]">
            {currentDraw.technique}
          </h2>
          <p className="text-xs text-[var(--highlight)]">{currentDraw.created_at}</p>
          <p className="text-sm text-[var(--skin)] italic line-clamp-4">
            {currentDraw.materials}
          </p>

          <a
            href={currentDraw.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--gold)] hover:bg-[var(--highlight)] rounded-full text-[var(--brown)] font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
          </a>

          {/* Progreso */}
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-xs text-[var(--highlight)]">
              {currentIndex + 1} / {draws.length}
            </span>
            <div className="w-full h-1 bg-[var(--skin)]/20 rounded-full">
              <div
                className="h-1 bg-[var(--gold)] rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / draws.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Panel Móvil */}
        <div className="absolute bottom-0 left-0 w-full flex md:hidden flex-col items-center gap-2 bg-[var(--brown)]/70 backdrop-blur-sm text-[var(--grey)] p-3 rounded-t-lg" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between w-full items-center">
            <h2 className="text-lg font-semibold text-[var(--gold)] truncate">
              {currentDraw.technique}
            </h2>
            <button
              onClick={closeViewer}
              className="bg-[var(--coffee)]/50 hover:bg-[var(--coffee)]/70 
              text-[var(--highlight)] rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Cerrar visor"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <p className="text-xs text-[var(--highlight)]">{currentDraw.created_at}</p>

          <a
            href={currentDraw.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--gold)] hover:bg-[var(--highlight)] rounded-full text-[var(--brown)] font-medium text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
          </a>

          <div className="w-full h-1 bg-[var(--skin)]/20 rounded-full mt-2">
            <div
              className="h-1 bg-[var(--gold)] rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / draws.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}