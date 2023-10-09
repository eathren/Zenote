import { GraphNode } from "src/types";

export const findNodeId = (nodes: GraphNode[], name: string): string | null => {
  const node = nodes.find((node) => node.name === name);
  return node ? node.id : null;
};
/**
 * Check if a node name is unique within a specific graph.
 *
 * @param nodes - Array of existing GraphNodes in the graph.
 * @param newName - The new name to check for uniqueness.
 * @returns A boolean value indicating whether the new name is unique.
 */
export const isNodeNameUnique = (
  nodes: GraphNode[],
  newName: string,
): boolean => {
  return !nodes.some((node) => node.name === newName);
};

/**
 * Generate a unique node name based on a proposed name.
 * This function appends a number to the name to make it unique.
 *
 * @param nodes - Array of existing GraphNodes in the graph.
 * @param baseName - The base name for the new node.
 * @returns A unique node name.
 */
export const generateUniqueNodeName = (
  nodes: GraphNode[],
  baseName: string,
): string => {
  let uniqueName = baseName;
  let counter = 1;

  while (!isNodeNameUnique(nodes, uniqueName)) {
    uniqueName = `${baseName}-${counter}`;
    counter++;
  }

  return uniqueName;
};
