import ViterbiBuilder from "./viterbi/ViterbiBuilder.js";
import ViterbiSearcher from "./viterbi/ViterbiSearcher.js";
import IpadicFormatter from "./util/IpadicFormatter.js";
import { IpadicFormatterToken } from "./util/IpadicFormatter.js";
import DynamicDictionaries from "./dict/DynamicDictionaries.js";
import ViterbiLattice from "./viterbi/ViterbiLattice.js";
declare class Tokenizer {
    token_info_dictionary: import("./dict/TokenInfoDictionary.js").default;
    unknown_dictionary: import("./dict/UnknownDictionary.js").default;
    viterbi_builder: ViterbiBuilder;
    viterbi_searcher: ViterbiSearcher;
    formatter: IpadicFormatter;
    /**
     * Tokenizer
     * @param {DynamicDictionaries} dic Dictionaries used by this tokenizer
     * @constructor
     */
    constructor(dic: DynamicDictionaries);
    /**
     * Split into sentence by punctuation
     * @param {string} input Input text
     * @returns {Array.<string>} Sentences end with punctuation
     */
    static splitByPunctuation(input: string): string[];
    /**
     * Tokenize text
     * @param {string} text Input text to analyze
     * @returns {Array} Tokens
     */
    tokenize(text: string): IpadicFormatterToken[];
    tokenizeForSentence(sentence: string, tokens?: IpadicFormatterToken[]): IpadicFormatterToken[];
    /**
     * Build word lattice
     * @param {string} text Input text to analyze
     * @returns {ViterbiLattice} Word lattice
     */
    getLattice(text: string): ViterbiLattice;
}
export default Tokenizer;
