/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import ViterbiBuilder from "./viterbi/ViterbiBuilder.js";
import ViterbiSearcher from "./viterbi/ViterbiSearcher.js";
import IpadicFormatter from "./util/IpadicFormatter.js";
/**
 * 読点と句読点。
 */
const PUNCTUATION = /、|。/;
class Tokenizer {
    /**
     * Tokenizer
     * @param {DynamicDictionaries} dic Dictionaries used by this tokenizer
     * @constructor
     */
    constructor(dic) {
        Object.defineProperty(this, "token_info_dictionary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "unknown_dictionary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viterbi_builder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viterbi_searcher", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "formatter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.token_info_dictionary = dic.token_info_dictionary;
        this.unknown_dictionary = dic.unknown_dictionary;
        this.viterbi_builder = new ViterbiBuilder(dic);
        this.viterbi_searcher = new ViterbiSearcher(dic.connection_costs);
        this.formatter = new IpadicFormatter(); // TODO Other dictionaries
    }
    /**
     * Split into sentence by punctuation
     * @param {string} input Input text
     * @returns {Array.<string>} Sentences end with punctuation
     */
    static splitByPunctuation(input) {
        const sentences = [];
        let tail = input;
        while (true) {
            if (tail === "") {
                break;
            }
            const index = tail.search(PUNCTUATION);
            if (index < 0) {
                sentences.push(tail);
                break;
            }
            sentences.push(tail.substring(0, index + 1));
            tail = tail.substring(index + 1);
        }
        return sentences;
    }
    /**
     * Tokenize text
     * @param {string} text Input text to analyze
     * @returns {Array} Tokens
     */
    tokenize(text) {
        const sentences = Tokenizer.splitByPunctuation(text);
        const tokens = [];
        for (const sentence of sentences) {
            tokens.push(...this.tokenizeForSentence(sentence, tokens));
        }
        return tokens;
    }
    tokenizeForSentence(sentence, tokens) {
        if (tokens === undefined) {
            tokens = [];
        }
        const lattice = this.getLattice(sentence);
        const best_path = this.viterbi_searcher.search(lattice);
        let last_pos = 0;
        if (tokens.length > 0) {
            last_pos = tokens[tokens.length - 1].word_position;
        }
        const result = [];
        for (const node of best_path) {
            let token, features, features_line;
            if (node.type === "KNOWN") {
                features_line = this.token_info_dictionary.getFeatures(node.name.toString());
                if (features_line == null) {
                    features = [];
                }
                else {
                    features = features_line.split(",");
                }
                token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, features);
            }
            else if (node.type === "UNKNOWN") {
                // Unknown word
                features_line = this.unknown_dictionary.getFeatures(node.name.toString());
                if (features_line == null) {
                    features = [];
                }
                else {
                    features = features_line.split(",");
                }
                token = this.formatter.formatUnknownEntry(node.name, last_pos + node.start_pos, node.type, features, node.surface_form);
            }
            else {
                // TODO User dictionary
                token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, []);
            }
            result.push(token);
        }
        return result;
    }
    /**
     * Build word lattice
     * @param {string} text Input text to analyze
     * @returns {ViterbiLattice} Word lattice
     */
    getLattice(text) {
        return this.viterbi_builder.build(text);
    }
}
export default Tokenizer;
//# sourceMappingURL=Tokenizer.js.map