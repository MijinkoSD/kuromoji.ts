import CharacterClass from "../CharacterClass.js";
import CharacterDefinition from "../CharacterDefinition.js";
declare class CharacterDefinitionBuilder {
    char_def: CharacterDefinition;
    character_category_definition: CharacterClass[];
    category_mapping: CategoryMapping[];
    /**
     * CharacterDefinitionBuilder
     * @constructor
     */
    constructor();
    putLine(line: string): void;
    build(): CharacterDefinition;
}
export default CharacterDefinitionBuilder;
