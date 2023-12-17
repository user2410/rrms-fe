export function ToMillion(number: number) : string {
  return `${(number / 1000000).toFixed(2)} triệu`;
}
