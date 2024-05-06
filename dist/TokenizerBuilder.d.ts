import Tokenizer from "./Tokenizer.js";
export interface TokenizerBuilderOption {
    dicPath?: string;
}
/**
 * Callback used by build
 * @callback TokenizerBuilder~onLoad
 * @param {Object} err Error object
 * @param {Tokenizer} tokenizer Prepared Tokenizer
 */
export type TokenizerBuilderOnLoad = (err: (Error | null)[], tokenizer?: Tokenizer) => void;
declare class TokenizerBuilder {
    dic_path: string;
    /**
     * TokenizerBuilder create Tokenizer instance.
     * @param {Object} option JSON object which have key-value pairs settings
     * @param {string} option.dicPath Dictionary directory path (or URL using in browser)
     * @constructor
     */
    constructor(option?: TokenizerBuilderOption);
    /**
     * Build Tokenizer instance by asynchronous manner
     * @param {TokenizerBuilder~onLoad} callback Callback function
     */
    build(callback: TokenizerBuilderOnLoad): Promise<void>;
    buildBrowser(callback: TokenizerBuilderOnLoad): Promise<void>;
}
export default TokenizerBuilder;
