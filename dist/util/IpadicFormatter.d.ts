import { ViterbiNodeType } from "../viterbi/ViterbiNode.js";
export interface IpadicFormatterToken {
    /** 辞書内での単語ID */
    word_id: number;
    /** 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN) */
    word_type: ViterbiNodeType;
    /** 単語の開始位置 */
    word_position: number;
    /** 表層形 */
    surface_form: string | Uint8Array;
    /** 品詞 */
    pos: string;
    /** 品詞細分類1 */
    pos_detail_1: string;
    /** 品詞細分類2 */
    pos_detail_2: string;
    /** 品詞細分類3 */
    pos_detail_3: string;
    /** 活用型 */
    conjugated_type: string;
    /** 活用形 */
    conjugated_form: string;
    /** 基本形 */
    basic_form: string;
    /** 読み */
    reading?: string;
    /** 発音 */
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
