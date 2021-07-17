export interface AgFnProps{
    disabled: boolean | undefined;
    _input: any;
    value: any;
    script: HTMLScriptElement | undefined;
    aggregator: ((input: any) => any) | undefined;
}