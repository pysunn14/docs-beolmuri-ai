---
title: iPhone Memory Measurements
---

[본문으로 돌아가기](/docs-beolmuri-ai/?doc=optimization-on-device-memory)

같은 실행을 재집계한 기록은 실행 ID로 합쳤습니다. GiB는 1024³바이트이며, 각 지표의 최고값은 독립적으로 계산했습니다.

## Reading the tables

- 컨텍스트는 실행기가 수용하는 토큰 용량이며 실제 입력 길이가 아닙니다. 짧은 사용자 입력에도 제품 프롬프트가 붙습니다. 네이티브 프리필 수, 앱이 조립한 입력 수, CachedSession 제출 수는 다른 계측 지점입니다.
- 수정 전·후는 고정 XNNPACK 리비전에 c72e2a4 스케일 배열 수정 하나를 적용했는지 뜻합니다. 전체 최신 버전과 구버전을 비교한 것이 아닙니다.
- 완료 조건 표는 실행별 최고값의 중앙값입니다. 실패 행의 숫자는 중단 전 부분값입니다. 미수집은 0이 아닙니다.
- 증분은 출발점을 기록할 수 있는 경우에만 제공합니다. 추론 전용의 풋프린트 증분은 model_before 대비 최고값입니다. 최신 Unity 요약의 단계별 끝-시작 차이는 최고값 증분과 같지 않아 표에 전용하지 않았습니다.

## Application matrices

E2B는 빌드 123462에서 9개 조건을 각각 3회 완료했고, 빌드 123470에서 8K·청크 128의 긴 입력을 별도로 3회 완료했습니다. E4B는 빌드 123465에서 수정 후 4096·청크 128의 두 입력을 각각 3회 완료했습니다. E4B 빌드는 시스템 VM 수집기가 추가됐으므로 두 모델 비교에는 빌드·계측 차이가 남습니다. 모두 CPU 경로이며 출력 상한은 256토큰입니다. 정상 측정은 충전 분리, 시작 발열 정상, 새 프로세스·진단 세션·런타임 캐시 조건을 사용합니다.

### iphone-e2b-ablation-20261007

| 패치 | 용량 | 청크 | 입력 조건 | 실제 프리필 | 실제 출력 | 상태 | n | RSS GiB | 풋프린트 GiB | 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 수정 전 | 4096 | 128 | short | 1440 | 23 | complete | 3 | 2.845 | 1.682 |  |
| 수정 전 | 4096 | 128 | near_full | 3817 | 48 | complete | 3 | 2.892 | 1.680 |  |
| 수정 후 | 4096 | 128 | short | 1440 | 23 | complete | 3 | 2.556 | 1.063 |  |
| 수정 후 | 4096 | 128 | near_full | 3817 | 48 | complete | 3 | 2.499 | 1.118 |  |
| 수정 전 | 4096 | 1024 | short | 1440 | 23 | complete | 3 | 3.145 | 2.466 |  |
| 수정 전 | 4096 | 1024 | near_full | 3817 | 48 | complete | 3 | 3.145 | 2.468 |  |
| 수정 후 | 4096 | 1024 | short | 1440 | 23 | complete | 3 | 2.747 | 1.598 |  |
| 수정 후 | 4096 | 1024 | near_full | 3817 | 48 | complete | 3 | 3.051 | 1.595 |  |
| 수정 전 | 8192 | 128 | short | 미수집 | 미수집 | failed | 1 | 2.782 | 2.889 | 앱 종료·메모리 원인 미확정 |
| 수정 전 | 8192 | 128 | near_full | 미수집 | 미수집 | failed | 1 | 2.688 | 2.734 | 앱 종료·메모리 원인 미확정 |
| 수정 후 | 8192 | 128 | short | 1440 | 23 | complete | 3 | 2.692 | 1.149 |  |
| 수정 후 | 8192 | 128 | near_full | 미수집 | 미수집 | failed_preparation | 1 | 0.742 | 0.650 | 캐시 삽입 SIGABRT 확인; 하위 원인 미확정 |
| 수정 전 | 8192 | 1024 | short | 미수집 | 미수집 | failed | 1 | 3.148 | 3.229 | 앱 종료·메모리 원인 미확정 |
| 수정 전 | 8192 | 1024 | near_full | 미수집 | 미수집 | failed | 1 | 3.128 | 3.218 | 앱 종료·메모리 원인 미확정 |
| 수정 후 | 8192 | 1024 | short | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 사용자 종료로 미실행 |
| 수정 후 | 8192 | 1024 | near_full | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 사용자 종료로 미실행 |


### E2B 8K long input

빌드 123470에서 입력 7918토큰을 프리필하고 49토큰을 생성했습니다. 3회 모두 새 앱 실행에서 완료됐으며, 충전을 분리하고 발열 상태가 정상일 때 앱 전체 프로세스의 최고값을 수집했습니다. 표의 수치는 실행별 최고값의 중앙값입니다. 이전 빌드 123462의 로드 실패는 위 표에 보존했습니다.

| 패치 | 용량 | 청크 | 입력 조건 | 실제 프리필 | 실제 출력 | 상태 | n | RSS GiB | 풋프린트 GiB | 실행별 근거 |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- |
| 수정 후 | 8192 | 128 | near_full | 7918 | 49 | complete | 3 | 2.770 | 1.152 | [실행별 값](/docs-beolmuri-ai/evidence/on-device-memory/iphone-e2b-8k-long-20261008.json) |


### iphone-e4b-ablation-native-cleanup-20261008

| 패치 | 용량 | 청크 | 입력 조건 | 실제 프리필 | 실제 출력 | 상태 | n | RSS GiB | 풋프린트 GiB | 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 수정 전 | 4096 | 128 | short | 미수집 | 미수집 | failed | 1 | 2.026 | 1.365 | unity_Error:generation_failed |
| 수정 전 | 4096 | 128 | near_full | 미수집 | 미수집 | failed | 1 | 2.242 | 1.359 | unity_Error:generation_failed |
| 수정 후 | 4096 | 128 | short | 1440 | 31 | complete | 3 | 3.136 | 1.297 |  |
| 수정 후 | 4096 | 128 | near_full | 3817 | 75 | complete | 3 | 3.152 | 1.315 |  |
| 수정 전 | 4096 | 1024 | short | 미수집 | 미수집 | failed | 1 | 2.490 | 1.421 | unity_Error:generation_failed |
| 수정 전 | 4096 | 1024 | near_full | 미수집 | 미수집 | failed | 1 | 2.345 | 1.418 | unity_Error:generation_failed |
| 수정 후 | 4096 | 1024 | short | 미수집 | 미수집 | failed | 1 | 2.346 | 1.330 | unity_Error:generation_failed |
| 수정 후 | 4096 | 1024 | near_full | 미수집 | 미수집 | failed | 1 | 2.529 | 1.478 | unity_Error:generation_failed |
| 수정 전 | 8192 | 128 | short | 미수집 | 미수집 | failed | 1 | 2.517 | 1.385 | unity_ModelRequired: |
| 수정 전 | 8192 | 128 | near_full | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 같은 8192 런타임 준비 실패로 입력 미실행 |
| 수정 후 | 8192 | 128 | short | 미수집 | 미수집 | failed | 1 | 2.436 | 1.402 | unity_ModelRequired: |
| 수정 후 | 8192 | 128 | near_full | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 같은 8192 런타임 준비 실패로 입력 미실행 |
| 수정 전 | 8192 | 1024 | short | 미수집 | 미수집 | failed | 1 | 2.412 | 1.367 | unity_ModelRequired: |
| 수정 전 | 8192 | 1024 | near_full | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 같은 8192 런타임 준비 실패로 입력 미실행 |
| 수정 후 | 8192 | 1024 | short | 미수집 | 미수집 | failed | 1 | 2.189 | 1.419 | unity_ModelRequired: |
| 수정 후 | 8192 | 1024 | near_full | 미수집 | 미수집 | not_run | 0 | 미수집 | 미수집 | 같은 8192 런타임 준비 실패로 입력 미실행 |


두 표의 RSS 증분과 풋프린트 증분은 미수집입니다. E2B 8192 수정 전 네 조건은 메모리 경고 뒤 앱이 사라졌지만 대응하는 Jetsam 원인은 없습니다. E4B 4096 실패는 생성 오류, 8192 실패는 준비 오류까지만 당시 기록으로 확인됩니다. E4B 수정 전 정상 결과가 없으므로 이 표로 패치 절감률을 계산하지 않습니다.

## E4B failure diagnostics

빌드 123467의 4096·1024 진단은 텐서 할당 오류를 확보했고 오류 직후 앱이 살아 있었습니다. 8192·128은 임베딩 식별자 계산에서 준비가 중단됐습니다. 빌드 123469에서 파일 읽기 임시 버퍼 수명을 수정한 뒤 준비와 임베딩 계산은 두 번 통과했지만 첫 프리필의 텐서 할당에 실패했습니다. 최신 8K 첫 답변의 정상 완료는 없습니다.

| 실행 | 빌드 | 용량/청크 | 입력 관측 | 상태 | RSS GiB | 풋프린트 GiB | 확인 수준 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| aa854967 | 123467 | 4096/1024 | 프리필 미수집; 제출 1442 | failed | 2.601 | 1.480 | 프리필 텐서 할당 실패 확인; 하위 allocator·요청 크기·OS 원인 미확정 |
| 25a29751 | 123467 | 8192/128 | 프리필 미수집; 제출 미수집 | failed | 2.523 | 1.364 | 임베딩 준비 실패 확인; 이 실행의 하위 오류 원문 없음 |
| c5a2e418 | 123468 | 8192/128 | 프리필 미수집; 제출 미수집 | failed | 2.448 | 1.363 | 임베딩 식별자 계산의 NSCocoaErrorDomain/256 확인; 하위 OS 원인 미확정 |
| 32c3601c | 123469 | 8192/128 | 프리필 미수집; 제출 1442 | failed | 2.291 | 1.354 | 준비 및 임베딩 계산 완료 후 프리필 텐서 할당 실패 확인; allocator·OS 원인 미확정 |
| 4bfc75bf | 123469 | 8192/128 | 프리필 1440; 제출 1442 | failed | 2.182 | 1.349 | 준비 및 임베딩 계산 완료 후 프리필 텐서 할당 실패 확인; allocator·OS 원인 미확정 |
| ae407d3b | None | 8192/128 | 프리필 미수집; 제출 미수집 | excluded_setup | 1.504 | 0.697 | 최종 3회 요약에 포함되지 않은 초기 기록; 모델 시험 결과로 사용하지 않음 |


콘솔 진단의 실제 계획은 입력 1440, 용량 8192, 청크 상한 128, 12개 그룹, 첫 서명 prefill_128입니다. 제출 계측 1442토큰과 혼용하지 않습니다. 실패 allocator·요청 바이트·OS 오류가 없어서 물리 RAM 부족, 가상 주소 공간 부족, 특정 allocator 문제 중 하나로 확정할 수 없습니다.

## Inference-only measurements

Unity를 포함하지 않는 추론 전용 앱도 프로세스 전체 수치입니다. RSS는 당시 미수집입니다. 프리필 청크는 기본 그래프 선택이며 128 고정과 같다고 가정하지 않습니다. n은 정상 완료 실행 수이며 별도로 남긴 초기 실행을 최신 반복군에 섞지 않습니다.

| 측정군 | 모델 | 패치 | 용량 | 실제 입력 | 실제 출력 | n | RSS GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| iphone-e4-confirmation:E4B:c4096:수정 후:dialogue | E4B | 수정 후 | 4096 | 75,85,166 | 29,33,30 | 3 | 미수집 | 0.648 | 0.633 |
| iphone-e4-confirmation:E4B:c4096:수정 후:near_window | E4B | 수정 후 | 4096 | 4010 | 32 | 1 | 미수집 | 1.178 | 1.163 |
| iphone-e4-first:E4B:c4096:수정 후:memory | E4B | 수정 후 | 4096 | 60,1730 | 32,32 | 1 | 미수집 | 1.266 | 1.251 |
| iphone-near-window:E2B:c4096:수정 후:near_window | E2B | 수정 후 | 4096 | 4010 | 32 | 3 | 미수집 | 0.976 | 0.960 |
| iphone-near-window:E4B:c4096:수정 후:near_window | E4B | 수정 후 | 4096 | 4010 | 32 | 3 | 미수집 | 1.178 | 1.163 |
| iphone-scale-ab:E2B:c4096:수정 전:memory | E2B | 수정 전 | 4096 | 60,1730 | 32,32 | 3 | 미수집 | 1.866 | 1.851 |
| iphone-scale-ab:E2B:c4096:수정 전:quality | E2B | 수정 전 | 4096 | 75,85,166 | 34,37,28 | 1 | 미수집 | 1.077 | 1.061 |
| iphone-scale-ab:E2B:c4096:수정 후:memory | E2B | 수정 후 | 4096 | 60,1730 | 32,32 | 3 | 미수집 | 1.063 | 1.048 |
| iphone-scale-ab:E2B:c4096:수정 후:quality | E2B | 수정 후 | 4096 | 75,85,166 | 34,37,28 | 1 | 미수집 | 0.450 | 0.435 |
| iphone-scale-ab:E2B:c8192:수정 후:memory | E2B | 수정 후 | 8192 | 60,1730 | 32,32 | 3 | 미수집 | 1.606 | 1.590 |
| iphone-scale-ab:E2B:c8192:수정 후:quality | E2B | 수정 후 | 8192 | 75,85,166 | 34,37,28 | 1 | 미수집 | 0.544 | 0.529 |


추론 전용 E2B 8192 수정 전은 1회 실패했고, 중단 전 풋프린트는 2.858GiB였습니다. 같은 시험의 수정 후 정상 3회 중앙값은 1.606GiB이지만 완료 상태가 달라 정상 완료끼리의 개선율로 해석하지 않습니다.

## Earlier application measurements

10월 6일 전체 문맥 시험은 출력 1024토큰을 실제 생성한 E2B 1.589GiB와 E4B 청크 128의 1.323GiB를 기록했습니다. 두 모델은 프리필 처리 단위도 달라 모델 크기만의 비교가 아닙니다. 이보다 앞선 E2B 패치 비교의 수정 전 2.480GiB는 중단 실행의 관측 최고값이고 수정 후 1.611GiB는 완료 실행입니다. 35.04%는 관측 최고값 차이이며 정상 완료 대칭 비교의 절감률이 아닙니다.

같은 10월 6일 E4B 4096 진단에서는 XNNPACK 확장 요청 152.008MiB에 ENOMEM, Mach 요청에 KERN_NO_SPACE가 기록됐습니다. 실패 시 주소 지도 최대 연속 빈 공간 101.828MiB가 요청보다 작았습니다. 이 특정 실행의 주소 공간 근거를 최신 8192 오류의 확정 원인으로 전이하지 않습니다.

### iphone-e4b-ablation-20261008

| 조건 | 상태 | n | 실제 프리필 | RSS GiB | 풋프린트 GiB | 사유 |
| --- | --- | --- | --- | --- | --- | --- |
| before-4096-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-4096-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-4096-128-short | failed | 1 | 미수집 | 1.391 | 0.697 | XNNPACK 가중치 캐시 삽입 중 SIGABRT |
| after-4096-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-4096-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-4096-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-4096-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-4096-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-8192-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-8192-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-8192-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-8192-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-8192-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| before-8192-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-8192-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |
| after-8192-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 초기 로드 충돌로 나머지 조건 미실행 |


### iphone-e4b-ablation-storage-cleared-20261008

| 조건 | 상태 | n | 실제 프리필 | RSS GiB | 풋프린트 GiB | 사유 |
| --- | --- | --- | --- | --- | --- | --- |
| before-4096-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-4096-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-4096-128-short | complete | 3 | 1440 | 3.118 | 1.284 |  |
| after-4096-128-near_full | complete | 3 | 3817 | 3.138 | 1.274 |  |
| before-4096-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-4096-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-4096-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-4096-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-8192-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-8192-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-8192-128-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-8192-128-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-8192-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| before-8192-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-8192-1024-short | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |
| after-8192-1024-near_full | not_run | 0 | 미수집 | 미수집 | 미수집 | 미실행 |


초기 E4B 캐시 충돌 후 별도 진단에서 디스크 여유 0.119946GiB와 실험 캐시 73개·66.395473GiB가 관찰됐습니다. 저장 공간 정리 뒤 여유 83.151093GiB 및 새 캐시 환경에서 정상 실행이 나왔지만 재설치도 함께 이루어졌습니다. 저장 공간 부족을 지지하는 근거이며, 과거 충돌의 쓰기 errno를 직접 확인한 것은 아닙니다. 이 값은 RAM이 아니라 디스크 수치입니다.

저장 공간 정리 후 폴더에는 E4B 요청이지만 실제 E2B를 실행한 1회가 있습니다. 아래 실행 색인에서는 실제 모델 E2B로 기록하며 E4B 정상 n에 합치지 않습니다. 발열·화면 제어·준비 실패도 모델 실패와 분리합니다.

## Run index

중복을 합친 실행은 146개입니다. n은 각 행 1입니다. 각 실행의 바이트값·실제 출력·시작점·검증 제외 사유·상대 근거 경로는 [iphone-tables.json](/docs-beolmuri-ai/evidence/on-device-memory/iphone-tables.json)에 있습니다. 절대값과 증분을 모두 아래에 남깁니다.

### iphone-e4-confirmation

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 071da22e | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 75,85,166 / 29,33,30 | complete | 미수집 | 미수집 | 0.649 | 0.634 |
| 3e1bb305 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 75,85,166 / 29,33,30 | complete | 미수집 | 미수집 | 0.648 | 0.633 |
| 164fd0a8 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 75,85,166 / 29,33,30 | complete | 미수집 | 미수집 | 0.648 | 0.633 |
| 995952a6 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 1.178 | 1.163 |


### iphone-e4-first

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 93724916 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.266 | 1.251 |


### iphone-near-window

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| d43fc66f | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 0.975 | 0.960 |
| f3bb6aed | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 0.976 | 0.961 |
| 6e165a97 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 0.976 | 0.960 |
| 220fd19f | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 1.178 | 1.163 |
| 8946539d | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 1.178 | 1.163 |
| ecd2ba1e | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 4010 / 32 | complete | 미수집 | 미수집 | 1.178 | 1.163 |


### iphone-other-attempts

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| d9475168 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 개별 요약에 미분류 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| e3f8a39e | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 개별 요약에 미분류 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| 06055e48 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 개별 요약에 미분류 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| 68162458 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 개별 요약에 미분류 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| c5811cb5 | E4B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 개별 요약에 미분류 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |


### iphone-scale-ab

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 049a02dc | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 전 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.866 | 1.851 |
| 4b16f147 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 전 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.866 | 1.850 |
| 272cee55 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 전 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.874 | 1.859 |
| a7fd149b | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 전 | 75,85,166 / 34,37,28 | complete | 미수집 | 미수집 | 1.077 | 1.061 |
| 48aa7b2b | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 0.974 | 0.958 |
| ce63cd6c | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.063 | 1.048 |
| a5d3da78 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.077 | 1.061 |
| 180c49c5 | E2B/추론 전용 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 75,85,166 / 34,37,28 | complete | 미수집 | 미수집 | 0.450 | 0.435 |
| 577aae0a | E2B/추론 전용 | 미확인 | 8192/기본 그래프 선택 | 수정 전 | 60 / 32 | failed | 미수집 | 미수집 | 2.858 | 2.843 |
| 80f6b1b5 | E2B/추론 전용 | 미확인 | 8192/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.610 | 1.594 |
| 6fea72a6 | E2B/추론 전용 | 미확인 | 8192/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.582 | 1.567 |
| c240a541 | E2B/추론 전용 | 미확인 | 8192/기본 그래프 선택 | 수정 후 | 60,1730 / 32,32 | complete | 미수집 | 미수집 | 1.606 | 1.590 |
| ac3ad589 | E2B/추론 전용 | 미확인 | 8192/기본 그래프 선택 | 수정 후 | 75,85,166 / 34,37,28 | complete | 미수집 | 미수집 | 0.544 | 0.529 |


### unity-product

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0a849819 | E2B/Unity 앱 | 123457 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.039 | 미수집 |
| 4c6f7edb | E2B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 0.287 | 미수집 |
| 58ecd52b | E2B/Unity 앱 | 123459 | 4096/기본 그래프 선택 | 수정 후 | 3071 / 1024 | complete | 미수집 | 미수집 | 1.611 | 미수집 |
| 173b9ea2 | E2B/Unity 앱 | 123463 | 4096/기본 그래프 선택 | 수정 전 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| 21448e6f | E2B/Unity 앱 | 123461 | 4096/기본 그래프 선택 | 수정 전 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 2.471 | 미수집 |
| 6906682b | E2B/Unity 앱 | 123460 | 4096/기본 그래프 선택 | 수정 전 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 2.481 | 미수집 |
| ad7cdf23 | E2B/Unity 앱 | 123463 | 4096/기본 그래프 선택 | 수정 전 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 2.479 | 미수집 |
| 13c75a7a | E2B/Unity 앱 | 123457 | 4096/기본 그래프 선택 | 수정 후 | 3056 / 206 | complete | 미수집 | 미수집 | 1.512 | 미수집 |
| 8355f25d | E2B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 2245,2374,2303 / 64,39,46 | complete | 미수집 | 미수집 | 1.609 | 미수집 |
| aa1b6ea3 | E2B/Unity 앱 | 123458 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.037 | 미수집 |
| c2bc9672 | E2B/Unity 앱 | 123464 | 4096/기본 그래프 선택 | 수정 후 | 3071 / 1024 | complete | 미수집 | 미수집 | 1.589 | 미수집 |
| d3de7878 | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.362 | 미수집 |
| 97b9fb46 | E4B/Unity 앱 | 미확인 | 4096/128 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 0.279 | 미수집 |
| b1e5cb59 | E4B/Unity 앱 | 미확인 | 4096/128 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 0.216 | 미수집 |
| 3ce88d84 | E4B/Unity 앱 | 미확인 | 4096/128 | 수정 후 | 미수집 / 미수집 | complete | 미수집 | 미수집 | 1.294 | 미수집 |
| 079e263a | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 0.249 | 미수집 |
| 9579bc1a | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.373 | 미수집 |
| 510a82a5 | E4B/Unity 앱 | 미확인 | 4096/128 | 수정 후 | 3071 / 1024 | complete | 미수집 | 미수집 | 1.323 | 미수집 |
| 028149d4 | E4B/Unity 앱 | 123464 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.334 | 미수집 |
| 19b7ea82 | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.339 | 미수집 |
| 4df58015 | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| 8af7a7c5 | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.340 | 미수집 |
| 9ca8c26a | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.361 | 미수집 |
| 7ae653cb | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.338 | 미수집 |
| c5c4a81b | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 1.338 | 미수집 |
| af307121 | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | setup_failed | 미수집 | 미수집 | 미수집 | 미수집 |
| 2ce7d98f | E4B/Unity 앱 | 미확인 | 4096/기본 그래프 선택 | 수정 후 | 미수집 / 미수집 | failed | 미수집 | 미수집 | 0.289 | 미수집 |


### iphone-e2b-ablation-20261007

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 06c22d98 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 1440 / 23 | complete | 2.936 | 미수집 | 1.598 | 미수집 |
| 09e7f40d | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 미수집 / 미수집 | excluded_setup | 1.409 | 미수집 | 1.068 | 미수집 |
| 0b7cee1c | E2B/Unity 앱 | 123459 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 1.666 | 미수집 | 1.178 | 미수집 |
| 0ec3f05c | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 3817 / 48 | complete | 3.146 | 미수집 | 2.466 | 미수집 |
| 1bb63b41 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 1440 / 23 | complete | 2.747 | 미수집 | 1.595 | 미수집 |
| 1bdd6566 | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 1440 / 23 | complete | 2.556 | 미수집 | 1.063 | 미수집 |
| 1edd2a50 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 1440 / 23 | complete | 3.205 | 미수집 | 2.466 | 미수집 |
| 24b42a12 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 3817 / 48 | complete | 3.030 | 미수집 | 2.470 | 미수집 |
| 24e322c7 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 미수집 / 미수집 | excluded_setup | 1.630 | 미수집 | 1.098 | 미수집 |
| 27ceec85 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 미수집 / 미수집 | excluded_setup | 1.758 | 미수집 | 1.080 | 미수집 |
| 2bc9ace4 | E2B/Unity 앱 | 123460 | 8192/128 | 수정 후 | 7918 / 49 | complete | 2.545 | 미수집 | 1.208 | 미수집 |
| 2ff9262d | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 3817 / 48 | complete | 2.950 | 미수집 | 1.681 | 미수집 |
| 333a0fb8 | E2B/Unity 앱 | 123462 | 8192/128 | 수정 전 | 미수집 / 미수집 | failed | 2.782 | 미수집 | 2.889 | 미수집 |
| 3b35e0f5 | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 3817 / 48 | complete | 2.844 | 미수집 | 1.680 | 미수집 |
| 3d175fa5 | E2B/Unity 앱 | 123460 | 4096/128 | 수정 후 | 1440 / 23 | complete | 2.591 | 미수집 | 1.145 | 미수집 |
| 409893eb | E2B/Unity 앱 | 123460 | 8192/1024 | 수정 후 | 7918 / 49 | complete | 3.199 | 미수집 | 2.092 | 미수집 |
| 44271017 | E2B/Unity 앱 | 123460 | 4096/1024 | 수정 후 | 1440 / 23 | complete | 2.754 | 미수집 | 1.610 | 미수집 |
| 455d12ed | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 3817 / 48 | complete | 2.278 | 미수집 | 1.118 | 미수집 |
| 4605b997 | E2B/Unity 앱 | 123462 | 8192/1024 | 수정 전 | 미수집 / 미수집 | failed | 3.148 | 미수집 | 3.229 | 미수집 |
| 48adf95e | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 1440 / 23 | complete | 2.589 | 미수집 | 1.086 | 미수집 |
| 490e0a0a | E2B/Unity 앱 | 123462 | 8192/128 | 수정 후 | 1440 / 23 | complete | 2.714 | 미수집 | 1.149 | 미수집 |
| 4f580eca | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 미수집 / 미수집 | excluded_setup | 1.723 | 미수집 | 1.109 | 미수집 |
| 5576d2d0 | E2B/Unity 앱 | 123460 | 4096/128 | 수정 전 | 3817 / 48 | complete | 2.802 | 미수집 | 1.690 | 미수집 |
| 587f891d | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 3817 / 48 | complete | 2.499 | 미수집 | 1.077 | 미수집 |
| 5ac9d82e | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 3817 / 48 | complete | 2.609 | 미수집 | 1.153 | 미수집 |
| 5ebec10f | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 3817 / 48 | complete | 2.892 | 미수집 | 1.679 | 미수집 |
| 5f36cb30 | E2B/Unity 앱 | 123462 | 4096/128 | 수정 후 | 1440 / 23 | complete | 2.536 | 미수집 | 1.057 | 미수집 |
| 637cb887 | E2B/Unity 앱 | 123460 | 4096/1024 | 수정 후 | 3817 / 48 | complete | 2.672 | 미수집 | 1.599 | 미수집 |
| 681f13ea | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 3817 / 48 | complete | 3.119 | 미수집 | 1.595 | 미수집 |
| 6f54df73 | E2B/Unity 앱 | 123460 | 8192/1024 | 수정 후 | 미수집 / 미수집 | failed | 1.531 | 미수집 | 1.126 | 미수집 |
| 70b73558 | E2B/Unity 앱 | 123461 | 8192/128 | 수정 후 | 미수집 / 미수집 | excluded_setup | 0.271 | 미수집 | 0.280 | 미수집 |
| 779fa0ed | E2B/Unity 앱 | 123460 | 4096/128 | 수정 전 | 1440 / 23 | complete | 2.477 | 미수집 | 1.684 | 미수집 |
| 78205b34 | E2B/Unity 앱 | 123459 | 8192/1024 | 수정 후 | 1440 / 23 | complete | 2.895 | 미수집 | 2.092 | 미수집 |
| 84e9aa74 | E2B/Unity 앱 | 123460 | 4096/128 | 수정 후 | 3817 / 48 | complete | 2.380 | 미수집 | 1.092 | 미수집 |
| 86c2441c | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 1440 / 23 | complete | 2.945 | 미수집 | 1.682 | 미수집 |
| 9ad03c1e | E2B/Unity 앱 | 123460 | 8192/1024 | 수정 후 | 미수집 / 미수집 | failed | 1.520 | 미수집 | 0.921 | 미수집 |
| 9b38d116 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 1440 / 23 | complete | 3.145 | 미수집 | 2.466 | 미수집 |
| 9ba8469e | E2B/Unity 앱 | 123460 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 1.700 | 미수집 | 1.191 | 미수집 |
| 9bd238bf | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 1440 / 23 | complete | 2.585 | 미수집 | 1.607 | 미수집 |
| 9c35fd66 | E2B/Unity 앱 | 123462 | 8192/128 | 수정 후 | 1440 / 23 | complete | 2.692 | 미수집 | 1.148 | 미수집 |
| 9d1d1088 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 1440 / 23 | complete | 3.108 | 미수집 | 2.465 | 미수집 |
| a7ca3515 | E2B/Unity 앱 | 123459 | 8192/128 | 수정 후 | 1440 / 23 | complete | 2.505 | 미수집 | 1.160 | 미수집 |
| a82e8a97 | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 1440 / 23 | complete | 2.737 | 미수집 | 1.678 | 미수집 |
| af786c38 | E2B/Unity 앱 | 123459 | 8192/1024 | 수정 후 | 1440 / 23 | complete_excluded | 2.944 | 미수집 | 2.097 | 미수집 |
| af79896e | E2B/Unity 앱 | 123460 | 8192/128 | 수정 후 | 미수집 / 미수집 | excluded_setup | 1.501 | 미수집 | 1.177 | 미수집 |
| b5970e40 | E2B/Unity 앱 | 123460 | 4096/1024 | 수정 전 | 3817 / 48 | complete | 3.252 | 미수집 | 2.471 | 미수집 |
| b91c2940 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 3817 / 48 | complete | 2.861 | 미수집 | 1.597 | 미수집 |
| bd8b96be | E2B/Unity 앱 | 123460 | 4096/128 | 수정 전 | 미수집 / 미수집 | failed | 1.810 | 미수집 | 1.101 | 미수집 |
| bed4947c | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 후 | 3817 / 48 | complete | 3.051 | 미수집 | 1.583 | 미수집 |
| c3cdff6b | E2B/Unity 앱 | 123462 | 8192/128 | 수정 후 | 1440 / 23 | complete | 2.494 | 미수집 | 1.169 | 미수집 |
| c5d7f7ba | E2B/Unity 앱 | 123460 | 4096/1024 | 수정 전 | 1440 / 23 | complete | 3.114 | 미수집 | 2.472 | 미수집 |
| c950be26 | E2B/Unity 앱 | 123462 | 4096/1024 | 수정 전 | 3817 / 48 | complete | 3.145 | 미수집 | 2.468 | 미수집 |
| ceb3aa94 | E2B/Unity 앱 | 123462 | 8192/128 | 수정 전 | 미수집 / 미수집 | failed | 2.688 | 미수집 | 2.734 | 미수집 |
| d164b888 | E2B/Unity 앱 | 123462 | 4096/128 | 수정 전 | 1440 / 23 | complete | 2.845 | 미수집 | 1.682 | 미수집 |
| d9a46a84 | E2B/Unity 앱 | 123460 | 4096/128 | 수정 후 | 미수집 / 미수집 | failed | 1.750 | 미수집 | 1.071 | 미수집 |
| dbc8d464 | E2B/Unity 앱 | 123462 | 8192/1024 | 수정 전 | 미수집 / 미수집 | failed | 3.128 | 미수집 | 3.218 | 미수집 |
| fdd08110 | E2B/Unity 앱 | 123462 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 0.742 | 미수집 | 0.650 | 미수집 |


| 1f09a8ab | E2B/Unity 앱 | 123460 | 8192/128 | 수정 전 | 미수집 / 미수집 | excluded_setup | 1.915 | 미수집 | 1.132 | 미수집 |

### iphone-e4b-ablation-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2a157cea | E4B/Unity 앱 | 123463 | 4096/128 | 수정 후 | 미수집 / 미수집 | failed | 1.391 | 미수집 | 0.697 | 미수집 |


### iphone-e4b-ablation-storage-cleared-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4098e4bf | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.138 | 미수집 | 1.274 | 미수집 |
| 46e900c7 | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.138 | 미수집 | 1.340 | 미수집 |
| 51ffa155 | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.222 | 미수집 | 1.257 | 미수집 |
| 810c843d | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 1440 / 31 | complete | 3.118 | 미수집 | 1.289 | 미수집 |
| 82fd4f8d | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 미수집 / 미수집 | excluded_setup | 0.276 | 미수집 | 0.280 | 미수집 |
| a43888ee | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 1440 / 31 | complete | 3.231 | 미수집 | 1.284 | 미수집 |
| af1a3b49 | E2B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 1440 / 23 | complete_excluded | 2.623 | 미수집 | 1.064 | 미수집 |
| ba2c3ae4 | E4B/Unity 앱 | 123464 | 4096/128 | 수정 후 | 1440 / 31 | complete | 3.117 | 미수집 | 1.248 | 미수집 |


### iphone-e4b-ablation-native-cleanup-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0b8ab93c | E4B/Unity 앱 | 123465 | 4096/128 | 수정 전 | 미수집 / 미수집 | failed | 2.026 | 미수집 | 1.365 | 미수집 |
| 186f460b | E4B/Unity 앱 | 123465 | 4096/1024 | 수정 후 | 미수집 / 미수집 | failed | 2.529 | 미수집 | 1.478 | 미수집 |
| 2f694fc6 | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 1440 / 31 | complete | 2.969 | 미수집 | 1.338 | 미수집 |
| 4d9e966c | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 1440 / 31 | complete | 3.136 | 미수집 | 1.297 | 미수집 |
| 5d734179 | E4B/Unity 앱 | 123465 | 4096/128 | 수정 전 | 미수집 / 미수집 | failed | 2.242 | 미수집 | 1.359 | 미수집 |
| 61af7c01 | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 1440 / 31 | complete | 3.197 | 미수집 | 1.269 | 미수집 |
| 6d5a1b30 | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.152 | 미수집 | 1.312 | 미수집 |
| 7f738500 | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.030 | 미수집 | 1.341 | 미수집 |
| 80e15f81 | E4B/Unity 앱 | 123465 | 8192/1024 | 수정 후 | 미수집 / 미수집 | failed | 2.189 | 미수집 | 1.419 | 미수집 |
| 81eae01c | E4B/Unity 앱 | 123465 | 4096/1024 | 수정 후 | 미수집 / 미수집 | excluded_setup | 2.274 | 미수집 | 1.242 | 미수집 |
| becfe90d | E4B/Unity 앱 | 123465 | 4096/1024 | 수정 전 | 미수집 / 미수집 | failed | 2.345 | 미수집 | 1.418 | 미수집 |
| d433a73c | E4B/Unity 앱 | 123465 | 4096/1024 | 수정 전 | 미수집 / 미수집 | failed | 2.490 | 미수집 | 1.421 | 미수집 |
| d6a25dde | E4B/Unity 앱 | 123465 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 2.436 | 미수집 | 1.402 | 미수집 |
| e4862c0d | E4B/Unity 앱 | 123465 | 4096/128 | 수정 후 | 3817 / 75 | complete | 3.153 | 미수집 | 1.315 | 미수집 |
| e66a7089 | E4B/Unity 앱 | 123465 | 8192/128 | 수정 전 | 미수집 / 미수집 | failed | 2.517 | 미수집 | 1.385 | 미수집 |
| ea22c688 | E4B/Unity 앱 | 123465 | 4096/1024 | 수정 후 | 미수집 / 미수집 | failed | 2.346 | 미수집 | 1.330 | 미수집 |
| ede8dfe8 | E4B/Unity 앱 | 123465 | 8192/1024 | 수정 전 | 미수집 / 미수집 | failed | 2.412 | 미수집 | 1.367 | 미수집 |


### iphone-e4b-failure-diagnosis-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aa854967 | E4B/Unity 앱 | 123467 | 4096/1024 | 수정 후 | 미수집 / 미수집 | failed | 2.601 | 미수집 | 1.480 | 미수집 |


### iphone-e4b-8192-prefill128-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 25a29751 | E4B/Unity 앱 | 123467 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 2.523 | 미수집 | 1.364 | 미수집 |


### iphone-e4b-8192-embedding-diagnosis-20261008

| 실행 | 모델/방식 | 빌드 | 용량/청크 | 패치 | 실제 프리필/출력 | 상태 | RSS GiB | RSS 증분 GiB | 풋프린트 GiB | 풋프린트 증분 GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| c5a2e418 | E4B/Unity 앱 | 123468 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 2.448 | 미수집 | 1.363 | 미수집 |
| 32c3601c | E4B/Unity 앱 | 123469 | 8192/128 | 수정 후 | 미수집 / 미수집 | failed | 2.291 | 미수집 | 1.354 | 미수집 |
| 4bfc75bf | E4B/Unity 앱 | 123469 | 8192/128 | 수정 후 | 1440 / 미수집 | failed | 2.182 | 미수집 | 1.349 | 미수집 |
| ae407d3b | E4B/Unity 앱 | 미확인 | 8192/128 | 수정 후 계획 | 미수집 / 미수집 | excluded_setup | 1.504 | 미수집 | 0.697 | 미수집 |


## Failure classification corrections

E2B의 fdd08110 실행은 CSV에서 로드 중 종료·원인 미확정으로 분류했지만, 후속 load-failure-classification.json에는 SIGABRT와 XNNPACK 가중치 캐시 삽입 실패가 확인돼 있습니다. 이 근거집은 후속 확인 범위를 반영합니다. 디스크 부족 등 하위 실패 원인은 여전히 미확정입니다. CSV에 없는 1f09a8ab 실행은 UI 전송 실패와 취소로 측정을 시작하지 못한 사례이므로 별도 색인했습니다.

## Coverage and validation

- E2B 빌드 123462의 패치 후 8192·128 near_full은 로드 중 중단됐습니다. 빌드 123470에서는 같은 용량과 청크로 거의 찬 입력을 3회 완료했습니다. 빌드가 다르므로 두 결과를 같은 반복군으로 합치지 않았습니다. 8192·1024의 두 입력은 미실행입니다.
- E4B 8192의 임베딩 수정 후 near_full, 정상 첫 답변, 긴 디코드 완료는 미검증입니다.
- 최신 Unity 수치의 시작점 대비 최고 RSS·풋프린트 증분이 필요하면 시작 경계의 정의를 먼저 통일하고 원본 샘플에서 별도 계산해야 합니다.
- 최신 E2B/E4B를 같은 계측 빌드와 실제 입력·출력 길이로 재비교하지 않았습니다. 출력 상한 256은 실제 256토큰 생성과 다릅니다.
- 순수 가중치·KV·활성값 분해와 메모리 최고 상한, 장시간 안정성, 전력은 이 표로 증명하지 않습니다.
- 최초 미분류 추론 전용 준비 실패 5건과 임베딩 진단 초기 미완료 1건은 색인에는 남기되 모델 성능 비교에서 제외합니다.
- XNNPACK 수식 프로브 루트의 4096/8192 요청 바이트 수는 Mac에서 계산한 할당 요청이며 iPhone RAM 실측이 아닙니다. 하위 iPhone 실측은 중복을 제거해 위 표에 포함했습니다.

## Archive index

| 폴더 | 참조된 고유 실행 수 | 설명 |
| --- | --- | --- |
| memory-audit-20261007 | 56 | memory-audit의 iPhone 56개 실행은 과거 원본 집계와 동일 ID로 합칩니다. |
| iphone-e2b-ablation-20261007 | 58 | CSV 57개와 별도 UI 제어 실패 1개 |
| iphone-e2b-8k-long-20261008 | 3 | 빌드 123470의 7918토큰 프리필·49토큰 출력 반복 측정 |
| iphone-e4b-ablation-20261008 | 1 |  |
| iphone-e4b-ablation-storage-cleared-20261008 | 8 |  |
| iphone-e4b-ablation-native-cleanup-20261008 | 17 |  |
| iphone-e4b-failure-diagnosis-20261008 | 1 |  |
| iphone-e4b-8192-prefill128-20261008 | 1 |  |
| iphone-e4b-8192-embedding-diagnosis-20261008 | 4 |  |
| product-xnnpack-full-context-20261006 | 5 |  |
| product-xnnpack-longest-20261006 | 3 |  |
| product-e2b-e4b-full-context-20261006 | 2 |  |
| xnnpack-formula-probe-20261005 | 29 | 루트 수식 프로브는 Mac 계산 검증입니다. 하위 iPhone 시험은 memory-audit와 중복 병합합니다. |


집계 검증 범위는 [근거 자료 안내](/docs-beolmuri-ai/evidence/on-device-memory/archive/#coverage-and-corrections)에 정리했습니다.

## Failed and excluded runs

| 실행 | 상태 | 실패·제외 원인과 확정 범위 |
| --- | --- | --- |
| d9475168 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 주요 비교표에서 제외. 수집이 시작되지 않은 재연결 시도도 보존 |
| e3f8a39e | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 주요 비교표에서 제외. 수집이 시작되지 않은 재연결 시도도 보존 |
| 06055e48 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 주요 비교표에서 제외. 수집이 시작되지 않은 재연결 시도도 보존 |
| 68162458 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 주요 비교표에서 제외. 수집이 시작되지 않은 재연결 시도도 보존 |
| c5811cb5 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 주요 비교표에서 제외. 수집이 시작되지 않은 재연결 시도도 보존 |
| 577aae0a | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; 단위는 앱 전체 phys_footprint. 순수 가중치나 활성값을 분리한 지표가 아님 |
| 0a849819 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 4c6f7edb | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 173b9ea2 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 동일 입력 제출, 네이티브 출력 완료 없음. 전체 실험 최고값을 확정할 수 없음 |
| 21448e6f | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 동일 입력 제출, 네이티브 출력 완료 없음. 전체 실험 최고값을 확정할 수 없음 |
| 6906682b | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 동일 입력 제출, 네이티브 출력 완료 없음. 전체 실험 최고값을 확정할 수 없음 |
| ad7cdf23 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 동일 입력 제출, 네이티브 출력 완료 없음. 전체 실험 최고값을 확정할 수 없음 |
| aa1b6ea3 | failed | 준비 이벤트에서 token_budget_exceeded 확인; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| d3de7878 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 97b9fb46 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| b1e5cb59 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 3ce88d84 | complete | 성공; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 079e263a | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 9579bc1a | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 028149d4 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 19b7ea82 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 4df58015 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값 |
| 8af7a7c5 | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 9ca8c26a | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 7ae653cb | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| c5c4a81b | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| af307121 | setup_failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 2ce7d98f | failed | 기존 기록의 실패 상태만 확인; 개별 진단은 별도 근거 참조; Unity·검색 임베딩·추론을 포함한 앱 전체의 관측 최고값; 진단 코드 또는 디버거를 사용한 실행. 정상 앱 비교에서 제외 |
| 09e7f40d | excluded_setup | thermalState stayed fair; nominal was required. No turn_start occurred.;  |
| 0b7cee1c | failed | 실패 단계 기록; 하위 원인 미확정;  |
| 24e322c7 | excluded_setup | Session was ready but thermalState stayed fair; nominal was required for admission. No turn_start occurred.;  |
| 27ceec85 | excluded_setup | thermalState stayed fair; nominal was required. No turn_start occurred.;  |
| 333a0fb8 | failed | Memory warning preceded loss of the recorded PID; no matching Jetsam reason was collected. Peak values cover only the surviving samples.;  |
| 4605b997 | failed | Memory warning preceded disappearance of the recorded PID; no matching Jetsam reason was collected. Peak values cover only surviving samples.;  |
| 4f580eca | excluded_setup | Nominal initial thermal admission was not met; no turn_start was recorded.;  |
| 6f54df73 | failed | Navigation transport error before measurement; explicit cancellation requested.;  |
| 70b73558 | excluded_setup | App navigation was not confirmed; no inference result;  |
| 9ad03c1e | failed | Splash navigation transport error before measurement; explicit cancellation requested.;  |
| 9ba8469e | failed | 실패 단계 기록; 하위 원인 미확정;  |
| af786c38 | complete_excluded | Navigation command was unresolved when start was requested; preserve as pilot, rerun after acknowledged navigation.;  |
| af79896e | excluded_setup | App navigation was not confirmed; no inference result;  |
| bd8b96be | failed | Remote splash tap failed before measurement; original logs preserved.;  |
| ceb3aa94 | failed | Memory warning preceded disappearance of the recorded PID; no matching Jetsam reason was collected. Peak values cover only surviving samples.;  |
| d9a46a84 | failed | 실패 단계 기록; 하위 원인 미확정;  |
| dbc8d464 | failed | Memory warning preceded disappearance of the recorded PID; no matching Jetsam reason was collected. Peak values cover only surviving samples.;  |
| fdd08110 | failed | 후속 심볼화에서 SIGABRT 및 MMapWeightCacheProvider::LookUpOrInsert 캐시 삽입 실패 확인; 디스크 부족 등 하위 원인은 미확정; CSV의 초기 원인 미확정 분류보다 후속 심볼화 파일의 확인 범위를 우선합니다. |
| 2a157cea | failed | Matching PID/build and symbolicated crash frames identify an abort in MMapWeightCacheProvider::LookUpOrInsert. No completed model load or inference. No Jetsam termination in this crash report; underlying cache operation failure is not established. No retry.;  |
| 82fd4f8d | excluded_setup | App preparation failed before inference. Not an E4B memory failure.;  |
| af1a3b49 | complete_excluded | Retained as an E2B reference, excluded from all E4B comparisons. Runtime event directly confirms actual model file.; 요청 E4B와 실제 E2B 불일치; E4B 측정으로 사용하지 않음 |
| 0b8ab93c | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| 186f460b | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| 5d734179 | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| 80e15f81 | failed | The observed E4B CPU runtime failed model preparation before input submission. Native failure details were not collected; no model retry is performed.;  |
| 81eae01c | excluded_setup | Readiness or control failed; preserve collected records without marking inference complete.;  |
| becfe90d | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| d433a73c | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| d6a25dde | failed | The observed E4B CPU runtime failed model preparation before input submission. Native failure details were not collected; no model retry is performed.;  |
| e66a7089 | failed | The observed E4B CPU runtime failed model preparation before input submission. Native failure details were not collected; no model retry is performed.;  |
| ea22c688 | failed | The product reported a generation failure; the native error text was not collected. No retry is performed.;  |
| ede8dfe8 | failed | The observed E4B CPU runtime failed model preparation before input submission. Native failure details were not collected; no model retry is performed.;  |
| aa854967 | failed | 프리필 텐서 할당 실패 확인; 하위 allocator·요청 크기·OS 원인 미확정; 하네스 수집 종료 후 pid_absent와 오류 직후 앱 생존을 구분합니다. |
| 25a29751 | failed | 임베딩 준비 실패 확인; 이 실행의 하위 오류 원문 없음; 하네스 수집 종료 후 pid_absent와 오류 직후 앱 생존을 구분합니다. |
| c5a2e418 | failed | 임베딩 식별자 계산의 NSCocoaErrorDomain/256 확인; 하위 OS 원인 미확정;  |
| 32c3601c | failed | 준비 및 임베딩 계산 완료 후 프리필 텐서 할당 실패 확인; allocator·OS 원인 미확정;  |
| 4bfc75bf | failed | 준비 및 임베딩 계산 완료 후 프리필 텐서 할당 실패 확인; allocator·OS 원인 미확정; 콘솔 부착 실행은 속도 비교 제외 |
| ae407d3b | excluded_setup | 최종 3회 요약에 포함되지 않은 초기 기록; 모델 시험 결과로 사용하지 않음; 설정은 디렉터리 계획 기준이며 이 요약에서 실제 런타임은 확인하지 않음 |
| 1f09a8ab | excluded_setup | UI 전송 실패 뒤 취소. 모델 로드는 완료됐지만 측정·생성은 시작하지 않음.; 기존 measurements.csv에는 없지만 analysis 요약 및 validity에 남아 있는 별도 실행입니다. |

## Application system telemetry

E4B 빌드 123465, 패치 후 4096·청크 128의 정상 실행에서 수집한 기기 통계입니다. 각 열은 실행별 최소 또는 최대값을 구한 뒤 3회의 중앙값으로 묶었습니다. 서로 다른 시점의 극값이며, 행의 숫자를 더해 앱 한도나 기기 사용량을 계산하지 않습니다. 단위는 GiB입니다.

| 조건 | n | 앱 한도 여유 최소 | 기기 빈 페이지 최소 | 파일 기반 페이지 최소 | 압축 물리 크기 최대 | 압축 전 논리 크기 최대 | 압박 이벤트 합계 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 짧은 입력 | 3 | 2.049 | 0.039 | 1.767 | 1.857 | 5.564 | 0 |
| 긴 입력 | 3 | 2.045 | 0.034 | 1.788 | 1.889 | 5.521 | 0 |

기기 VM 수치는 다른 프로세스의 활동도 포함합니다. 이 표의 이벤트 0은 관측 구간의 통지 횟수입니다. 다른 실패 실행과 이전 수집값은 [system-memory-tables.json](/docs-beolmuri-ai/evidence/on-device-memory/system-memory-tables.json)에 보존했습니다.
