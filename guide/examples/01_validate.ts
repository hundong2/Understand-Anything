/**
 * 목표: 공식 persistence/schema API로 학습 그래프를 읽고 정제 결과를 검사한다.
 * 실행(저장소 루트): node guide/examples/01_validate.ts
 * 코어를 먼저 빌드한다. API 호출과 디스크 쓰기는 없다.
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGraph } from "../../understand-anything-plugin/packages/core/dist/persistence/index.js";
import { validateGraph } from "../../understand-anything-plugin/packages/core/dist/schema.js";

// import.meta.url 기준 경로는 현재 터미널 위치와 무관하게 fixture를 찾는다.
const projectRoot = fileURLToPath(new URL("./fixtures/demo-project/", import.meta.url));
const graph = loadGraph(projectRoot);
assert.ok(graph, "학습 그래프가 있어야 합니다.");
const clean = validateGraph(graph);
assert.equal(clean.success, true);
assert.equal(clean.issues.length, 0);
assert.equal(clean.data?.nodes.length, 3);

// 깊은 복사로 정상 데이터를 보존한다. 존재하지 않는 노드로 향하는 엣지를 추가한다.
const broken = structuredClone(graph);
broken.edges.push({
  source: "checkout", target: "missing", type: "imports",
  direction: "forward", weight: 1,
});
const repaired = validateGraph(broken);
assert.equal(repaired.success, true);
assert.ok(repaired.issues.some((issue) => issue.level === "dropped"));
assert.equal(repaired.data?.edges.length, 2);
console.log("정상 그래프: 3 nodes / 2 edges / issues 0");
console.log("깨진 edge: success=true이지만 dropped 경고 발생");
console.log(repaired.issues);
