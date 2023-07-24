const wordsToRemove = [
  "do",
  "does",
  "how",
  "many",
  "much",
  "of",
  "the",
  "there",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "would",
  "you",
  "your",
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "for",
  "from",
  "have",
  "if",
  "in",
  "is",
  "it",
  "its",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "were",
  "with",
  "not",
  "no",
  "yes",
];

let count = 0;

/**
 * Sets a camel case variable name for a node
 * using the nodes content but removing common words
 */
export function getVarName(content: string): string {
  const words = content
    // remove any non-word characters
    .replace(/[^a-zA-Z0-9_ ]/g, "")
    // replace any non-word characters with an empty string
    .split(" ")
    .map((word) => word.toLocaleLowerCase());

  const filteredWords = words
    .filter((word) => !wordsToRemove.includes(word))
    // return a maximum of 4 words, choose the 4 last words
    .slice(-4);

  if (!filteredWords.length) return `node${count++}`;

  const finalWords = filteredWords
    // capitalize the first letter of each word except the first
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    );
  const variableName = finalWords.join("").replace(/[\W ]/g, "");
  return variableName;
}
