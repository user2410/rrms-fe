export function ToMillion(number: number, toFixed: number = 0) : string {
  return `${(number / 1000000).toFixed(toFixed)} triệu`;
}

export function readMoneyVi(money: number): string {
  return money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
