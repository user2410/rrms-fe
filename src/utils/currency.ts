export function ToMillion(number: number, toFixed: number = 0) : string {
  return `${(number / 1000000).toFixed(toFixed)} triệu`;
}
