import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { countWords, flattenTerms, pickRandomUnused } from "./selection.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const termsData = JSON.parse(readFileSync(resolve(root, "public/terms.json"), "utf8"));

describe("countWords", () => {
  it("counts whitespace-separated words and drops empty tokens", () => {
    expect(countWords("אין עשן בלי אש")).toBe(4);
    expect(countWords("  שלום   עולם  ")).toBe(2);
    expect(countWords("אושפיזין")).toBe(1);
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});

describe("pickRandomUnused", () => {
  const terms = flattenTerms(termsData);

  it("loads five categories of thirty unique Hebrew terms", () => {
    expect(termsData.categories).toHaveLength(5);
    const texts = [];
    for (const category of termsData.categories) {
      expect(category.terms).toHaveLength(30);
      expect(category.name.length).toBeGreaterThan(0);
      expect(category.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      texts.push(...category.terms);
    }
    expect(new Set(texts).size).toBe(150);
    expect(new Set(termsData.categories.map((category) => category.color)).size).toBe(5);
    for (const text of texts) {
      expect(text).toMatch(/[\u0590-\u05FF]/);
    }
  });

  it("selects only unused terms and never repeats until the pool is empty", () => {
    const used = new Set();
    const seen = [];
    let guard = 0;
    while (guard < 200) {
      const next = pickRandomUnused(terms, used, () => 0.37);
      if (!next) {
        break;
      }
      expect(used.has(next.id)).toBe(false);
      used.add(next.id);
      seen.push(next.id);
      guard += 1;
    }
    expect(seen).toHaveLength(terms.length);
    expect(new Set(seen).size).toBe(terms.length);
    expect(pickRandomUnused(terms, used, () => 0.37)).toBeNull();
  });

  it("uses the supplied random value only among remaining terms", () => {
    const sample = terms.slice(0, 4);
    const used = new Set([sample[0].id, sample[2].id]);
    const picked = pickRandomUnused(sample, used, () => 0);
    expect(picked.id).toBe(sample[1].id);
    const last = pickRandomUnused(sample, used, () => 0.99);
    expect(last.id).toBe(sample[3].id);
  });

  it("stores a word count that ignores extra spaces", () => {
    const flat = flattenTerms({
      categories: [
        {
          id: "demo",
          name: "בדיקה",
          color: "#112233",
          terms: ["  אחת   שתיים  "],
        },
      ],
    });
    expect(flat[0].wordCount).toBe(2);
  });
});
