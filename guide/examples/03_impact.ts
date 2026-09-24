/**
 * 목표: imports/depends_on/calls 관계만 사용해 변경의 역의존성 후보를 구한다.
 * 실행: node guide/examples/03_impact.ts
 * 이 BFS는 학습용이며 제품의 understand-diff 전체 구현을 재현하지 않는다.
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGraph } from "../../understand-anything-plugin/packages/core/dist/persistence/index.js";
import type { KnowledgeGraph } from "../../understand-anything-plugin/packages/core/dist/types.js";

function impactedBy(graph: KnowledgeGraph, changed: string): string[] {
  const ids = new Set(graph.nodes.map((node) => node.id));
  if (!ids.has(changed)) throw new Error("알 수 없는 변경 노드: " + changed);
  const allowed = new Set(["imports", "depends_on", "calls"]);
  const reverse = new Map<string, string[]>();
  for (const edge of graph.edges) {
    // 본 실습은 forward 의존성만 해석한다. backward/bidirectional은 추가 설계가 필요하다.
    if (!allowed.has(edge.type) || edge.direction !== "forward") continue;
    const users = reverse.get(edge.target) ?? [];
    users.push(edge.source);
    reverse.set(edge.target, users);
  }
  const visited = new Set([changed]);
  const queue = [changed];
  // shift 대신 인덱스를 쓰면 매 반복 배열 이동을 피한다. 방문 집합은 순환을 막는다.
  for (let index = 0; index < queue.length; index++) {
    for (const user of reverse.get(queue[index]) ?? []) {
      if (visited.has(user)) continue;
      visited.add(user);
      queue.push(user);
    }
  }
  return queue.slice(1);
}

const graph = loadGraph(fileURLToPath(new URL("./fixtures/demo-project/", import.meta.url)));
assert.ok(graph);
assert.deepEqual(impactedBy(graph, "gateway"), ["payment", "checkout"]);
assert.deepEqual(impactedBy(graph, "checkout"), []);
assert.throws(() => impactedBy(graph, "missing"), /알 수 없는/);

// 의도적으로 순환을 추가해도 무한 반복하지 않고 각 노드가 한 번만 등장해야 한다.
const cyclic = structuredClone(graph);
cyclic.edges.push({ source: "gateway", target: "checkout", type: "imports", direction: "forward", weight: 1 });
assert.deepEqual(impactedBy(cyclic, "gateway"), ["payment", "checkout"]);
console.log("gateway 변경의 조사 후보: payment → checkout");
console.log("순환·잘못된 시작점 검사 통과. 실제 장애 여부는 별도 테스트로 확인합니다.");
