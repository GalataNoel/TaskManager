import { Writable } from 'stream';
import * as React from 'react';

declare module 'react-dom/server' {
    interface RenderToReadableStreamOptions {
        identifierPrefix?: string;
        namespaceURI?: string;
        nonce?: string;
        bootstrapScriptContent?: string;
        bootstrapScripts?: string[];
        bootstrapModules?: string[];
        progressiveChunkSize?: number;
        signal?: AbortSignal;
        onError?: (error: unknown) => void;
    }

    export function renderToReadableStream(
        children: React.ReactNode,
        options?: RenderToReadableStreamOptions
    ): Promise<ReadableStream>;

    interface PipeableStream {
        pipe<T extends Writable>(destination: T): T;
        abort(): void;
    }

    export function renderToPipeableStream(
        element: React.ReactNode,
        options?: {
            identifierPrefix?: string;
            namespaceURI?: string;
            nonce?: string;
            bootstrapScriptContent?: string;
            bootstrapScripts?: string[];
            bootstrapModules?: string[];
            progressiveChunkSize?: number;
            signal?: AbortSignal;
            onError?: (error: unknown) => void;
            onShellReady?: () => void;
            onShellError?: (error: unknown) => void;
            onAllReady?: () => void;
        }
    ): PipeableStream;
}