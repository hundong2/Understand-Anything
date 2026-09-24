// 실제 네트워크 요청이 없는 학습용 승인 판정이다.
export function approve(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0 && amount <= 100;
}
