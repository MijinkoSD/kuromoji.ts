import TokenInfoDictionary from "./TokenInfoDictionary.js";
import ConnectionCosts from "./ConnectionCosts.js";
import UnknownDictionary from "./UnknownDictionary.js";
import type DoubleArray from "doublearray.ts/dist/doubleArrayClass.js";
import { ArrayBuffer } from "doublearray.ts/dist/types.js";
declare class DynamicDictionaries {
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    connection_costs: ConnectionCosts;
    unknown_dictionary: UnknownDictionary;
    /**
     * Dictionaries container for Tokenizer
     * @param {DoubleArray} trie
     * @param {TokenInfoDictionary} token_info_dictionary
     * @param {ConnectionCosts} connection_costs
     * @param {UnknownDictionary} unknown_dictionary
     * @constructor
     */
    constructor(trie?: DoubleArray | null, token_info_dictionary?: TokenInfoDictionary | null, connection_costs?: ConnectionCosts | null, unknown_dictionary?: UnknownDictionary | null);
    loadTrie(base_buffer: ArrayBuffer, check_buffer: ArrayBuffer): this;
    loadTokenInfoDictionaries(token_info_buffer: Uint8Array, pos_buffer: Uint8Array, target_map_buffer: Uint8Array): this;
    loadConnectionCosts(cc_buffer: Int16Array): this;
    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): this;
}
export default DynamicDictionaries;
