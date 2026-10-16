---
title: Memory
description: 캐릭터별 대화 문맥과 요약, 장기 기억의 저장·검색 구조
---

별무리는 최근 대화의 원문, 오래된 문맥의 요약, 검색한 장기 기억을 함께 사용합니다. 최근 원문은 이어지는 대화를 구체적으로 전달하고, 요약은 입력에서 제외한 대화의 내용을 압축합니다. 장기 기억은 현재 질문과 관련 있는 사용자 발화를 다시 찾는 데 사용합니다.

<nav class="doc-card-group" aria-label="기억 관련 상세 문서">
  <a class="doc-card" href="?doc=memory-save" aria-labelledby="memory-save-title">
    <svg class="doc-card-icon" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>
    <span class="doc-card-title" id="memory-save-title">Memory writes</span>
    <span class="doc-card-description">어떤 발화를 기억으로 남기고, 저장 실패는 어떻게 처리하는지 설명합니다.</span>
    <span class="doc-card-arrow" aria-hidden="true">→</span>
  </a>
  <a class="doc-card" href="?doc=memory-retrieval" aria-labelledby="memory-retrieval-title">
    <svg class="doc-card-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5M7.5 10.5h6M10.5 7.5v6"/></svg>
    <span class="doc-card-title" id="memory-retrieval-title">Memory retrieval</span>
    <span class="doc-card-description">최근 문맥과 겹치지 않으면서 현재 질문에 필요한 기억을 찾습니다.</span>
    <span class="doc-card-arrow" aria-hidden="true">→</span>
  </a>
  <a class="doc-card" href="?doc=optimization-kv-cache" aria-labelledby="memory-cache-title">
    <svg class="doc-card-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5"/></svg>
    <span class="doc-card-title" id="memory-cache-title">KV cache</span>
    <span class="doc-card-description">대화 기록과 별도로 추론 상태를 보존하고, 계산을 재사용합니다.</span>
    <span class="doc-card-arrow" aria-hidden="true">→</span>
  </a>
</nav>

## Stored state

| 상태 | 보관 방식 | 답변에 사용하는 방법 |
| --- | --- | --- |
| 최근 대화 | 캐릭터별 대화 파일에 사용자 발화, 표시한 답변과 요청 상태를 저장합니다. | 남겨 둔 이력을 순서대로 입력에 넣습니다. |
| 대화 요약 | 같은 파일에 요약문과 요약에 사용한 모델 식별자를 저장합니다. | 최근 이력 앞에 넣습니다. |
| 장기 기억 | SQLite에 저장 판정을 통과한 사용자 원문과 임베딩을 기록합니다. | 현재 질문과의 유사도로 검색합니다. |
| KV 캐시 | 최신 추론 상태를 별도 파일에 보관합니다. | 입력 접두부가 같은 구간의 계산을 재사용합니다. |

캐릭터를 전환하면 해당 캐릭터의 대화 파일을 읽습니다. 장기 기억 검색도 선택한 캐릭터 범위로 제한합니다. 현재 사용자 범위는 기기의 로컬 사용자 식별자를 사용하며, 로그인 계정별 저장소 분리와는 다릅니다.

## Recent context and compaction

대화는 토큰 예산을 넘기 전까지 원문으로 쌓습니다. 입력이 길어지면 최근 3개 요청에 해당하는 문맥을 우선 남기고, 제외할 대화와 기존 요약을 다시 요약합니다. 요약의 기본 상한은 500토큰이며, 남길 최근 문맥도 예산에 맞지 않으면 줄입니다.

문맥 정리는 생성 전 입력이 넘칠 때와 답변 완료 후 다음 요청을 준비할 때 실행할 수 있습니다. 정리 중에는 새 요청을 받지 않고, 끝나면 입력 가능한 상태를 알립니다. 요약 생성에 실패하면 경고와 함께 최근 문맥만 사용합니다. 파일 저장이나 모델의 입력 재계산에 실패하면 대화 준비를 실패로 처리합니다.

대화로 가져온 홈 발화와 화두 정보도 문맥에 속합니다. 원문이 제외되면 그 화두의 입력 지침도 제외합니다. 문맥을 줄이는 작업이 화면의 전체 기록 삭제를 뜻하지는 않습니다.

## Persistence and finalization

사용자 발화는 요청을 받아들일 때 파일에 저장합니다. 저장이 실패하면 생성을 시작하지 않습니다. 생성 중인 답변 조각은 메모리에 반영하고, Unity가 표시 결과를 확정한 뒤 답변과 완료·취소 상태를 파일에 저장합니다.

취소한 요청은 실제로 표시한 부분까지만 남깁니다. 출력 필터가 차단한 답변은 빈 답변으로 취소를 확정합니다. 앱이 갑자기 종료되면 저장 이후의 출력 조각은 복원되지 않을 수 있으며, 진행 중이던 요청은 취소 상태로 복원합니다.

모델이 바뀌어 저장된 요약의 모델 식별자가 맞지 않거나 요약 사용을 끄면 요약을 제거합니다. 남아 있는 최근 원문으로 입력을 다시 구성합니다.

## Long-term memory

완료된 일반 대화 중 저장 판정을 통과한 사용자 발화를 SQLite에 기록합니다. 원문, 판정과 임베딩은 하나의 트랜잭션으로 저장합니다. 저장 실패가 이미 완료한 답변을 취소하지는 않습니다.

검색에서는 최근 문맥에 있는 요청 ID를 제외합니다. 문맥 정리로 원문이 빠진 요청은 장기 기억에 저장되어 있다면 다시 후보가 됩니다. 요약문과 검색 기억 사이의 의미 중복까지 제거하는 방식은 아닙니다.

SQLite 연결은 모델 준비와 해제에서 독립적으로 유지합니다. 임베딩 모델을 다시 준비하는 동안에도 저장소를 새 연결로 교체하지 않아 기록 조회와 모델 수명을 분리합니다.

## Diaries and memory candidates

날짜별 일기는 해당 날짜와 캐릭터의 활성 장기 기억을 읽어 별도 생성 요청으로 만듭니다. 이미 저장된 일기가 있으면 그 결과를 반환합니다. 일기는 대화를 이어가기 위한 문맥 요약과 별도로 저장합니다.

완료된 답변에서 짧은 기억 후보를 만드는 기능도 별도 생성 요청을 사용합니다. 이 후보는 Unity에 전달하며, 일반 대화의 저장 판정을 통과해 SQLite에 기록되는 장기 기억과는 별도 경로입니다.
