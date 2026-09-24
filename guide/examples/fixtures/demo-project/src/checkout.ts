import { pay } from "./payment.ts";

// 사용자가 보는 진입점에서 결제 서비스로 위임하는 가장 작은 예다.
export function checkout(amount: number): string {
  return pay(amount);
}
