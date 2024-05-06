import TokenInfoDictionary from "./TokenInfoDictionary.js";
import CharacterDefinition from "./CharacterDefinition.js";
import ByteBuffer from "../util/ByteBuffer.js";
declare class UnknownDictionary extends TokenInfoDictionary {
    dictionary: ByteBuffer;
    target_map: {
        [key: string]: number[];
    };
    pos_buffer: ByteBuffer;
    character_definition: CharacterDefinition | null;
    /**
     * UnknownDictionary
     * @constructor
     */
    constructor();
    characterDefinition(character_definition: CharacterDefinition): this;
    lookup(ch: string): import("./CharacterClass.js").default | undefined;
    lookupCompatibleCategory(ch: string): import("./CharacterClass.js").default[] | undefined;
    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): void;
}
export default UnknownDictionary;
