export interface AgFnProps{
    disabled: boolean | undefined;
    _input: any;
    value: any;
    script: HTMLScriptElement | undefined;
    aggregator: ((input: any) => any) | undefined;
    isC: boolean;
    debug: boolean;
    hostSelector: string;
}

export interface AgFnActions{
    getScript(self: this): void;
    attachScript(self: this): void;
    updateValue(self: this): void;
}