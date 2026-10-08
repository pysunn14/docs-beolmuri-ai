---
title: Device Memory Policies
---

[본문으로 돌아가기](/docs-beolmuri-ai/?doc=optimization-on-device-memory)

검토 기준일은 2026-10-08입니다. 직접 실측, 외부 보고와 공식 정책을 표에서 구별합니다.

## iOS limits and entitlements

`os_proc_available_memory()`는 호출 시점의 앱 한도에서 풋프린트를 뺀 바이트 수를 반환합니다. 따라서 가까운 시점의 `phys_footprint`를 더해 한도를 추정할 수 있습니다. 앱 생명주기 중 한도가 바뀔 수 있으며 기기의 남은 물리 RAM과 다릅니다. RSS를 더하는 계산으로 바꾸지 않습니다. [Apple API 정의](https://developer.apple.com/documentation/os/os_proc_available_memory)

`Increased Memory Limit`은 iOS 15 이상에서 지원 기기의 기본 한도 확대를 요청합니다. 모든 모델에 적용되는 고정 증가량은 문서에 없습니다. `Extended Virtual Addressing`은 iOS 14 이상에서 주소 공간을 넓힙니다. 추가 물리 메모리 권한과 분리합니다. 개발용 권한인 `Increased Debugging Memory Limit`은 개발·ad hoc·TestFlight 내부 배포에 사용할 수 있고, 출시 후보를 배포하기 전에 제거해야 합니다. [한도 확대](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.kernel.increased-memory-limit), [주소 공간 확대](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.kernel.extended-virtual-addressing), [내부 검증 권한](https://developer.apple.com/help/glossary/increased-debugging-memory-limit/)

### Recent iPhone evidence

외부 보고의 MB·GB는 원문 단위를 유지합니다. 진법이 명시되지 않은 수치를 GiB로 임의 환산하지 않습니다. 추가 권한이 적용된 값을 기본 한도와 같은 열로 비교하지 않습니다.

| 기기 | OS | RAM 근거 | 수치와 종류 | 권한·측정 조건 | 증거 수준 |
|---|---|---|---|---|---|
| iPhone 17 일반형 | iOS 26.6.2 | 기기 API 7.492GiB | **한도 추정 3.296875~3.296906GiB** | 모델·Unity 없는 전면 카나리, 풋프린트+한도 여유 | 기존 직접 실측에서 계산 |
| iPhone 16 Pro Max | 미기재 | 작성자 8GB | 약 6144MB | Increased Memory Limit, 풋프린트+한도 여유 | 외부 측정 보고 |
| iPhone 17 Pro Max | 미기재 | 작성자 12GB | 약 6144MB | Increased Memory Limit, 풋프린트+한도 여유 | 외부 측정 보고 |
| iPhone 17 Pro | 미기재 | 작성자 12GB | 약 6.4GB | Increased Memory Limit; footprint 2.2GB, headroom 4.2GB 보고 | 외부 측정 보고, 동시 원본 없음 |
| iPhone SE 3 | 미기재 | 작성자 4GB | 약 2GB라는 주장 | 권한·API 한도·Jetsam 원본 없음 | 한도 미확인 |
| iPhone 18 Pro / Pro Max | 한도 측정 OS 없음 | 이 조사에서 RAM 검증 안 함 | 미확인 | 출시 공지만 확인 | 한도 미확인 |

17 일반형 카나리의 11쌍은 3,539,992,576~3,540,025,344바이트입니다. 표본 연결의 최대 시간 차이는 0.21775ms이며 원자적 동시 측정은 아닙니다. 카나리의 풋프린트는 약 7.5~8.9MiB 수준으로, 한도까지 할당한 종료 실험이 아닙니다. 기존 보고의 기본 설정을 회수했으며, 이번 조사에서는 서명 권한 파일을 다시 검증하지 않았습니다. 수치의 집계와 원문 링크는 [device-policy-tables.json](/docs-beolmuri-ai/evidence/on-device-memory/device-policy-tables.json)에 있습니다.

16·17 Pro Max는 [Apple 포럼의 동일 작성자 보고](https://developer.apple.com/forums/thread/834805)입니다. [MLX PR 343](https://github.com/ml-explore/mlx-swift-lm/pull/343)은 연결된 같은 실험이므로 독립 재현으로 세지 않습니다. 17 Pro는 [CoreAI의 실제 기기 결과](https://github.com/john-rocky/coreai-model-zoo/blob/main/models/gemma4-e4b/README.md)를 인용했습니다. SE 3 글의 첨부 실패 로그는 저장 공간 부족이고 2GB Jetsam은 작성자의 주장입니다. 이를 확인된 메모리 종료로 옮기지 않습니다. [SE 3 원문](https://developer.apple.com/forums/thread/816847)

iPhone 18 Pro의 발표일은 공식 페이지에서 2026-09-09로 확인했습니다. 이 날짜와 제품 존재는 확인됐지만 앱 메모리 한도는 확인되지 않았습니다. [Apple 발표](https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/)

같은 17 Pro Max 보고에서 권한을 비교한 값은 아래와 같습니다. OS 버전과 MB의 진법은 원문에 없습니다. [권한 비교 원문](https://developer.apple.com/forums/thread/834805)

| 적용 권한 | 보고된 한도 |
|---|---:|
| Increased Memory Limit | 약 6144MB |
| 위 권한 + Extended Virtual Addressing | 약 6144MB |
| Increased Memory Limit + Increased Debugging Memory Limit | 약 6656MB |

### Historical allocation tests

아래 표는 동일한 실험 도구를 사용한 과거 결과 모음에서 회수했습니다. 도구는 1,048,576바이트씩 `malloc`하고 `memset`하여 페이지를 사용합니다. 따라서 원문의 MB 할당 카운터는 MiB로 해석할 수 있습니다. 값은 종료 직전 할당량이며 전체 풋프린트나 현재 OS의 API 한도가 아닙니다. 권한 적용 여부는 미기재입니다. [측정 결과 모음](https://stackoverflow.com/questions/5887248/ios-app-maximum-memory-budget/15200855), [측정 코드](https://github.com/Split82/iOSMemoryBudgetTest/blob/master/MemoryTest/ViewController.m)

| 기기 | 당시 OS | 종료 전 할당량, MiB | GiB 환산 |
|---|---|---:|---:|
| iPhone X | iOS 11.2.1 | 1392 | 1.359 |
| iPhone XR | iOS 12.1 | 1792 | 1.750 |
| iPhone XS | iOS 12.1 | 2040 | 1.992 |
| iPhone XS Max | iOS 12.1 | 2039 | 1.991 |
| iPhone 11 | iOS 13.1.3 | 2068 | 2.020 |
| iPhone 11 Pro Max | iOS 13.2.3 | 2067 | 2.019 |
| iPhone 12 Pro | iOS 16.1 | 3054 | 2.982 |

## Android memory policies

Java·Kotlin의 관리 힙과 native 메모리의 사용량을 분리해야 합니다. `getMemoryClass()`와 `getLargeMemoryClass()`는 관리 힙의 크기 등급이며, Unity·LLM native 할당·매핑을 모두 합친 PSS/RSS 상한이 아닙니다. `largeHeap`도 Dalvik/ART 힙 설정입니다. [관리 힙 설명](https://developer.android.com/topic/performance/memory-overview), [largeHeap 정의](https://developer.android.com/guide/topics/manifest/application-element.html#largeHeap)

### Android 17 Memory Limiter

공식 표는 **기기별 실측이 아닌 플랫폼 정책**입니다. Android 17 이상에서 cgroup v2의 `memory.high`와 `memory.swap.max`를 사용합니다. `memory.high`는 회수·실행 지연을 유발하는 소프트 한도이므로 그 숫자를 넘는 순간의 PSS 종료선으로 읽으면 안 됩니다. [AOSP Memory Limiter](https://source.android.com/docs/core/perf/memory-limiter)

| 목표 물리 RAM 표기 | 커널 MemTotal 범위, MiB | 화면에 보임: memory.high, MiB | 보이지 않음: memory.high, MiB | 보임: swap.max, MiB | 보이지 않음: swap.max, MiB |
|---|---:|---:|---:|---:|---:|
| 4GB | 3200 이상, 4800 미만 | **2048** | **1024** | 1024 | 1024 |
| 6GB | 4800 이상, 6800 미만 | **4096** | **2048** | 2048 | 2048 |
| 8GB | 6800 이상, 9216 미만 | 5120 | 3072 | 3072 | 3072 |
| 12GB | 9216 이상, 14336 미만 | 8192 | 4096 | 4096 | 4096 |
| 16GB | 14336 이상, 18432 미만 | 10240 | 5120 | 5120 | 5120 |

선택 기준은 하드웨어 예약 영역을 제외한 커널 `MemTotal`입니다. 일반 앱 프로세스가 대상이며 `FOREGROUND_SERVICE`는 화면에 보이지 않는 분류입니다. 캐시 상태는 별도로 동결·회수합니다. 이 표를 특정 Galaxy·Pixel 출하 이미지에 대입한 실측은 이번 자료에 없습니다. 공식 상태 조회 명령은 `adb shell am memory-limiter status`이며 이번 조사에서는 실행하지 않았습니다. [AOSP 정책과 상태 조회](https://source.android.com/docs/core/perf/memory-limiter)

Android 17의 변경은 앱의 `targetSdkVersion`과 무관합니다. 한도로 종료된 세션은 `ApplicationExitInfo`의 `REASON_OTHER`와 설명의 `MemoryLimiter:AnonSwap`으로 구분할 수 있습니다. [Android 17 변경 사항](https://developer.android.com/about/versions/17/behavior-changes-all)

### Feature availability

이름이 비슷한 세 기능은 적용 주체와 동작이 다릅니다. 특히 PMGD의 예제 숫자를 일반 앱의 메모리 상한으로 가져오지 않습니다.

| 기능 | 공식 지원 범위 | 대상·설정 주체 | 한도에 도달했을 때 |
|---|---|---|---|
| Memory Limiter | Android 17 이상, cgroup v2 memory controller 필요 | 일반 앱 프로세스, RAM 구간·화면 노출 상태로 플랫폼이 설정 | 회수·스왑·지연 후 극단적 상황에서 종료 |
| PMGD | Android 17 이상 | OEM 설정에 열거한 프로세스, SELinux 허용 필요 | 익명 메모리 한도 초과 또는 유예 후 회수 실패 시 종료 |
| App memory budgets | Android 17 QPR2, API 37.2 | 앱의 manifest·SDK·NDK로 더 작은 예산 설정 | 사용하지 않는 페이지를 회수·스왑; 예산 초과 자체로 종료하지 않음 |

PMGD는 OEM이 지정한 프로세스의 cgroup을 감시합니다. 공식 예제는 `system_server`이며 일반 앱 전체를 뜻하지 않습니다. [PMGD 정의](https://source.android.com/docs/core/perf/pmgd)

App memory budgets는 Memory Limiter와 별도입니다. 문서는 Android 17 QPR2 Beta 이미지로 검증하도록 안내합니다. 앱 예산은 cgroup `memory.current` 기준이며 관리 힙 또는 전체 PSS와 다릅니다. `MemoryBudgetManager`의 예산 조회 기능을 Android 17 기본 Memory Limiter의 일반 한도 조회 API로 소급해 쓰지 않습니다. [App memory budgets](https://developer.android.com/topic/performance/memory/app-memory-budgets)

### External Android heap reports

확보한 아래 값은 **관리 힙의 외부 로그**이며, native/PSS/RSS의 기기별 고정 cap 표를 채우는 근거로 사용하지 않습니다. 앱 사용 실패와 메모리 한도 값이 같은 로그에 있다는 이유만으로 한도 초과를 원인으로 확정하지 않습니다.

| 기기·OS | 로그의 값 | 측정법·권한 | 해석과 한계 |
|---|---|---|---|
| Pixel 7a, Android 16 / API 36 | 256MB, large 512MB; RAM 7.82GB 표기 | 앱 진단 로그, root 없음 | 관리 힙 등급으로 분리. 실제 보고 실패는 PNG 처리 오류이며 native cap 아님 |
| Galaxy M32 4G라고 보고, Android 13 | ART growth limit 536,870,912바이트 = 512MiB; RAM 6GB 주장 | OutOfMemoryError 원문, 권한 미기재 | 관리 힙 한도. 본문 기기명과 로그 모델 코드의 정합성도 미확인 |

[Pixel 7a 로그](https://github.com/ReVanced/revanced-manager/issues/3334), [Galaxy 보고 로그](https://github.com/Sketchware-Pro/Sketchware-Pro/issues/1811)
