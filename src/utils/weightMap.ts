import * as ohm from "ohm-js";

export const addTagToWeightMap = (
  tag: string,
  weight: number,
  weightMap: PromptMap
) => {
  weightMap.set(tag, (weightMap.get(tag) ?? 0) + weight);
};

/**
 * If tag doesn't already exists in weightMap, set weight to 1
 */
export const multiplyTagWeightInWeightMap = (
  tag: string,
  weightFactor: number,
  weightMap: PromptMap
) => {
  weightMap.set(tag, (weightMap.get(tag) ?? 1) * weightFactor);
};

export const combineNodesToWeightMap = (children: ohm.Node[]) => {
  return children
    .map((child) => child.constructMetadata())
    .reduce((acc, current, _index) => {
      if (current instanceof Map) {
        for (const [key, val] of current) {
          addTagToWeightMap(key, val, acc);
        }
      }
      return acc;
    }, new Map());
};
