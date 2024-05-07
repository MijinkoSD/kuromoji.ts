import DynamicDictionaries from "../dict/DynamicDictionaries.js";
/**
 * Callback
 * @callback DictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {DynamicDictionaries} dic Loaded dictionary
 */
export type DictionaryLoaderOnLoad = (err: Object | null, dic: DynamicDictionaries) => void;
export type LoadArrayBufferCallback = (err: Object | null, buffer?: ArrayBufferLike | null) => void;
declare class DictionaryLoader {
    dic: DynamicDictionaries;
    dic_path: string;
    /**
     * DictionaryLoader base constructor
     * @param {string} dic_path Dictionary path
     * @constructor
     */
    constructor(dic_path: string);
    loadArrayBuffer(file: string, callback: LoadArrayBufferCallback): Promise<void>;
    /**
     * Load dictionary files
     * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
     */
    load(load_callback: DictionaryLoaderOnLoad): Promise<void>;
}
export default DictionaryLoader;
