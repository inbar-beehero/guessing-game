export function countWords(text) {
  if (typeof text !== "string") {
    return 0;
  }
  return text.trim().split(/\s+/).filter((token) => token.length > 0).length;
}

export function flattenTerms(data) {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const terms = [];
  categories.forEach((category) => {
    const list = Array.isArray(category?.terms) ? category.terms : [];
    list.forEach((text, index) => {
      terms.push({
        id: `${category.id}:${index}`,
        text,
        categoryId: category.id,
        categoryName: category.name,
        color: category.color,
        wordCount: countWords(text),
      });
    });
  });
  return terms;
}

export function pickRandomUnused(terms, usedIds, random = Math.random) {
  const remaining = terms.filter((term) => !usedIds.has(term.id));
  if (remaining.length === 0) {
    return null;
  }
  const raw = random();
  const index = Math.min(
    remaining.length - 1,
    Math.max(0, Math.floor(raw * remaining.length)),
  );
  return remaining[index];
}

export function toTeamState(term, exhausted) {
  if (!term) {
    return { type: "state", hasTerm: false, exhausted: false };
  }
  return {
    type: "state",
    hasTerm: true,
    categoryName: term.categoryName,
    color: term.color,
    wordCount: term.wordCount,
    exhausted: Boolean(exhausted),
  };
}

export const CHANNEL_NAME = "pantomime-guessing-game";
