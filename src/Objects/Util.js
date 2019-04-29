export const defaultFont = (size = 18) => ({
  fontFamily: 'future',
  fontSize: `${Math.floor(size)}px`,
  fill: '#ffffff',
  align: 'center',
});

export function resolve(obj = self, path, separator = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export function deepSet(obj = self, path, value) {
  let schema = obj; // a moving reference to internal objects within obj
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
}
