import * as ohm from "ohm-js";
import { resourceDir, documentDir, sep } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const resourceDirPath = await resourceDir();
const documentDirPath = await documentDir();

const parseAutomatic1111Metadata = async (
  rawImageMetadata: string
): Promise<SDMetadata | null> => {
  console.log("Parsing as Automatic1111");

  // https://nextjournal.com/dubroy/ohm-parsing-made-easy

  // Rely on developer create a symlink in $DOCUMENT during dev mode
  const grammarTextUrl = import.meta.env.DEV
    ? `${documentDirPath}stupid${sep}automatic1111.ohm`
    : `${resourceDirPath}automatic1111${sep}automatic1111.ohm`;
  console.log("GrammarTextUrl", grammarTextUrl);

  const grammarText = await readTextFile(grammarTextUrl);

  const grammar = ohm.grammar(grammarText);
  // TODO: use matcher to incrementally match
  const match = grammar.match(rawImageMetadata);
  if (match.failed()) {
    console.warn("Failed to match automatic1111 metadata");
    return null;
  }

  const metadata: SDMetadata = {
    modelName: null,
    modelVersion: null,
    seed: null,
    prompt: null,
    negativePrompt: null,
    structuredPrompt: new Map(),
    structuredNegativePrompt: new Map(),
  };

  const semantics = grammar.createSemantics();
  semantics.addOperation("constructMetadata", {
    Metadata(prompt, _newline, negativePrompt, _newline2, modelParams) {
      prompt.constructMetadata();
      negativePrompt.constructMetadata();
      modelParams.constructMetadata();
    },
    ModelParams(paramList) {
      paramList.constructMetadata();
    },
    ModelParam(key, _colon, value) {
      console.log(`${key.sourceString}:${value.sourceString}`);
    },
    NegativePrompt(_prefix, prompt) {
      prompt.constructMetadata();
    },
    Prompt(keywordList) {
      keywordList.constructMetadata();
    },
    EmphasizedTag_round(_lbracket, prompt, _rbracket) {
      prompt.constructMetadata();
      console.log(`Tag ${prompt.sourceString} with weight=1.1`);
    },
    EmphasizedTag_roundWithColon(_lbracket, prompt, _colon, number, _rbracket) {
      prompt.constructMetadata();
      console.log(
        `Tag ${prompt.sourceString} with weight=${number.sourceString}`
      );
    },
    EmphasizedTag_square(_lbracket, prompt, _rbracket) {
      prompt.constructMetadata();
      console.log(`Tag ${prompt.sourceString} with weight=0.91`);
    },
    ScheduledTag(_lbracket, from, _colon, to, _colon2, number, _rbracket) {
      console.log(
        `Set schedule [${from.sourceString}:${to.sourceString}:${number.sourceString}]`
      );
    },
    loraTag(_lbracket, _lora, _colon, identifier, _colon2, number, _rbracket) {
      console.log(
        `Lora ${identifier.sourceString} with weight ${number.sourceString}`
      );
    },
    tag(_wordList) {
      console.log(`Tag ${this.sourceString}`);
    },
    NonemptyListOf(arg0, arg1, arg2) {
      arg0.constructMetadata();
      arg1.constructMetadata();
      arg2.constructMetadata();
    },
    nonemptyListOf(arg0, arg1, arg2) {
      arg0.constructMetadata();
      arg1.constructMetadata();
      arg2.constructMetadata();
    },
    _iter(...children) {
      children.map((c) => c.constructMetadata());
    },
    _terminal() {},
  });

  // "A semantic adapter is an interface to a particular parse tree node"
  const adapter = semantics(match);
  adapter.constructMetadata();

  return metadata;
};

export default parseAutomatic1111Metadata;
