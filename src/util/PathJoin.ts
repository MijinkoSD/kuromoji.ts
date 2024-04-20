export const pathJoin = (pathes: string[]) => {
  let result: string = "";
  for (const path of pathes) {
    if (path.startsWith("/") || result.endsWith("/") || result == "") {
      result += path;
    } else {
      result += "/" + path;
    }
  }
  return result;
};
