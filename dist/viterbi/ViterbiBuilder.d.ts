import ViterbiLattice from "./ViterbiLattice.js";
import DynamicDictionaries from "../dict/DynamicDictionaries.js";
import DoubleArray from "doublearray.ts/dist/doubleArrayClass.js";
import TokenInfoDictionary from "../dict/TokenInfoDictionary.js";
import UnknownDictionary from "../dict/UnknownDictionary.js";
declare class ViterbiBuilder {
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    unknown_dictionary: UnknownDictionary;
    /**
     * ViterbiBuilder builds word lattice (ViterbiLattice)
     * @param {DynamicDictionaries} dic dictionary
     * @constructor
     */
    constructor(dic: DynamicDictionaries);
    /**
     * Build word lattice
     * @param {string} sentence_str Input text
     * @returns {ViterbiLattice} Word lattice
     */
    build(sentence_str: string): ViterbiLattice;
}
export default ViterbiBuilder;
