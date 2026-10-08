---
title: Mac Memory Measurements
---

[본문으로 돌아가기](/docs-beolmuri-ai/?doc=optimization-on-device-memory)

보존된 실행 요약과 CSV의 전체 조건표입니다. 단위와 집계 기준이 같은 행끼리 비교합니다.

## Metrics and deduplication

- RSS와 phys_footprint는 별도 메모리 지표입니다. 서로 더하지 않습니다. 표본 최고값은 실제 연속 시간 최고값보다 낮을 수 있습니다. 각 지표의 최고 시점도 같다고 가정하지 않습니다.
- 절대 표본 최고값, 로드 전 대비 증가량, 특정 시점 스냅샷, 할당 요청 크기, 디스크 캐시 파일 크기를 별도 표로 유지합니다.
- `memory-audit-20261007`은 기존 실행을 다시 집계한 자료입니다. 여기의 stress·스케일 A/B·root·settings 행을 원래 보고서 행과 더해 반복 수를 늘리지 않습니다.
- 동일 조건의 반복만 중앙값으로 묶습니다. 입력·캐시·계측 방식이 다른 실행은 합치지 않습니다. 초기 Gemma 기준선의 동일 해시 복사본은 한 건만 셉니다.
- 모든 기본 맥 표는 추론 전용 프로세스입니다. Unity 또는 아이폰 메모리로 환산하지 않습니다. 세부 맥 기종은 MTP 문서의 M5 Pro·64GB 외에는 해당 요약이 명시하지 않아 확정하지 않았습니다.

## Experiment index

| 실험군 | 시도 수 | 상태별 수 | RAM 수집 수 | 측정 종류 |
| --- | --- | --- | --- | --- |
| mac-context-old | 26 | {'complete': 25, 'failed': 1} | 26 | {'sampled_peak': 26} |
| mac-diagnostic-old | 16 | {'complete': 16} | 16 | {'diagnostic_peak': 16} |
| mac-e4-canary | 3 | {'complete': 3} | 3 | {'sampled_peak': 3} |
| mac-formula-trace | 3 | {'failed': 1, 'complete': 2} | 0 | {'no_memory_collection': 3} |
| mac-load-controls | 12 | {'complete': 12} | 12 | {'sampled_peak': 12} |
| mac-mapping-diagnostic | 3 | {'complete': 3} | 3 | {'diagnostic_peak': 3} |
| mac-prefill-quality-no-ram | 45 | {'complete': 43, 'failed': 2} | 0 | {'no_memory_collection': 45} |
| mac-scale-ab | 37 | {'complete': 36, 'failed': 1} | 37 | {'sampled_peak': 37} |
| mac-settings | 12 | {'complete': 12} | 12 | {'sampled_peak': 12} |
| mac-settings-extra | 3 | {'complete': 3} | 3 | {'sampled_peak': 3} |
| mac-split-old | 4 | {'complete': 4} | 4 | {'sampled_peak': 4} |
| mac-stress-new | 18 | {'setup_failed': 9, 'complete': 9} | 18 | {'sampled_peak': 18} |

재집계의 맥 행은 182개입니다. 이 수에는 실패·준비 실패·진단·RAM 미수집 실행이 모두 들어 있습니다. 아래 신규 실험과 초기 탐색은 이 표 밖에 있습니다.

| 별도 실험군 | 반복·상태 | 우선 근거 |
| --- | --- | --- |
| E2B 패치×청크×문맥 행렬 | 12조건 × 3회, 36/36 완료 | mac-e2b-xnnpack-prefill-matrix-20261007/report.json |
| E4B 할당 진단 | 정상 2회, 의도적 오류 주입 2회 | mac-e4b-allocation-diagnosis-20261008/summary.json |
| Swift 파일 해시 | 전후 3회씩, 6회 해시 일치 | swift-embedding-hash-ablation-20261008/ab/summary.json |
| MTP | 고정 길이 본측정 8회·예열 4회, 대화 8회 | ../mtp-ablation/summary.json·chat-summary.json |
| 초기 모델 탐색 1차 | 17개 RAM 단계, 각 n=1 | ../runner/runs/all/summary.json |
| 초기 모델 탐색 2차 | 13개 RAM 단계, 각 n=1, 실패 포함 | ../runner/round2/runs/all/summary.json |
| 초기 단독 실행 | 10개 대표 결과 파일, 각 n=1 | ../early-* 결과 JSON |
| Kanana vLLM | 입출력·발화 기록은 있으나 확인한 요약에 RAM 없음 | ../kanana-vllm/run-v0.30/results.json·run-context-4096/result.json |

## E2B context and chunk matrix

Gemma 4 E2B 모바일 QAT, 맥 LiteRT-LM CPU 4스레드, 매회 새 프로세스·신규 캐시, 50ms PID 표본입니다. XNNPACK 고정판에 스케일 배열 수정만 전후 비교하고 양쪽에 같은 청크 선택 코드를 적용했습니다. 모든 행은 n=3, 3/3 완료이며 값은 실행별 절대 표본 최고값의 중앙값입니다.

| 문맥 | 입력/출력 | XNN 패치 | 청크 | RSS GiB | 풋프린트 GiB | 프리필 초 | 디코드 토큰/초 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4096 | 3072/1024 | baseline | 128 | 2.701813 | 1.082309 | 5.056 | 47.99 |
| 4096 | 3072/1024 | patched | 128 | 2.079483 | 0.459674 | 5.016 | 47.11 |
| 4096 | 3072/1024 | baseline | 1024 | 3.268250 | 1.649006 | 6.030 | 48.50 |
| 4096 | 3072/1024 | patched | 1024 | 2.637955 | 1.018405 | 5.927 | 48.38 |
| 8192 | 7168/1024 | baseline | 128 | 4.484802 | 2.866139 | 15.928 | 40.36 |
| 8192 | 7168/1024 | patched | 128 | 2.173126 | 0.553348 | 16.031 | 40.88 |
| 8192 | 7168/1024 | baseline | 1024 | 5.502594 | 3.884466 | 18.478 | 40.24 |
| 8192 | 7168/1024 | patched | 1024 | 3.113190 | 1.493900 | 18.335 | 39.92 |
| 8192 | 3072/1024 | baseline | 128 | 4.484695 | 2.866078 | 6.848 | 39.84 |
| 8192 | 3072/1024 | patched | 128 | 2.173660 | 0.553882 | 7.047 | 38.59 |
| 8192 | 3072/1024 | baseline | 1024 | 5.502533 | 3.884405 | 7.912 | 39.69 |
| 8192 | 3072/1024 | patched | 1024 | 3.112427 | 1.493122 | 7.894 | 40.36 |

각 행의 최솟값·최댓값과 정수 바이트는 JSON의 `matrix_groups`에 있습니다. 8K 동일 입력 통제행까지 보존했으므로 용량 효과와 실제 입력 길이 효과를 구분할 수 있습니다.

## Historical group medians

공통 엔진은 LiteRT-LM, 기기는 맥, backend는 CPU입니다. 아래 행은 완료된 실행만 묶었으며 풋프린트 절대 표본 최고값과 증가량을 함께 표시합니다. 기본 그래프 선택의 정확한 청크는 미확인으로 남깁니다. `model_before`는 모델 로드 전, `first_process_sample`은 대상 프로세스 첫 표본입니다. 두 증가량의 기준이 다릅니다.

| 그룹 | 모델 | 문맥 | 스레드 | 입력/출력 | 청크 | XNN 패치 | n | RSS GiB | 절대 FP GiB | FP 증가 GiB | 증가 기준 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mac-context-old:c2048:p128:root-2048-baseline | E2B | 2048 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 0.613513 | 0.598010 | model_before |
| mac-context-old:c4096:p1024:warm | E2B | 4096 | 4 | 1024/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.550785 | 1.535709 | model_before |
| mac-context-old:c4096:p1025:warm | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.750340 | 1.735385 | model_before |
| mac-context-old:c4096:p1152:warm | E2B | 4096 | 4 | 1152/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.750278 | 1.735202 | model_before |
| mac-context-old:c4096:p1153:warm | E2B | 4096 | 4 | 1153/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.750431 | 1.735462 | model_before |
| mac-context-old:c4096:p128:probe-4096-b | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 1.090534 | 1.075534 | model_before |
| mac-context-old:c4096:p128:warm | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 0.980213 | 0.964908 | model_before |
| mac-context-old:c4096:p129:warm | E2B | 4096 | 4 | 129/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 0.979572 | 0.964602 | model_before |
| mac-context-old:c4096:p1436:warm | E2B | 4096 | 4 | 1436/1 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 1.750294 | 1.735401 | model_before |
| mac-context-old:c8192:p128:probe-8192-128-cold | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 2.874196 | 2.859089 | model_before |
| mac-context-old:c8192:p128:warm | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 2.764470 | 2.749455 | model_before |
| mac-e4-canary:p1025 | E4B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 1.312764 | 1.312642 | first_process_sample |
| mac-e4-canary:p128 | E4B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.655949 | 0.655873 | first_process_sample |
| mac-e4-canary:p4095 | E4B | 4096 | 4 | 4095/1 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 1.313298 | 1.313222 | first_process_sample |
| mac-load-controls:c4096:p1024:paired | E2B | 4096 | 4 | 1024/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.552585 | 1.537204 | model_before |
| mac-load-controls:c4096:p1025:paired | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.752613 | 1.737201 | model_before |
| mac-load-controls:c4096:p128:paired | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 0.979770 | 0.964450 | model_before |
| mac-load-controls:c4096:p129:paired | E2B | 4096 | 4 | 129/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 0.979709 | 0.964465 | model_before |
| mac-scale-ab:dialogue:daily:c4096:수정 전 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 1.081836 | 1.081653 | first_process_sample |
| mac-scale-ab:dialogue:daily:c4096:수정 후 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.460940 | 0.460742 | first_process_sample |
| mac-scale-ab:dialogue:daily:c8192:수정 전 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 2.865712 | 2.865544 | first_process_sample |
| mac-scale-ab:dialogue:daily:c8192:수정 후 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.555011 | 0.554935 | first_process_sample |
| mac-scale-ab:dialogue:empathy:c4096:수정 전 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 1.081973 | 1.081806 | first_process_sample |
| mac-scale-ab:dialogue:empathy:c4096:수정 후 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.459887 | 0.459720 | first_process_sample |
| mac-scale-ab:dialogue:empathy:c8192:수정 전 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 2.866628 | 2.866399 | first_process_sample |
| mac-scale-ab:dialogue:empathy:c8192:수정 후 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.554446 | 0.554370 | first_process_sample |
| mac-scale-ab:dialogue:memory:c4096:수정 전 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 1.082584 | 1.082416 | first_process_sample |
| mac-scale-ab:dialogue:memory:c4096:수정 후 | E2B | 4096 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.460803 | 0.460635 | first_process_sample |
| mac-scale-ab:dialogue:memory:c8192:수정 전 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 전 | 1 | 미수집 | 2.866078 | 2.865910 | first_process_sample |
| mac-scale-ab:dialogue:memory:c8192:수정 후 | E2B | 8192 | 4 | 미수집/미수집 | 기본 그래프 선택 | 수정 후 | 1 | 미수집 | 0.554523 | 0.554324 | first_process_sample |
| mac-scale-ab:synthetic:1025:c4096:수정 전 | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.848652 | 1.848438 | first_process_sample |
| mac-scale-ab:synthetic:1025:c4096:수정 후 | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 후 | 3 | 미수집 | 1.069614 | 1.069370 | first_process_sample |
| mac-scale-ab:synthetic:1025:c8192:수정 전 | E2B | 8192 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 4.417120 | 4.416952 | first_process_sample |
| mac-scale-ab:synthetic:1025:c8192:수정 후 | E2B | 8192 | 4 | 1025/1 | 기본 그래프 선택 | 수정 후 | 3 | 미수집 | 1.504947 | 1.504718 | first_process_sample |
| mac-scale-ab:synthetic:128:c4096:수정 전 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 1.081012 | 1.080844 | first_process_sample |
| mac-scale-ab:synthetic:128:c4096:수정 후 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 후 | 3 | 미수집 | 0.458789 | 0.458590 | first_process_sample |
| mac-scale-ab:synthetic:128:c8192:수정 전 | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | 3 | 미수집 | 2.865910 | 2.865712 | first_process_sample |
| mac-scale-ab:synthetic:128:c8192:수정 후 | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 후 | 3 | 미수집 | 0.554263 | 0.554065 | first_process_sample |
| mac-settings:e2b:t4:p1024 | E2B | 4096 | 4 | 3168/128 | 1024 | 수정 후 | 2 | 1.908180 | 0.945491 | 미수집 | 미확인 |
| mac-settings:e2b:t4:p128 | E2B | 4096 | 4 | 3168/128 | 128 | 수정 후 | 2 | 1.311829 | 0.348819 | 미수집 | 미확인 |
| mac-settings:e4b:t2:p128 | E4B | 4096 | 2 | 3168/128 | 128 | 수정 후 | 2 | 2.816223 | 0.484982 | 미수집 | 미확인 |
| mac-settings:e4b:t4:p1024 | E4B | 4096 | 4 | 3168/128 | 1024 | 수정 후 | 2 | 3.431900 | 1.100965 | 미수집 | 미확인 |
| mac-settings:e4b:t4:p128 | E4B | 4096 | 4 | 3168/128 | 128 | 수정 후 | 2 | 2.816307 | 0.485066 | 미수집 | 미확인 |
| mac-settings:e4b:t6:p128 | E4B | 4096 | 6 | 3168/128 | 128 | 수정 후 | 2 | 2.816475 | 0.485249 | 미수집 | 미확인 |
| mac-split-old:c4096:p1025:single | E2B | 4096 | 4 | 1025/미수집 | 기본 그래프 선택 | 수정 전 | 2 | 미수집 | 1.750324 | 1.735248 | model_before |
| mac-split-old:c4096:p1025:split | E2B | 4096 | 4 | 1025 (1024+1)/미수집 | 기본 그래프 선택 | 수정 전 | 2 | 미수집 | 1.750080 | 1.734989 | model_before |
| mac-stress-new:c4096-p3072-d1024 | E2B | 4096 | 4 | 3072/1024 | 기본 그래프 선택 | 수정 후 | 3 | 2.639832 | 1.018512 | 미수집 | 미확인 |
| mac-stress-new:c8192-p3072-d1024 | E2B | 8192 | 4 | 3072/1024 | 기본 그래프 선택 | 수정 후 | 3 | 3.114929 | 1.493839 | 미수집 | 미확인 |
| mac-stress-new:c8192-p7168-d1024 | E2B | 8192 | 4 | 7168/1024 | 기본 그래프 선택 | 수정 후 | 3 | 3.114960 | 1.493870 | 미수집 | 미확인 |

**분할 실험 주의:** `mac-split-old`의 single·split은 모두 전체 입력 1025토큰입니다. split 집계의 입력 `[1]`은 마지막 호출만 나타내므로 총 입력 1토큰으로 인용하면 안 됩니다. 원인 문서에 따르면 single은 1025, split은 1024+1입니다. 출력 토큰 수는 이 재집계에서 미수집입니다.

**초기 cold 실행 정정:** `probe-4096-b`는 과거 최고값 계산에서 디코드 후 경계값이 빠졌습니다. 풋프린트 절대 최고는 1,132,989,872→1,170,951,672바이트, 로드 전 대비 증가량은 1,116,883,944→1,154,845,744바이트로 수정됐습니다. 위 표는 정정된 재집계를 씁니다.

## Diagnostic and auxiliary runs

다음 행은 정상 완료지만 진단기가 부착되었거나 별도 준비·발화 실행입니다. n=1이며 기존 정상 비교 중앙값에 섞지 않습니다. 공통 엔진 LiteRT-LM, 맥 CPU, 패치 여부·조건은 각 행에 적었습니다.

| 실행 | 모델 | 문맥 | 스레드 | 입력/출력 | 청크 | 패치 | 측정 종류 | RSS GiB | 절대 FP GiB | FP 증가 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| root-address-2048-128 | E2B | 2048 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 0.526233 | 미수집 |
| root-address-4096-1024 | E2B | 4096 | 4 | 1024/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.572193 | 미수집 |
| root-address-4096-1025 | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.772022 | 미수집 |
| root-address-4096-1153 | E2B | 4096 | 4 | 1153/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.772358 | 미수집 |
| root-address-4096-128 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.001377 | 미수집 |
| root-address-8192-128 | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 2.785161 | 미수집 |
| root-heap-2048-128 | E2B | 2048 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 0.500400 | 미수집 |
| root-heap-4096-1024 | E2B | 4096 | 4 | 1024/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.551258 | 미수집 |
| root-heap-4096-1025 | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.750629 | 미수집 |
| root-heap-4096-128 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 0.980152 | 미수집 |
| root-heap-8192-128 | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 2.764485 | 미수집 |
| root-stack-4096-128 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.048923 | 미수집 |
| root-vm-4096-1024 | E2B | 4096 | 4 | 1024/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.552601 | 미수집 |
| root-vm-4096-1025 | E2B | 4096 | 4 | 1025/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 1.751942 | 미수집 |
| root-vm-4096-128 | E2B | 4096 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 0.979892 | 미수집 |
| root-vm-8192-128 | E2B | 8192 | 4 | 128/1 | 기본 그래프 선택 | 수정 전 | diagnostic_peak | 미수집 | 2.763753 | 미수집 |
| mac-memory-map/e2b | E2B | 4096 | 4 | 3168/512 | 128 | 수정 후 | diagnostic_peak | 1.312393 | 0.348849 | 미수집 |
| mac-memory-map-late/e4b | E4B | 4096 | 4 | 3168/512 | 128 | 수정 후 | diagnostic_peak | 2.816406 | 0.485158 | 미수집 |
| mac-memory-map/e4b | E4B | 4096 | 4 | 3168/512 | 128 | 수정 후 | diagnostic_peak | 2.816452 | 0.485219 | 미수집 |
| warmup-e2b | E2B | 4096 | 4 | 3168/128 | 1024 | 수정 후 | sampled_peak | 2.751938 | 1.068088 | 미수집 |
| conversation-e4b-t4-p128 | E4B | 4096 | 4 | 3168/42 | 128 | 수정 후 | sampled_peak | 2.815598 | 0.485036 | 미수집 |
| conversation-e4b-t6-p128 | E4B | 4096 | 6 | 3168/42 | 128 | 수정 후 | sampled_peak | 2.815720 | 0.485158 | 미수집 |

## XNNPACK allocation requests

Gemma E2B, 맥 LiteRT-LM CPU 4스레드, 입력128·출력1, MTP 끔. 아래는 프로세스 RAM이 아니라 큰 스케일 배열의 요청 크기입니다. 4096·8192 진단은 각 n=1 완료이며 별도 4096 준비 실패는 제외했습니다.

| 문맥 | 입력 형상 | 수정 전 요청/개 | 수정식 요청/개 | 동일 형상 개수 | 전→후 합계 |
| --- | --- | --- | --- | --- | --- |
| 4096 | [1,1,4096,512] | 67,108,864바이트 | 16,384바이트 | 9 | 576MiB→144KiB |
| 8192 | [1,1,8192,512] | 268,435,456바이트 | 32,768바이트 | 9 | 2304MiB→288KiB |

근거는 `xnnpack-formula-probe-20261005/README.md`, `ROOT_CAUSE_XNNPACK.md`입니다. 변경식 수치 자체는 동일 형상에 대입한 계산이며 실제 메모리 감소는 위 별도 A/B 표로 확인합니다. `malloc_history`의 실제 할당 크기 표기는 각각 67,125,248·268,451,840바이트로 요청보다 16,384바이트 큽니다. 2048 추가 진단에서도 16MiB 버퍼9개가 관찰됐지만 기본 실행은 cold n=1이므로 4K·8K warm n=3과 통계적으로 합치지 않습니다.

9개 버퍼 크기 범주 증가 1728MiB는 기본 실험의 4K→8K 풋프린트 증가 차이 1827.38MiB의 94.56%를 설명합니다. 서로 다른 계측 실행 간 대조이며 동일 피크의 정밀 분해가 아닙니다. 입력1024→1025의 최고 증가량 차이204.47MiB에 대해 상세 실행의 큰 할당 범주 합계171.14MiB가 관찰됐습니다.

## E4B allocation diagnostics

Gemma E4B 모바일 QAT, 맥 LiteRT-LM CPU 4스레드, 문맥4096·합성입력1442·요청출력1, 새 캐시, XNNPACK 스케일 패치 적용, LLDB 진단입니다. n=1씩이며 정상 두 행은 생성 완료, 실패 두 행은 인위적 오류 주입입니다. 속도 평가에서 제외합니다.

| 실행 | 청크 | 결과 | RSS GiB | FP GiB | 최대 XNN 요청 바이트 | 최대 arena 요청 바이트 |
| --- | --- | --- | --- | --- | --- | --- |
| trace-128-targeted | 128 | complete | 4.821014 | 0.649281 | 27271200 | 43647696 |
| trace-1024-targeted | 1024 | complete | 5.273941 | 1.309514 | 159391776 | 349181008 |
| injected-xnn-workspace | 1024 | intentional_injected_failure | 2.929245 | 0.676930 | 159391776 | 미확인 |
| injected-tflite-arena | 1024 | intentional_injected_failure | 3.020081 | 0.767766 | 159391776 | 349181008 |

RAM 열은 독립적인 절대 표본 최고값이며 실패 행은 종료 전까지만 측정했습니다. 개별 할당 요청을 더해 전체 RAM을 만들 수 없습니다. 두 오류 주입 모두 같은 상위 오류로 이어졌으므로 상위 오류 문구만으로 실패한 할당 종류를 특정할 수 없습니다.

## Read-only mappings

맥 LiteRT-LM CPU 4스레드, E2B/E4B 모바일 QAT, XNN 패치 적용, 문맥4096·입력3168·출력512·청크128입니다. 모델별 n=1의 별도 진단 스냅샷이며 절대 최고값이 아닙니다.

| 모델 | 스냅샷 시각 초 | RSS GiB | FP GiB | 캐시 파일 GiB | 캐시 resident 표시 | dirty/swapped |
| --- | --- | --- | --- | --- | --- | --- |
| e2b | 5.225075916387141 | 1.311081 | 0.348681 | 0.734267 | 751.9M | 0K/0K |
| e4b | 18.302598167210817 | 2.816391 | 0.485142 | 2.058534 | 2.1G | 0K/0K |

캐시 파일의 정확한 크기는 E2B 788,412,736바이트, E4B 2,210,334,416바이트입니다. `vmmap`의 resident 표시는 반올림되어 파일 바이트와 같다고 볼 수 없습니다. 디스크 캐시 크기 분석의 MLP 비중 등은 `prefill-research/cache-attribution.md`에 있으며 새로운 RAM 실측으로 세지 않습니다.

## Swift hash buffer lifetime

맥 arm64·macOS26.5.1·Swift6.3.2의 실제 제품 해시 함수입니다. 모델 추론이 없어 모델·backend·컨텍스트·입출력 토큰·XNN 패치는 해당 없음입니다. 합성 파일 179,131,736+4,683,319바이트, 전후 n=3. 모든 해시가 기대 식별자와 일치했습니다. 함수 반환 뒤 바깥 pool을 비우기 전 스냅샷에서 해시 직전 스냅샷을 뺀 증가량입니다. 절대값이나 표본 최고값이 아닙니다.

| 구현 | n | RSS 증가 MiB | FP 증가 MiB |
| --- | --- | --- | --- |
| baseline | 3 | 176.593750 | 176.437683 |
| current | 3 | 1.609375 | 1.375069 |

수정 전은 메모리 회귀 기준을 의도대로 실패했고 수정 후는 통과했습니다. 해시 완료 여부와 메모리 테스트 통과 여부를 분리합니다. 이 결과만으로 아이폰 절감량을 주장하지 않습니다.

## MTP memory

Gemma E2B 모바일 QAT, Mac M5 Pro·64GB, LiteRT-LM Python API0.17.1, 문맥4096, 조건별 새 프로세스입니다. 예열 후 캐시를 재사용했습니다. 아래는 조건별 본측정 n=2 중앙값이며 모두 완료했습니다. CPU4스레드 또는 GPU이며 그래프 청크·XNN 패치 검증은 요약에 없습니다.

| 작업 | backend | 스레드 | MTP | 실제 입력 | 실제 출력 | 절대 FP GiB | 로드전 대비 FP 증가 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| native | cpu | 4 | False | 512 | 256 | 0.983112 | 0.966037 |
| native | cpu | 4 | True | 512 | 258 | 1.737881 | 1.720897 |
| native | gpu | 미확인 | False | 512 | 256 | 0.834033 | 0.817087 |
| native | gpu | 미확인 | True | 512 | 258 | 0.862826 | 0.845965 |
| chat | cpu | 4 | False | 66, 104 | 34, 256 | 0.985523 | 0.969012 |
| chat | cpu | 4 | True | 66, 104 | 33, 258 | 1.739994 | 1.723415 |
| chat | gpu | 미확인 | False | 66, 104 | 20, 256 | 0.628535 | 0.611933 |
| chat | gpu | 미확인 | True | 66, 104 | 27, 256 | 0.772425 | 0.755793 |

RSS는 미수집입니다. native는 입력512·요청출력256 고정 벤치마크이고 MTP의 실제 디코드 카운터는258입니다. chat은 일상·긴 자유 대화 두 문항이 한 프로세스에 들어가므로 RAM을 문항별 최고값처럼 인용하지 않습니다. 예열4회는 본측정 중앙값에 넣지 않았습니다.

## Early model comparisons

초기 탐색은 각 파일 n=1입니다. 모델·양자화·엔진이 다른 조건을 포함합니다. 1차·2차 모두 맥 CPU4스레드·문맥4096·입력4095·출력1을 요청했습니다. 성공행은 실제 토큰 수도 확인됐고 실패행은 요청만 기록합니다. XNN 패치 상태와 LiteRT 실제 청크는 해당 요약에서 확정하지 않았습니다.

표는 로드 전 대비 최고 풋프린트 증가량입니다. 원본 `additional_ram_GB`는 10^9바이트 GB이고 아래는 이를 바이트로 복원해 GiB로 표시했습니다. 1차는 LiteRT-LM0.17.1, 2차는 LiteRT-LM0.17.1 또는 llama-cpp-python 0.3.35입니다. llama.cpp는 mmap·GPU offload 끔, FP16 KV, flash attention 끔, batch/ubatch512여서 엔진별 파일 페이지 회계 차이가 있습니다.

| 차수 | 모델 ID | 배포 파일 | 엔진 | 결과 | FP 증가 GiB |
| --- | --- | --- | --- | --- | --- |
| 1 | gemma-e2b | model.litertlm | LiteRT-LM API 0.17.1 | complete | 1.836689 |
| 1 | spark-1 | Spark-X2.5-1.7B_int4.litertlm | LiteRT-LM API 0.17.1 | complete | 1.430697 |
| 1 | spark-2 | Spark-X2.5-1.7B_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 1.543491 |
| 1 | lfm26-1 | LFM2.5-2.6B_int4.litertlm | LiteRT-LM API 0.17.1 | complete | 1.838245 |
| 1 | lfm26-2 | LFM2.5-2.6B_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 1.944784 |
| 1 | lfm12-1 | LFM2.5-1.2B-Instruct_int4.litertlm | LiteRT-LM API 0.17.1 | complete | 1.665041 |
| 1 | lfm12-2 | LFM2.5-1.2B-Instruct_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 1.687595 |
| 1 | minicpm5-1 | MiniCPM5-2B_int4.litertlm | LiteRT-LM API 0.17.1 | complete | 1.487766 |
| 1 | minicpm5-2 | MiniCPM5-2B_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 0.910511 |
| 1 | granite42-1 | granite-4.2-3b_int4.litertlm | LiteRT-LM API 0.17.1 | complete | 2.452489 |
| 1 | granite42-2 | granite-4.2-3b_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 2.521400 |
| 1 | qwen35-1 | Qwen3.5-2B_int8.litertlm | LiteRT-LM API 0.17.1 | complete | 2.221944 |
| 1 | nanbeige42-1 | model.litertlm | LiteRT-LM API 0.17.1 | complete | 2.031835 |
| 1 | smollm3-1 | SmolLM3-3B_q4_block32_ekv4096.litertlm | LiteRT-LM API 0.17.1 | complete | 0.986393 |
| 1 | ministral3-1 | Ministral-3-3B-Instruct-2512_q4_block32_ekv4096.litertlm | LiteRT-LM API 0.17.1 | complete | 1.412678 |
| 1 | phi4-1 | Phi-4-mini-instruct_multi-prefill-seq_q8_ekv4096.litertlm | LiteRT-LM API 0.17.1 | complete | 2.871422 |
| 1 | kanana15-1 | kanana-1.5-2.1b-instruct-2505.litertlm | LiteRT-LM API 0.17.1 | complete | 1.510899 |
| 2 | gemma-e2b | model.litertlm | LiteRT-LM API 0.17.1 | complete | 1.841663 |
| 2 | qwen3-17-q8 | Qwen3_1.7B.litertlm | LiteRT-LM API 0.17.1 | complete | 1.406635 |
| 2 | qwen3-17-q4 | Qwen3-1.7B_dynamic_wi4b32_afp32.litertlm | LiteRT-LM API 0.17.1 | complete | 2.719806 |
| 2 | minicpm5-1-q4 | minicpm_wi4b32_wi8_afp32.litertlm | LiteRT-LM API 0.17.1 | failed | 미수집 |
| 2 | minicpm5-1-q8 | MiniCPM5-1B_dynamic_wi8_afp32.litertlm | LiteRT-LM API 0.17.1 | complete | 1.936114 |
| 2 | qwen3-4-instruct-q4 | qwen3_4b_instruct_2507_mixed_int4.litertlm | LiteRT-LM API 0.17.1 | failed | 미수집 |
| 2 | exaone4-12-q4 | EXAONE-4.0-1.2B-Q4_K_M.gguf | llama-cpp-python 0.3.35 | complete | 1.877687 |
| 2 | exaone4-12-q8 | EXAONE-4.0-1.2B-Q8_0.gguf | llama-cpp-python 0.3.35 | complete | 2.814272 |
| 2 | tinyaya-global-q4 | tiny-aya-global-q4_k_m.gguf | llama-cpp-python 0.3.35 | complete | 3.647769 |
| 2 | tinyaya-global-q8 | tiny-aya-global-q8_0.gguf | llama-cpp-python 0.3.35 | complete | 5.219380 |
| 2 | kanana2-13-q4 | kanana2tiny-Q4_K_M-im.gguf | llama-cpp-python 0.3.35 | failed | 미수집 |
| 2 | kanana2-13-q5 | kanana2tiny-Q5_K_M-im.gguf | llama-cpp-python 0.3.35 | failed | 미수집 |
| 2 | kanana2-3-q4 | kanana-2-3b-instruct.Q4_K_M.gguf | llama-cpp-python 0.3.35 | complete | 3.683810 |

초기 단독 실행은 아래 표처럼 별도 보존합니다. 같은 모델의 후속 통제 실험과 합쳐 n을 늘리지 않습니다. 아래 값은 절대 표본 최고값이며 로드 전 기준이 있는 실행만 증가량을 병기했습니다. 토큰 미확인 대화와 컨텍스트 스트레스를 구분합니다.

| 근거 ID | 모델 | backend | 스레드 | 문맥 | 입력/출력 | 생각 모드 | 결과 | 절대 FP GiB | FP 증가 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| early-gemma/gemma-baseline.json | Gemma 4 E2B mobile QAT | CPU | 4 | 4096 | 미확인/미확인 | False | complete | 2.997548 | 미수집 |
| early-spark-int4/results.json | litert-community/Spark-X2.5-1.7B | CPU | 4 | 4096 | 미확인/미확인 | 미확인 | complete | 10.128947 | 미수집 |
| early-spark-int8/int4-nothink/results.json | Spark-X2.5-1.7B INT4 | CPU | 4 | 4096 | 미확인/미확인 | False | complete | 0.864429 | 미수집 |
| early-spark-int8/int4-think/results.json | Spark-X2.5-1.7B INT4 | CPU | 4 | 4096 | 미확인/미확인 | True | complete | 0.866382 | 미수집 |
| early-spark-int8/int8-nothink/results.json | Spark-X2.5-1.7B INT8 | CPU | 4 | 4096 | 미확인/미확인 | False | complete | 1.000095 | 미수집 |
| early-spark-int8/int8-think/results.json | Spark-X2.5-1.7B INT8 | CPU | 4 | 4096 | 미확인/미확인 | True | complete | 1.007771 | 미수집 |
| early-minicpm5/results.json | openbmb/MiniCPM5-2B-MLX | Metal | 미확인 | 미확인 | 미확인/미확인 | False | complete | 1.769350 | 1.708513 |
| early-minicpm5/thinking/results.json | openbmb/MiniCPM5-2B-MLX | Metal | 미확인 | 미확인 | 미확인/미확인 | True | complete | 1.740587 | 1.680391 |
| early-minicpm5/context4096/results.json | openbmb/MiniCPM5-2B-MLX | Metal | 미확인 | 4096 | 3840/256 | False | complete | 2.598192 | 2.537996 |
| early-spark-int8/spark/results.json | Spark-X2.5-1.7B INT8 | CPU | 4 | 4096 | 4095/1 | 미확인 | complete | 1.558522 | 1.543522 |

MiniCPM5의 MLX4K 스트레스는 입력3840·출력256·prefill_step2048이고 KV 텐서 보고값은176,160,768바이트, bfloat16입니다. 이는 프로세스 RSS·풋프린트와 다른 범위의 텐서 용량입니다. 초기 Gemma/Spark 결과는 모델 로드 전 기준값이 요약에 없어 증가량을 만들지 않았습니다. Kanana vLLM의 확인한 결과 요약에는 RAM 숫자가 없어 메모리 표에 임의 값을 넣지 않았습니다.

## Coverage and corrections

- 재집계 Mac182행 중 RAM미수집48행은 수치 검증·발화·수식진단 등이며 메모리 성공 n에 포함하지 않습니다. 준비 실패의 숫자는 생성 성공 최고값이 아닙니다.
- Mac RSS는 오래된 footprint 전용 수집기에 없습니다. 누락된 RSS를 footprint에 모델 파일 크기를 더해서 추정하지 않습니다.
- `mac-split-old`의 split input1은 마지막 프리필 호출 수입니다. 전체1025를 설명문과 함께 인용합니다.
- 초기 cold E2B probe의 두 값은 재집계 정정값을 사용합니다. 캐시 준비 실행을 warm 반복 중앙값에 섞지 않습니다.
- stress의 최초9회는 동적 라이브러리 경로 문제로 준비 실패했습니다. 완료9회는 attempt-02에 있고 matrix36회와는 다른 실행입니다.
- 새로운 matrix는 실제 청크 선택을 검증했지만 이전 기본 선택 표는 명시 청크128/1024와 같은 통제 조건으로 취급하지 않습니다.
- E4B LLDB 할당 정상실행2회와 오류주입2회는 진단값입니다. 최신 아이폰 실패의 원인을 맥 오류주입으로 확정하지 않습니다.
- MTP와 초기 탐색은 서로 다른 입력·캐시·엔진·양자화입니다. 하나의 평균 또는 전후 최적화 절감률을 만들지 않습니다.
- 집계 검증 범위는 [근거 자료 안내](/docs-beolmuri-ai/evidence/on-device-memory/archive/#coverage-and-corrections)에 정리했습니다.

## Source index

- 주 비교: `mac-e2b-xnnpack-prefill-matrix-20261007/REPORT.md`, `measurements.csv`, `report.json`.
- 전체 기존 Mac인덱스: `memory-audit-20261007/measurements.json`, `measurements.csv`, `verification.json`.
- 수식·원인: `ROOT_CAUSE_XNNPACK.md`, `xnnpack-formula-probe-20261005/README.md`, `ab-20261005/summary.json`.
- E4B 설정·매핑: `product-e2b-e4b-full-context-20261006/settings-audit.md`, `prefill-research/mac-settings/result.json`, `memory-map-analysis.json`.
- E4B 새 할당: `mac-e4b-allocation-diagnosis-20261008/summary.json`.
- 해시: `swift-embedding-hash-ablation-20261008/README.md`, `ab/summary.json`.
- MTP·초기 탐색: 보관함 루트의 `mtp-ablation/`, `runner/`, `early-*`.

JSON의 `source_manifest`에는 이번에 읽은 구조화 근거 파일의 SHA-256을 기록했습니다. `audit_records`는 Mac182행을 한 번씩 보존합니다.
