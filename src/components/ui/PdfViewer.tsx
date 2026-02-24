"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure the worker correctly for Next.js - Use UNPKG for immediate availability.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ url, rotation = 0 }: { url: string; rotation?: number }) {
    const [numPages, setNumPages] = useState<number>();
    const [containerWidth, setContainerWidth] = useState<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setContainerWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className="w-full h-full bg-gray-200 overflow-y-auto overflow-x-hidden flex flex-col items-center py-8 rounded-xl shadow-inner border border-gray-300 relative" ref={containerRef}>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center flex-col gap-6 w-full items-center">
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_wrapper_${index}`} className="bg-white shadow-xl rounded-md overflow-hidden"
                        style={{
                            // Simple scaling to pad 32px roughly
                            width: containerWidth ? (containerWidth - 64) : undefined,
                            maxWidth: 1200
                        }}>
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            rotate={rotation}
                            width={containerWidth ? (containerWidth - 64) : undefined}
                            className="flex justify-center"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
            {!numPages && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <span className="text-gray-500 font-medium">กำลังโหลดเอกสาร...</span>
                </div>
            )}
        </div>
    );
}
