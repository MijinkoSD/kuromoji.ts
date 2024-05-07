import InvokeDefinitionMap from "./InvokeDefinitionMap.js";
import CharacterClass from "./CharacterClass.js";
declare class CharacterDefinition {
    character_category_map: Uint8Array;
    compatible_category_map: Uint32Array;
    invoke_definition_map: null | InvokeDefinitionMap;
    /**
     * CharacterDefinition represents char.def file and
     * defines behavior of unknown word processing
     * @constructor
     */
    constructor();
    /**
     * Load CharacterDefinition
     * @param {Uint8Array} cat_map_buffer
     * @param {Uint32Array} compat_cat_map_buffer
     * @param {InvokeDefinitionMap} invoke_def_buffer
     * @returns {CharacterDefinition}
     */
    static load(cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): CharacterDefinition;
    static parseCharCategory(class_id: number, parsed_category_def: string[]): CharacterClass | null;
    static parseCategoryMapping(parsed_category_mapping: string[]): Omit<CategoryMapping, "end">;
    static parseRangeCategoryMapping(parsed_category_mapping: string[]): CategoryMapping;
    /**
     * Initializing method
     * @param {Array} category_mapping Array of category mapping
     */
    initCategoryMappings(category_mapping?: CategoryMapping[]): void;
    /**
     * Lookup compatible categories for a character (not included 1st category)
     * @param {string} ch UCS2 character (just 1st character is effective)
     * @returns {Array.<CharacterClass>} character classes
     */
    lookupCompatibleCategory(ch: string): CharacterClass[];
    /**
     * Lookup category for a character
     * @param {string} ch UCS2 character (just 1st character is effective)
     * @returns {CharacterClass} character class
     */
    lookup(ch: string): CharacterClass | undefined;
}
export default CharacterDefinition;
