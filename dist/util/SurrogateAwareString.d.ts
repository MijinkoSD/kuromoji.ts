declare class SurrogateAwareString {
    str: string;
    index_mapping: number[];
    length: number;
    /**
     * String wrapper for UTF-16 surrogate pair (4 bytes)
     * @param {string} str String to wrap
     * @constructor
     */
    constructor(str: string);
    slice(index: number): string;
    charAt(index: number): string;
    charCodeAt(index: number): number;
    toString(): string;
    static isSurrogatePair(ch: string): boolean;
}
export default SurrogateAwareString;
