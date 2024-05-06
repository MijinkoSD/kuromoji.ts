import { ViterbiNodeType } from "../viterbi/ViterbiNode.js";
export interface IpadicFormatterToken {
    word_id: number;
    word_type: ViterbiNodeType;
    word_position: number;
    surface_form: string | Uint8Array;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading?: string;
    pronunciation?: string;
}
declare class IpadicFormatter {
    /**
     * Mappings between IPADIC dictionary features and tokenized results
     * @constructor
     */
    constructor();
    formatEntry(word_id: number, position: number, type: ViterbiNodeType, features: string[]): IpadicFormatterToken;
    formatUnknownEntry(word_id: number, position: number, type: ViterbiNodeType, features: string[], surface_form: string | Uint8Array): IpadicFormatterToken;
}
export default IpadicFormatter;
