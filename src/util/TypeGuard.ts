export const isNotContainUndefined = <T>(
  ary: (T | undefined)[]
): ary is T[] => {
  for (const a of ary) {
    if (a === undefined) return false;
  }
  return true;
};
