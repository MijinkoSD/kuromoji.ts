import { TokenizerBuilderOption } from "./TokenizerBuilder.js";
import TokenizerBuilder from "./TokenizerBuilder.js";
import DictionaryBuilder from "./dict/builder/DictionaryBuilder.js";
declare const kuromoji: {
    builder: (option?: TokenizerBuilderOption) => TokenizerBuilder;
    dictionaryBuilder: () => DictionaryBuilder;
};
export default kuromoji;
