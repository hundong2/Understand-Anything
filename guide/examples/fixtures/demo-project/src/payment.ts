import { approve } from "./gateway.ts";

// 의존성 방향: payment → gateway. 실제 결제 처리 기능은 아니다.
export function pay(amount: number): string {
  return approve(amount) ? "approved" : "rejected";
}
