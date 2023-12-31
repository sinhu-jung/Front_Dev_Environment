# NPM

## 프론트엔드 개발에 Node.js 가 필요한 이유

1. 최신 스펙으로 개발할 수 있다.

```
편리한 스펙이 나오더라도 이것을 구현해 주는 징검다리 역할, 즉 바벨 같은 도구의 도움 없이는 부족하며
웹팩, NPM같은 노드 기술로 만들어진 환경에서 사용할 때 비로소 자동화된 프론트엔드 개발환경을 갖출 수 있다.

또한 TS, SASS 같은ㄴ 고수준 프로그래밍 언어를 사용하려면 전용 트랜스파일러가 필요하다.
이것들 역시 Node.js 환경이 뒷받침 되어야 프론트엔드 개발 환경을 만들 수 있다.
```

2. 빌드 자동화

```
과거처럼 코딩 결과물을 브라우져에 바로 올리는 경우는 흔치 않다. 파일을 합축하고, 코드를 난독화하고,
폴리필을 추가하는 등 개발 이외의 작업을 거친 후 배포한다. Node.js는 이러한 일련의 빌드 과정을 이해하는데
적지 않은 역할을 한다.
뿐만 아니라 라이브러리 의존성을 해결하고, 각종 테스트를 자동화 하는데도 사용된다.
```

3. 개발 환경 커스터마이징

```
React.js의 CRA(create-react-app), Vuejs의 vue-cli 를 사용 하는 것 처럼
각 프레임워크에서 제공하는 도구를 사용하면 손쉽게 개발환경을 갖출수 있다.
하지만 개발 프로젝트는 각자의 형편이라는 것이 있어서 툴을 그대로 사용할 수 없는 경우도 빈번하다.
커스터마이징 하려면 Node.js 지식이 필요하다.
자동화된 도구를 사용할 수 없는 환경이라면 직접 환경을 구축해야 할 상황에 놓일 수도 있다.
```

위와 같은 배경하에 Node.js 는 프론트엔드 개발에서 필수 기술로 자리매김하고 있다.

## Node.js 설치

- https://nodejs.org/ko 로 가서 운영체제 별로 설치파일을 다운받으면 된다.
- 두가지 버전을 선택하여 설치 할 수 있다.
  - 짝수 버전: 안정적, 신뢰도 높음 (LTS)
  - 홀수 버전: 최신 기능

## Node

- node 설치 후 터미널에 node를 입력하면 node 터미널 도구가 실행이 된다.

  - 터미널 도구를 줄여서 REPL 이라고 부르며 js 코드를 실행하고 즉시 결과를 실행 할 수 있는 프로그램이다.
  - 종료 하려면 exit 를 입력하여 나올 수 있다.

- node --version 을 입력 하면 현재 설치 돼 있는 node 버전을 확인 할 수 있다.

## NPM

- node 를 설치하고 나면 하나 더 설치 되는게 있는데 npm 이라고 하는 도구다.
- 터미널에 npm 을 입력하면 사용법을 알려주고 종료 하는 로직이 실행이 된다.
- npm --version 을 입력하면 npm의 버전을 확인 할 수 있다.
- 디렉토리 생성후 npm init을 입력하면 package.json 이라는 파일이 생성 된다.

```
{
  "name": "01_npm", // 프로젝트의 이름
  "version": "1.0.0", // 버전 정보
  "description": "", // 설명
  "main": "index.js", // node.js 에서 사용되는거라 무시 해도 됨
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }, // 프로젝트를 자동화 할 수 있는 쉘 스크립트를 입력 하는 부분
  "author": "", // 프로젝트 작성자
  "license": "ISC" // 라이센스 정보
}

```

## 프로젝트 명령어

- npm init 을 한 후 나온 package.json 파일의 scripts 부분을 보면 test라는 스크립트 가 하나 추가 됐고 test 스크립트에는 Error: no test specified 문자열을 echo로 출력 한뒤 에러코드 1번을 반환하는 쉘 스크립트 이다.
  - 일종의 샘플 스크립트라고 보면 된다.
- 스크립트를 실행 할 때는 npm test 라고 입력 하면 된다.
- npm 을 입력하면 npm 뒤에 넣을 수 있는 명령어 들이 나온다. 하지만 저기에 있는 명령어 이외에 커스텀 하여 상용하고 싶으면 scripts에 해당 명령어를 추가를 하고 실행 할 때는 npm 뒤에 run 을 넣은 뒤 명령어를 입력하면 실행이 된다.
  - npm run build

## 패키지 설치 (외부 패키지를 관리하는 방법)

### 1. CDN을 이용한 방법

- 외부 라이브러리를 가져다 쓰는 것은 무척 자연스러운 일이다. 간단한 방법은 CDN(컨텐츠 전송 네트워크)으로 제공하는 라이브러리를 직접 가져 오는 방식이다. 리액트의 주소를 html에서 로딩한다.

```
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

- 하지만 CDN 으로 작성시 CDN 서버 장애로 인한 외부 라이브러리를 사용할 수 없다면 우리 어플리케이션 서버가 정상이더라도 필수 라이브러리를 가져오지 못한다면 웹 어플리케이션은 정상적으로 동작하지 않을 것이다.

### 2. 직접 다운로드 하는 방법

- 라이브러리 코드를 우리 프로젝트 폴더에 다운 받아 놓을 수도 있다. 이 방법은 CDN을 사용하지 않기 때문에 장애와 독립적으로 웹 어플리케이션을 제공할 수 있다.
- 하지만 라이브러리는 계속해서 업데이트 될 것이고 우리 프로젝트에서도 최신 버전으로 교체해야한다. 이와 같은 방법은 매번 직접 다운로드 받아야 하기 때문에 매우 귀찮은 일이 될 것이다. 버전에 따라 하위 호환성 여부까지 확인하려면 실수할 여지가 많다.

### 3. NPM을 이용한 방법

- npm install 명령어로 외부 패키지를 우리 프로젝트 폴더에 다운로드 받으면

```
$ npm install react
```

- 최신 버전의 react를 NPM 저장소에서 찾아 우리 프로젝트로 다운로드 하는 명령어다.
- package.json에는 설치한 패키지 정보를 기록한다.

- package.json

```
{
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

- 18.2.0 버전을 설치했다는 의미이다.

### 4. 유의적 버전

- 외부 패키지를 설치 했을 때 18.2.0 이라는 버전이 적혀 져있다.
- 프로젝트에서 사용하는 패키지의 버전을 엄격하게 제한한다면 프로젝트를 버전업 하는데 힘들 수 있다. 사용하는 패키지를 전부 버전업해야 하기 때문이다.
- 하지만 위와 반대로 프로젝트에서 사용하는 패키지 버전을 느슨하게 풀어 놓으면 오히려 여러 버전별로 코드를 관리해야하는 혼란스러움을 격게될 수 있다.

- 따라서 버전 번호를 관리하기 위한 규칙이 필요한데 이 체계를 유의적 버전 이라고한다.
- NPM은 유의적 벼전(Sementic Version)을 따르는 전제 아래 패키지 버전을 관리한다.

- 유의적 버전은 주(Major), 부(Minor), 수(Patch) 세 가지 숫자를 조합해서 버전을 관리한다. 위에 설치한 react의 버전은 v18.2.0이며 주 버전이 18, 부 버전이 12, 수 버전이 0인 셈이다.

- 각 버전을 변경하는 기준은 다음과 같다.
  - 주 버전 (Major Version): 기존 버전과 호환되지 않게 변경한 경우
  - 부 버전 (Minor Version): 기존 버전과 호환되면서 기능이 추가된 경우
  - 수 버전 (Patch Version): 기존 버전과 호환되면서 버그를 수정한 경우

### 5. 버전의 범위

- 위에 버전을 보면 숫자와 . 말고도 ^ 라는 문자가 포함 돼 있다. 문자들의 특징을 살펴 보면

- 특정 버전만 사용할 경우

```
1.2.3
```

- 특정 버전보다 높거나 낮을 경우

```
>1.2.3
>=1.2.3
<1.2.3
<=1.2.3
```

- 틸트(~) 와 캐럿 (^) 을 이용해 범위를 명시

```
~1.2.3
^1.2.3
```

- 틸트(~)는 마이너 버전이 명시되어 있으면 패치버전을 변경한다.

  - 예를 들어 ~1.2.3 표기는 1.2.3 부터 1.3.0 미만 까지를 포함한다.
  - 마이너 버전이 없으면 마이너 버전을 갱신한다.
  - ~0 표기는 0.0.0 부터 1.0.0 미만 까지를 표시한다.

- 캐럿(^)은 정식버전에서 마이너와 패치 버전을 변경한다.
  - 예를 들어 ^1.2.3 표기는 1.2.3 부터 2.0.0 미만 까지를 포함한다.
  - 정식버전 미만인 0.x 버전은 패치만 갱신한다.
  - ^0 표기는 0.0.0 부터 0.1.0 미만 까지를 포함한다.

보통 라이브러리 정식 릴리즈 전에는 패키지 버전이 수시로 변한다. 0.1에서 0.2로 부버전이 변하더라도
하위 호환성을 지키지 않고 배포하는 경우가 빈번한다. ~0로 버전 범위를 표기한다면 0.0.0 부터 1.0.0 미만까지
사용하기 때문에 하위 호환성을 지키지 못하는 0.2로도 업데이트 되어버리는 문제가 생길 수 있다.

반면 캐럿을 사용해 ^0.0으로 표기한다면 0.0.0부터 0.1.0 미만 내에서만 버전을 사용하도록 제한한다.
따라서 하위 호완성을 유지할 수 있다.

NPM으로 패키지를 설치하면 package.json에 설치한 버전을 기록하는데 캐럿 방식을 이용한다. 초기에는 버전 번위에 틸트를 사용하다가
캐럿을 도입해서 기본 동작으로 사용했다.
그래서 우리가 설치한 react는 ^18.2.0 표기로 버전 범위를 기록한 것이다.
