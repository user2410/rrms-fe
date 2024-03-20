export function filterEvents<T>(
  arr: Array<T>,
  uniqBy: keyof T,
  keepFn: (a: T, b: T) => number, // keep a if return < 0, keep b if return > 0
) {
  return arr.reduce((acc, current: T) => {
    const xExists = acc.find((item: any) => item[uniqBy] === current[uniqBy]);
    if (!xExists) {
      return acc.concat([current]);
    } else {
      return acc.map((item) =>
        item[uniqBy] === current[uniqBy] ? (
          keepFn(current, item) >= 0 ? item : current
        ) : item,
      );
    }
  }, [] as T[]);
}
