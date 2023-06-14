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

  // Optional carriage return
  const result = rawImageMetadata.split(/\r?\n/);
  if (result.length !== 3) {
    return null;
  }
  const [prompt, negativePrompt, modelParams] = result;

  return {
    ...(await parseModelParams(modelParams)),
    prompt: prompt,
    negativePrompt: negativePrompt,
    structuredPrompt: await parsePrompt(prompt),
    structuredNegativePrompt: await parseNegativePrompt(negativePrompt),
  };
};

const parsePrompt = async (
  prompt: string
): Promise<StructuredPrompt | null> => {
  console.log("ResourceDirPath", resourceDirPath);

  // https://nextjournal.com/dubroy/ohm-parsing-made-easy

  // Rely on developer create a symlink in $DOCUMENT during dev mode
  const grammarTextUrl = import.meta.env.DEV
    ? `${documentDirPath}stupid${sep}prompt.ohm`
    : `${resourceDirPath}automatic1111${sep}prompt.ohm`;
  console.log("GrammarTextUrl", grammarTextUrl);

  const grammarText = await readTextFile(grammarTextUrl);

  console.log("GrammarText", grammarText);

  const grammar = ohm.grammar(grammarText);
  // TODO: use matcher to incrementally match
  const match = grammar.match(prompt);
  if (match.failed()) {
    console.warn("Failed to match automatic1111 prompt");
    return null;
  }

  const structuredPrompt: StructuredPrompt = new Map();

  const semantics = grammar.createSemantics();
  semantics.addOperation("constructPrompt", {
    Prompt(a, _) {
      a.children[0].children[0].constructPrompt();
      a.children[0].children[1].constructPrompt();
    },
    Emphasized_round(_lbracket, prompt, _rbracket) {
      prompt.constructPrompt();
      console.log(`(${prompt.sourceString})`);
    },
    Emphasized_roundWithColon(_lbracket, prompt, _colon, number, _rbracket) {
      prompt.constructPrompt();
      console.log(`(${prompt.sourceString}:${number.sourceString})`);
    },
    Emphasized_square(_lbracket, prompt, _rbracket) {
      prompt.constructPrompt();
      console.log(`[${prompt.sourceString}]`);
    },
    Scheduled(_lbracket, from, _colon, to, _colon2, number, _rbracket) {
      console.log(
        `[${from.sourceString}:${to.sourceString}:${number.sourceString}]`
      );
    },
    lora(
      _lbracket,
      _l,
      _o,
      _r,
      _a,
      _colon,
      identifier,
      _colon2,
      number,
      _rbracket
    ) {
      console.log("Lora", identifier.sourceString, number.sourceString);
    },
    keyword(identifier, space, identifier2) {
      console.log("Keyword", identifier.sourceString, identifier2.sourceString);
    },
    _iter(...children) {
      return children.map((c) => c.constructPrompt());
    },
    _terminal() {},
  });

  // "A semantic adapter is an interface to a particular parse tree node"
  const adapter = semantics(match);
  adapter.constructPrompt();

  return structuredPrompt;
};

const parseNegativePrompt = async (
  negativePrompt: string
): Promise<StructuredNegativePrompt | null> => {
  const negativePromptPrefix = "Negative prompt: ";
  if (!negativePrompt.startsWith(negativePromptPrefix)) {
    return parsePrompt(negativePrompt.slice(negativePromptPrefix.length));
  }
  return null;
};

const parseModelParams = async (modelParams: string): Promise<ModelParams> => {
  return {
    modelName: null,
    modelVersion: null,
    seed: null,
  };
};

export default parseAutomatic1111Metadata;
