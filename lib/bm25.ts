import lunr from 'lunr';


export interface Searchable {
  id: string;
  text: string;
}

export function findBestMatch(
  query: string,
  documents: Searchable[],
): { id: string; score: number } | null {
  if (!query || documents.length === 0) {
    return null;
  }


  const defaultSeparator = lunr.tokenizer.separator;
  lunr.tokenizer.separator = /[\s\-.,!?;:()]+/;

  const idx = lunr(function () {
    this.ref('id');
    this.field('text');

    documents.forEach((doc) => {
      this.add(doc);
    });
  });

  lunr.tokenizer.separator = defaultSeparator;

  const results = idx.search(`${query} ${query}*`);

  if (results.length === 0) {
    return null;
  }

  const bestResult = results[0];

  return {
    id: bestResult.ref,
    score: bestResult.score,
  };
}
