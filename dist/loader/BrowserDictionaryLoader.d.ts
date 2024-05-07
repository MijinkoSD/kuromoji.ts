import DictionaryLoader from "./DictionaryLoader.js";
/**
 * Callback
 * @callback BrowserDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */
export type BrowserDictionaryLoaderOnLoad = (err: string | ProgressEvent<EventTarget> | null, buffer: ArrayBufferLike | null) => void;
declare class BrowserDictionaryLoader extends DictionaryLoader {
    /**
     * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
     * @param {string} dic_path Dictionary path
     * @constructor
     */
    constructor(dic_path: string);
    /**
     * Utility function to load gzipped dictionary
     * @param {string} url Dictionary URL
     * @param {BrowserDictionaryLoader~onLoad} callback Callback function
     */
    loadArrayBuffer(url: string, callback: BrowserDictionaryLoaderOnLoad): Promise<void>;
}
export default BrowserDictionaryLoader;
