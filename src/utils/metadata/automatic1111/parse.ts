import * as ohm from "ohm-js";
import { resourceDir, documentDir, sep } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import constructEmptyImageMetadata from "../constructEmptyImageMetadata";
import {
  addTagToWeightMap,
  combineNodesToWeightMap,
  multiplyTagWeightInWeightMap,
} from "../../weightMap";

const resourceDirPath = await resourceDir();
const documentDirPath = await documentDir();

const parseAutomatic1111Metadata = async (
  rawImageMetadata: string
): Promise<SDMetadata | null> => {
  console.debug("Parsing as Automatic1111");

  // https://nextjournal.com/dubroy/ohm-parsing-made-easy

  // Rely on developer create a symlink in $DOCUMENT during dev mode
  const grammarTextUrl = import.meta.env.DEV
    ? `${documentDirPath}stupid${sep}automatic1111.ohm`
    : `${resourceDirPath}automatic1111${sep}automatic1111.ohm`;
  console.debug("GrammarTextUrl", grammarTextUrl);

  const grammarText = await readTextFile(grammarTextUrl);

  const grammar = ohm.grammar(grammarText);
  // TODO: use matcher to incrementally match
  const match = grammar.match(rawImageMetadata);
  if (match.failed()) {
    console.warn("Failed to match automatic1111 metadata");
    return null;
  }

  let metadata: SDMetadata = constructEmptyImageMetadata();

  let modelData: {
    name?: string;
    hash?: string;
    version?: string;
  } = {};
  let loraMapData: Map<string, number> = new Map();
  let negativeLoraMapData: Map<string, number> = new Map();

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
      console.debug(`Model param - ${key.sourceString}:${value.sourceString}`);
      switch (key.sourceString) {
        case "Steps":
          metadata.steps = Number(value.sourceString);
          return;
        case "Sampler":
          metadata.sampler = { name: value.sourceString };
          return;
        case "CFG scale":
          metadata.cfgScale = Number(value.sourceString);
          return;
        case "Seed":
          metadata.seed = Number(value.sourceString);
          return;
        case "Size":
          return;
        case "Model hash":
          modelData.hash = value.sourceString;
          return;
        case "Model":
          modelData.name = value.sourceString;
          return;
        case "Denoising strength":
          metadata.denoisingStrength = Number(value.sourceString);
          return;
        case "Clip skip":
          metadata.clipSkip = Number(value.sourceString);
          return;
        case "Hires resize":
          return;
        case "Hires steps":
          metadata.highResSteps = Number(value.sourceString);
          return;
        case "Hires upscaler":
          metadata.highResUpscaler = value.sourceString;
          return;
        default:
          console.warn("Unknown model param", key.sourceString);
      }
    },
    NegativePrompt(_prefix, tagList) {
      const map = tagList.constructMetadata();
      metadata.negativePromptMap = map;
    },
    Prompt(tagList) {
      const map = tagList.constructMetadata();
      metadata.promptMap = map;
    },
    TagList(tagList) {
      return tagList.constructMetadata();
    },
    EmphasizedTag_round(_lbracket, prompt, _rbracket) {
      const map = prompt.constructMetadata();
      // Cater for empty prompt
      if (!map) {
        return;
      }
      console.debug(`Tag ${prompt.sourceString} with weight=1.1`);
      multiplyTagWeightInWeightMap(prompt.sourceString, 1.1, map);
      return map;
    },
    EmphasizedTag_roundWithColon(_lbracket, prompt, _colon, number, _rbracket) {
      const map = prompt.constructMetadata();
      // Cater for empty prompt
      if (!map) {
        return;
      }
      console.debug(
        `Tag ${prompt.sourceString} with weight=${number.sourceString}`
      );
      multiplyTagWeightInWeightMap(
        prompt.sourceString,
        Number(number.sourceString),
        map
      );
      return map;
    },
    EmphasizedTag_square(_lbracket, prompt, _rbracket) {
      const map = prompt.constructMetadata();
      // Cater for empty prompt (no actual tags)
      if (!map) {
        return;
      }
      console.debug(`Tag ${prompt.sourceString} with weight=0.91`);
      multiplyTagWeightInWeightMap(prompt.sourceString, 0.91, map);
      return map;
    },
    ScheduledTag(_lbracket, from, _colon, to, _colon2, number, _rbracket) {
      // TODO
      console.debug(
        `Set schedule [${from.sourceString}:${to.sourceString}:${number.sourceString}]`
      );
    },
    loraTag(_lbracket, _lora, _colon, identifier, _colon2, number, _rbracket) {
      // For Lora we can directly assign to loraMap because Lora tags
      // doesn't support nested structure
      console.debug(
        `Lora ${identifier.sourceString} with weight ${number.sourceString}`
      );
      addTagToWeightMap(
        identifier.sourceString,
        Number(number.sourceString),
        // TODO: fix negative lora map
        loraMapData
      );
    },
    tag(_wordList) {
      // We construct new Map object when we parse a tag,
      // because tag is the fundamental unit of prompt
      console.debug(`Tag ${this.sourceString}`);
      const map = new Map();
      addTagToWeightMap(this.sourceString, 1, map);
      return map;
    },
    NonemptyListOf(arg0, arg1, arg2) {
      // Best if we can scope these generic actions to a particular rule
      return combineNodesToWeightMap([arg0, arg1, arg2]);
    },
    nonemptyListOf(arg0, arg1, arg2) {
      return combineNodesToWeightMap([arg0, arg1, arg2]);
    },
    _iter(...children) {
      return combineNodesToWeightMap(children);
    },
    _terminal() {},
  });

  // "A semantic adapter is an interface to a particular parse tree node"
  const adapter = semantics(match);
  adapter.constructMetadata();

  metadata = {
    ...metadata,
    model: !!modelData.name ? { ...modelData, name: modelData.name } : null,
    loraMap: new Map(
      [...loraMapData].map(([name, weight]) => [{ name }, weight])
    ),
    negativeLoraMap: new Map(
      [...negativeLoraMapData].map(([name, weight]) => [{ name }, weight])
    ),
  };

  return metadata;
};

export default parseAutomatic1111Metadata;
