import DictionaryLoader from "./DictionaryLoader.js";
/**
 * @callback NodeDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */
export type NodeDictionaryLoaderOnLoad = (err: Error | null, buffer?: ArrayBufferLike | null) => void;
declare class NodeDictionaryLoader extends DictionaryLoader {
    /**
     * NodeDictionaryLoader inherits DictionaryLoader
     * @param {string} dic_path Dictionary path
     * @constructor
     */
    constructor(dic_path: string);
    /**
     * Utility function
     * @param {string} file Dictionary file path
     * @param {NodeDictionaryLoader~onLoad} callback Callback function
     */
    loadArrayBuffer(file: string, callback: NodeDictionaryLoaderOnLoad): Promise<void>;
}
export default NodeDictionaryLoader;
