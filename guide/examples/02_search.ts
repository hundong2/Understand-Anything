/**
 * 목표: 실제 Fuse.js 기반 SearchEngine으로 이름 검색과 타입 필터를 비교한다.
 * 실행: node guide/examples/02_search.ts
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGraph } from "../../understand-anything-plugin/packages/core/dist/persistence/index.js";
import { SearchEngine } from "../../understand-anything-plugin/packages/core/dist/search.js";

const graph = loadGraph(fileURLToPath(new URL("./fixtures/demo-project/", import.meta.url)));
assert.ok(graph);
const search = new SearchEngine(graph.nodes);
const results = search.search("payment", { types: ["file"], limit: 3 });
assert.equal(results[0]?.nodeId, "payment");
assert.deepEqual(search.search("   "), []);
assert.deepEqual(search.search("payment", { types: ["class"] }), []);

// score는 0이 좋은 매칭이다. 운영 장애 확률이나 LLM 신뢰도로 해석하지 않는다.
console.log("payment 검색:", results);
console.log("class 필터: 결과 없음; 공백 검색: 결과 없음");
