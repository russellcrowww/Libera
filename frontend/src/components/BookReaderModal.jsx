import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getFileUrl } from "../api/clients";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const A4_WIDTH_OVER_HEIGHT = 1 / Math.sqrt(2);

function maxSpreadLeftPage(numPages) {
  if (!numPages || numPages < 1) return 1;
  return numPages % 2 === 0 ? numPages - 1 : numPages;
}

export default function BookReaderModal({ book, onClose }) {
  const contentRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [spreadMode, setSpreadMode] = useState(true);
  const [pageWidth, setPageWidth] = useState(360);

  const fileUrl = getFileUrl(book?.pdf_url);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const pad = 20;
    const gap = spreadMode ? 14 : 0;
    const w = el.clientWidth - pad;
    const h = el.clientHeight - pad;
    const slots = spreadMode ? 2 : 1;
    const perSlot = (w - gap) / slots;
    const byHeight = h * A4_WIDTH_OVER_HEIGHT;
    const next = Math.max(140, Math.floor(Math.min(perSlot, byHeight)));
    setPageWidth(next);
  }, [spreadMode]);

  useLayoutEffect(() => {
    measure();
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, numPages, spreadMode]);

  const onLoaded = ({ numPages: total }) => {
    setNumPages(total);
    setPage(1);
    setPageInput("1");
  };

  const spreadLeft = spreadMode ? (page % 2 === 1 ? page : Math.max(1, page - 1)) : page;

  const goToPage = () => {
    const target = Number(pageInput);
    if (!Number.isFinite(target)) return;
    const clamped = Math.min(Math.max(Math.floor(target), 1), numPages || 1);
    if (spreadMode) {
      const left = clamped % 2 === 1 ? clamped : Math.max(1, clamped - 1);
      const maxLeft = maxSpreadLeftPage(numPages);
      setPage(Math.min(left, maxLeft));
      setPageInput(String(clamped));
    } else {
      setPage(clamped);
      setPageInput(String(clamped));
    }
  };

  const goPrev = () => {
    if (spreadMode) {
      const left = spreadLeft;
      const nextLeft = Math.max(1, left - 2);
      setPage(nextLeft);
      setPageInput(String(nextLeft));
    } else {
      const next = Math.max(1, page - 1);
      setPage(next);
      setPageInput(String(next));
    }
  };

  const goNext = () => {
    if (spreadMode) {
      const left = spreadLeft;
      const maxLeft = maxSpreadLeftPage(numPages);
      const nextLeft = Math.min(maxLeft, left + 2);
      setPage(nextLeft);
      setPageInput(String(nextLeft));
    } else {
      const next = Math.min(page + 1, numPages || 1);
      setPage(next);
      setPageInput(String(next));
    }
  };

  const handleSpreadChange = (e) => {
    const next = e.target.checked;
    if (next) {
      setPage((p) => {
        const left = p % 2 === 1 ? p : Math.max(1, p - 1);
        const maxLeft = maxSpreadLeftPage(numPages);
        return Math.min(left, maxLeft || 1);
      });
    }
    setSpreadMode(next);
  };

  const canGoPrev = spreadMode ? spreadLeft > 1 : page > 1;
  const canGoNext = spreadMode
    ? spreadLeft < maxSpreadLeftPage(numPages)
    : numPages > 0 && page < numPages;

  const counterLabel = spreadMode
    ? numPages > 0
      ? `Разворот: ${spreadLeft}-${Math.min(spreadLeft + 1, numPages)} · всего ${numPages} стр.`
      : "…"
    : numPages > 0
      ? `Страница ${page} из ${numPages}`
      : "…";

  return (
    <div className="modal-overlay reader-overlay" onClick={onClose}>
      <div
        className="modal reader-modal reader-modal--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header reader-modal-header">
          <h3>{book.name}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="reader-toolbar">
          <button type="button" className="btn-secondary" onClick={goPrev} disabled={!canGoPrev}>
            {spreadMode ? "← Предыдущий разворот" : "← Предыдущая"}
          </button>
          <div className="reader-page-control">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
            <button type="button" className="btn-primary" onClick={goToPage}>
              Перейти
            </button>
          </div>
          <button type="button" className="btn-secondary" onClick={goNext} disabled={!canGoNext}>
            {spreadMode ? "Следующий разворот →" : "Следующая →"}
          </button>
          <label className="reader-toggle">
            <input type="checkbox" checked={spreadMode} onChange={handleSpreadChange} />
            <span>Разворот (2 страницы)</span>
          </label>
          <span className="reader-counter">{counterLabel}</span>
        </div>
        <div className="reader-body">
          <div ref={contentRef} className="reader-content reader-content--fit">
            {fileUrl ? (
              <Document file={fileUrl} onLoadSuccess={onLoaded}>
                {spreadMode ? (
                  <div className="reader-spread">
                    <div className="reader-page-sheet">
                      <Page
                        key={`p-${spreadLeft}`}
                        pageNumber={spreadLeft}
                        width={pageWidth}
                        renderTextLayer
                        renderAnnotationLayer
                      />
                    </div>
                    {spreadLeft + 1 <= numPages && (
                      <div className="reader-page-sheet">
                        <Page
                          key={`p-${spreadLeft + 1}`}
                          pageNumber={spreadLeft + 1}
                          width={pageWidth}
                          renderTextLayer
                          renderAnnotationLayer
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="reader-single">
                    <Page
                      pageNumber={page}
                      width={pageWidth}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </div>
                )}
              </Document>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>PDF файл для этой книги не загружен.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
