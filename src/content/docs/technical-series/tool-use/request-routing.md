---
title: Request Routing
description: 호출 의도 판정과 규칙·임베딩 기반 도구 선택
---

도구 라우팅은 발화가 기기 기능의 실행을 요구하는지, 요구한다면 어느 기능에 해당하는지 판단하는 과정입니다. 일상적인 대화에 기능과 관련된 단어가 나온다는 이유만으로 실행 제안을 만들면 불필요한 확인 화면이 나타날 수 있습니다.

현재 제품 경로는 먼저 실행 요청 후보인지를 판단하고, 그 결과가 후보일 때 도구의 종류를 선택합니다. 호출 여부 판정과 임베딩 기반 도구 선택은 하나의 벡터를 함께 사용합니다.

## Actionability

입력을 임베딩 모델에 넣으면 768개 값으로 이루어진 벡터가 나옵니다. 작은 신경망 분류기인 MLP는 이 벡터를 입력으로 받아 도구 호출 후보 점수를 계산합니다. 설정된 임계값 이상이면 다음 단계로 보내고, 그보다 낮으면 일반 대화로 분류합니다.

이 단계는 해당 발화를 도구 선택 단계까지 보낼지 결정합니다. 날짜나 수량 같은 실행 인자는 도구를 선택한 뒤 생성합니다. 분류기의 가중치와 임계값은 별도 자원에 담겨 있으며, 로딩할 때 벡터 차원과 자원 형식을 검사합니다.

점수는 호출 후보를 구분하는 데 쓰입니다. 그 값을 그대로 사용자 요청을 올바르게 이해했을 확률로 해석하려면 별도의 보정과 검증이 필요합니다.

## Tool selection

호출 후보로 판정한 뒤 한국어 규칙에서 도구를 찾으면 그 결과를 사용합니다. 규칙으로 정하지 못한 발화는 입력 벡터와 도구별 대표 벡터를 비교합니다. 규칙에 맞는 표현이 있어도 MLP가 실행 요청으로 인정하지 않으면 일반 대화로 처리합니다.

임베딩 선택기는 도구마다 가장 높은 유사도를 구하고 도구별 임계값과 대조합니다.

| 기준을 넘은 도구 수 | 처리 |
| --- | --- |
| 0개 | 일반 대화로 진행합니다. |
| 1개 | 해당 도구를 선택합니다. |
| 2개 이상 | 충돌로 분류하고 요청을 나누도록 안내합니다. |

한 요청에서 여러 도구가 선택되면 충돌로 처리합니다. 실행할 기능을 하나로 정할 수 없는 요청은 사용자에게 나누어 입력하도록 안내합니다.

## Availability and clarification

도구가 하나 선택되면 플랫폼의 지원 목록과 현재 세션의 허용 목록을 각각 확인합니다. 기기에서 지원하지 않는 기능과 앱에서 아직 허용하지 않은 기능을 구분해 반환합니다.

로컬 알림 요청은 필수 정보가 부족하면 사용자에게 추가 정보를 요청합니다. 이 추가 확인 절차는 현재 로컬 알림 도구에 연결되어 있습니다.

날짜나 시간 등의 인자가 필요한 도구는 언어 모델에 선택한 도구의 정의를 전달합니다. 반환한 이름이 선택한 도구와 일치하는지도 검사합니다. 현재 시각과 알람 목록 조회는 고정 인자를 사용하므로 생성 단계를 거치지 않습니다.

## Failure behavior

임베딩을 만들지 못하거나 도구 라우팅 자원에 문제가 있으면 브릿지는 오류를 기록하고 일반 대화 경로로 진행합니다. 이때 기기 기능을 실행하지는 않습니다. 다만 실행 요청이 일반 대화 응답으로 처리될 수 있으므로, 라우터 오류와 정상적인 일반 대화 판정을 진단 기록에서 구분해야 합니다.

## Evaluation

호출 여부 분류기의 학습 조건별 오활성과 정상 요청 재현율은 [Classifier Evaluation](?doc=tool-use-classifier-evaluation)에서 비교합니다.

<nav class="doc-card-group" aria-label="도구 분류 평가와 실행의 상세 문서">
  <a class="doc-card" href="?doc=tool-use-classifier-evaluation" aria-labelledby="tools-evaluation-title">
    <svg class="doc-card-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3v18h17M9 16v-5M14 16V7M19 16V4"/></svg>
    <span class="doc-card-title" id="tools-evaluation-title">Classifier evaluation</span>
    <span class="doc-card-description">불필요한 도구 호출과 놓친 실행 요청을 학습 조건별로 비교합니다.</span>
    <span class="doc-card-arrow" aria-hidden="true">→</span>
  </a>
  <a class="doc-card" href="?doc=tool-use-proposal-execution" aria-labelledby="tools-execution-title">
    <svg class="doc-card-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 3 3 5-6"/></svg>
    <span class="doc-card-title" id="tools-execution-title">Proposal and execution</span>
    <span class="doc-card-description">도구별 인자와 확인 정책을 적용한 뒤 기기 기능을 실행합니다.</span>
    <span class="doc-card-arrow" aria-hidden="true">→</span>
  </a>
</nav>
