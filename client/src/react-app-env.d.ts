/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly REACT_APP_API_URL: string;
        readonly REACT_APP_NAME: string;
        readonly REACT_APP_VERSION: string;
    }
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;

    const src: string;
    export default src;
}

declare module '*.jpg' {
    const path: string;
    export default path;
}

declare module '*.jpeg' {
    const path: string;
    export default path;
}

declare module '*.png' {
    const path: string;
    export default path;
}

declare module '*.gif' {
    const path: string;
    export default path;
}

declare module '*.webp' {
    const path: string;
// react-app-env.d.ts
/// <reference types="react-scripts" />

    declare namespace React {
        interface JSX {
            // Add any custom JSX types here if needed
        }
    }

// If the error persists, add this:
    declare module 'react/jsx-runtime' {
        const jsxRuntime: any;
        export = jsxRuntime;
    }
}