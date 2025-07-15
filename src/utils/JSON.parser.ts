export function ArrayParser(data?: any) {
  return JSON.parse(JSON.stringify(data || []));
}
export function ObjectParser(data?: any) {
  return JSON.parse(JSON.stringify(data || {}));
}
