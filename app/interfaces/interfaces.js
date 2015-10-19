/* @flow */

type ApplicationState = {
    clicks: number
}

type InitialState = {
    clicks: number
}

type Checksums = {
    cssChecksum: string,
    bundleJsChecksum: string,
}

type Page = {
    initialState: InitialState,
    pagePath: string,
    pageTitle: string,
    renderPage: (x: ApplicationState) => ReactElement,
    applicationStateProperty: (x: InitialState) => any
}

declare module 'react-dom' {
    declare function render(x: ReactElement, y: any): void;
}

declare module baconjs {
    declare class Observable {
        doLog(x: string): Property;
    }
    declare class Property extends Observable {
    }
    declare class Bus extends Observable {
        push(x: any): void;
    }
    declare function update(x: any): Property;
}
