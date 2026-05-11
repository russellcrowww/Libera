import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getFileUrl } from "../api/clients";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function BookReaderModal({ book, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const fileUrl = getFileUrl(book?.pdf_url);

  const onLoaded = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
    setPageNumber(1);
    setPageInput("1");
  };

  const goToPage = () => {
    const nextPage = Number(pageInput);
    if (!Number.isFinite(nextPage)) return;
    const clamped = Math.min(Math.max(nextPage, 1), numPages || 1);
    setPageNumber(clamped);
    setPageInput(String(clamped));
  };

  const goPrev = () => {
    const next = Math.max(pageNumber - 1, 1);
    setPageNumber(next);
    setPageInput(String(next));
  };

  const goNext = () => {
    const next = Math.min(pageNumber + 1, numPages || 1);
    setPageNumber(next);
    setPageInput(String(next));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal reader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Чтение: {book.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="reader-controls">
          <button className="btn-secondary" onClick={goPrev} disabled={pageNumber <= 1}>
            ← Предыдущая
          </button>
          <div className="reader-page-control">
            <input
              type="number"
              min="1"
              max={numPages || 1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
            <button className="btn-primary" onClick={goToPage}>
              Перейти
            </button>
          </div>
          <button
            className="btn-secondary"
            onClick={goNext}
            disabled={numPages > 0 && pageNumber >= numPages}
          >
            Следующая →
          </button>
          <span className="reader-counter">
            Страница {pageNumber} из {numPages || "…"}
          </span>
        </div>
        <div className="reader-content">
          {fileUrl ? (
            <Document file={fileUrl} onLoadSuccess={onLoaded}>
              <Page pageNumber={pageNumber} width={860} />
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
  );
}
