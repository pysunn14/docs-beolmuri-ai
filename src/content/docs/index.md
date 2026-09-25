---
title: 별무리 AI
description: 소형 언어 모델과 iOS 앱을 연결하는 온디바이스 AI 실행환경
---

## Project Overview

별무리는 스마트폰 안에서 언어 모델을 실행해 캐릭터와 대화하고, 알람과 일정 같은 기기 기능을 연결하는 앱입니다. 저는 AI 개발을 맡아 추론 런타임과 Swift 연동, 도구 실행 제어와 평가 환경을 개발했습니다.

## My Role

| 담당 영역 | 수행 내용 |
| --- | --- |
| 온디바이스 추론 | LiteRT-LM과 Swift 연동, 대화 입력과 스트리밍 처리 |
| 추론 상태 관리 | KV 캐시 재사용, 완료된 대화의 캐시 저장과 복원 |
| 도구 실행 | 호출 의도 분류, 도구 선택, 인자와 실행 상태 검증 |
| 평가 환경 | 분류 오류 분석, 추론 결과 비교, 실기기 자원 측정 |

## Problem Solving

### Repeated Context Processing

**Problem**\
요청마다 대화 객체를 새로 만들면 앞선 입력의 계산을 다음 요청에서 재사용하기 어렵습니다. 검색한 기억과 지침도 바뀌므로 새 질문만 덧붙일 수도 없었습니다.

**Solution**\
매번 최신 전체 입력을 구성하면서 세션은 유지하고, 토큰이 일치하는 앞부분의 KV 캐시를 재사용하도록 변경했습니다. LiteRT-LM의 CPU 상태 전송 기능을 확장해 완료된 대화의 캐시를 파일로 저장하고 복원하도록 구현했습니다.

[KV Cache Reuse and Persistence →](?doc=optimization-kv-cache)

### False Tool Activations

**Problem**\
기능과 관련된 일반 대화도 실행 요청으로 분류됐습니다. 비실행 사례만 학습에 보강하자 정상 요청까지 놓쳤습니다.

**Solution**\
같은 기능의 실행 요청과 비실행 문장을 함께 학습하고, 호출 판별과 도구 선택을 분리했습니다. 모델이 제안한 인자는 Swift에서 검증한 뒤 실행하도록 구성했습니다.

기존 평가셋의 회고 비교에서 일반 대화 오판은 11/24건에서 1/24건으로 줄었으며, 실제 실행 요청은 159/168건을 통과시켰습니다.

[Classifier Evaluation →](?doc=tool-use-classifier-evaluation) · [Request Routing →](?doc=tool-use-request-routing)

## Technical Documentation

[Architecture](?doc=architecture)에서 전체 요청 흐름을 볼 수 있습니다. [Optimization](?doc=optimization-kv-cache)은 추론 상태와 성능 측정, [Tool Use](?doc=tool-use-request-routing)는 요청 분류와 실행 절차, [Memory](?doc=memory-memory)는 기억의 저장과 검색을 설명합니다.
