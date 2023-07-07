# 린트

린트를 검색 해보면 보풀이라는 의미이다.
코드를 작성하면서 생기는 보풀 코드들을 제거하거나 검사하는 역할을 한다.

## 1. 린트가 필요한 상황

```
console.log()
(function () {})()
```

위의 코드를 보면 버그가 없을거 같지만 브라우져에서 실행하면 TypeError 가 발생한다.
이유는 자바스크립트는 세미콜론을 자동으로 넣는 과정(ASI) 를 수행하지만
위의 코드 같은 경우는 2줄로 인식을 하는게 아니라 1줄로 인식을 한다.

```
console.log()(function () {})()
```

console.log()가 반환하는 값이 함수가 아닌데 함수 호출을 시도했기 때문에 타입에러가 발생하며 모든 문장에 세미콜론을 붙였다면, 혹은 즉시 함수호출 앞에 세미콜론을 붙였다면 예방할 수 있는 버그다.

린트는 코드의 가독성을 높이는 것 뿐만 아니라 동적 언어의 특성인 런타임 버그를 예방하는 역할도 한다.

## ESLint

린트 중에 가장 많이 사용하는 린트이다.

린트가 하는 역할은 다음과 같다.

- 포맷팅
- 코드 품질

포맷팅은 일관된 코드 스타일을 유지하도록 하고 개발자로 하여금 쉽게 읽히는 코드를 만들어 준다. 이를 테면 "들여쓰기 규칙", "코드 라인의 최대 너비 규칙"을 따르는 코드가 가독성이 더 좋다.

한편, 코드 품질은 어플리케이션의 잠재적인 오류나 버그를 예방하기 위함이다. 사용하지 않는 변수 쓰지 않기, 글로벌 스코프 함부로 다루지 않기 등이 오류 발생 확률을 줄여 준다.

- ESLint 설치

```
$ npm i -D eslint
```

### 규칙 (Rules)

ESLint 는 규칙을 정해놨는데 이것은 코드를 검사하는 규칙을 말한다.
Rule 을 환경 설정에 추가 해야만 코드를 검사 할 수 있다.

위에서 세미콜론을 안 붙여서 발생한 문제는 no-unexpected-multiline 을 설정하면 해결 할 수 있다.
환경 설정에 추가하면 다음과 같다.

- .eslintrc.js

```
module.exports = {
  rules: {
    "no-unexpected-multiline": "error",
  },
};

```
을 설정하면 

```
console.log()
(function () {})()
```
와 같이 세미콜론을 안 붙였을 때 에러가 나도록 해준다.

### 자동으로 수정할 수 있는 규칙

ESLint 설정 중에는 잠재적으로 수정가능(potentially fixable)한 옵션이 있다.
--fix 옵션을 붙여 검사해보면 자동으로 수정하는것을 볼 수 있다.

잠재적으로 수정 가능한 옵션을 찾아 보려면 ESLint 공식 홈페이지에 규칙 목록중 
랜치 표시가 붙은 옵션이 자동으로 수정 할 수 있는 옵션이다.

### Extensible Config

필요한 규칙들을 전부 셋팅 하는 것 보다. 규칙들을 하나의 세트로 모아 놓은 것이 있는데 이것이 Extensible Config 이다.

config 중 eslint 가 기본적으로 사용하는 것이 있는데 그것이 eslint:recommended 설정이다.

```
{
    "extends": [
        "eslint:recommended"
    ],
    "env": {
        "browser": true,
        "node": true
    }
}
```
eslintrc.json 에 위와 같이 설정을 하고 
npx eslint app.js --fix 를 실행 하면 자동으로 수정 해 주는 것을 볼 수 있다.

### 초기화 

eslint 설정 파일으 직접 만들기 보다는 --init 옵션을 추가하면 손쉽게 구성할 수 있다.

```
npx eslint --init

? How would you like to use ESLint?
? What type of modules does your project use?
? Which framework does your project use?
? Where does your code run?
? How would you like to define a style for your project?
? Which style guide do you want to follow?
? What format do you want your config file to be in?
```

대화식 명령어로 진행되는데 모듈 시스템을 사용하는지, 어떤 프레임웍을 사용하는지, 어플리케이션이 어떤 환경에서 동작하는지 등에 답하면 된다. 
답변에 따라 .eslintrc 파일을 자동으로 만들 수 있다.

# Prettier

프리티어는 코드를 가독성이 좋게 만드는 역할을 한다.
ESLint의 포맷팅 부분을 강화한 것이라 생각하면 될 것 같다.

- 프리티어 설치

```
$ npm i -D prettier
```

설치 후 프리티어로 검사를 해 보면 다음과 같다

```
- app.js
console.log('hello world')

npx prettier app.js --write

- app.js
console.log('hello world');

```
검사를 하면 세미콜론이 붙어서 나온 것을 볼 수 있다.

프리티어의 강점은 ESLint 가 고칠 수 없는 부분도 고쳐준다.

```
console.log("----------------매 우 긴 문 장 입 니 다 80자가 넘 는 코 드 입 니 다.----------------");
```

ESLint는 max-len 규칙을 이용해 위 코드를 검사하고 결과만 알려 줄 뿐 수정하는 것은 개발자의 몫이다. 
반면 프리티어는 어떻게 수정해야할지 알고 있기 때문에 아래처럼 코드를 다시 작성한다.

```
console.log(
  "----------------매 우 긴 문 장 입 니 다 80자가 넘 는 코 드 입 니 다.----------------"
);
```

## 통합방법

포맷팅은 프리티어에게 맡기더라도 코드 품질과 관련된 검사는 ESLint의 몫이기 때문에 ESLint 는 여전히 사용 해야 한다.
따라서 ESLint 와 Prettier 를 같이 사용하기 위한 방법은 다음과 같다.

- 패키지 설치

```
$ npm i -D eslint-config-prettier
```

- 설정 추가

```
// .eslintrc.js
{
  extends: [
    "eslint:recommended",
    "eslint-config-prettier"
  ]
}
```

ESLint는 중복 세미콜론 사용을 검사한다. 
이것은 프리티어도 마찬가지다. 
따라서 어느 한쪽에서는 규칙을 꺼야하는데 eslint-config-prettier를 extends 하면 중복되는 ESLint 규칙을 비활성화 한다.

ESLint 와 Prettier 둘다 실행을 계속 시켜야 되는 것은 귀찮은 작업이다.
그래서 한방에 실행 시키는 방법을 보면 다음과 같다.

- 패키지 설치

```
$ npm i -D eslint-plugin-prettier
```

- 설정 파일에서 plugins와 rules에 설정 추가
```
// .eslintrc.js
{
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error"
  },
}
```

# 자동화

터미널에 명령어를 쳐서 수작업으로 하는건 한계가 있다.
따라서 코드를 작성 할 때마다 자동화 하는 방법이 필요하다.
자동화 하는 방법을 보면 다음과 같다.

## 1. 변경한 내용만 검사
소스 트래킹 도구로 깃을 사용한다면 깃 훅을 이용하는 것이 좋다. 커밋 전, 푸시 전 등 깃 커맨드 실행 시점에 끼여들수 있는 훅을 제공한다.
husky 는 깃 훅을 쉽게 사용할 수 있다.
커밋 메시지 작성전에 끼어들어 린트로 코드 검사 작업을 추가하는 방법을 보면 다음과 같다.

- 패키지 다운로드
```
$ npm i -D husky@4
```

- package.json 설정

```
{
  "husky": {
    "hooks": {
      "pre-commit": "echo \"이것은 커밋전에 출력됨\""
    }
  }
}
```

- 빈 커밋을 만들어서 테스트

```
git commit --allow-empty -m "sample commit"
husky > pre-commit (node v14.17.3)
이것은 커밋전에 출력됨
[main 07d0f2f] sample commit
```

이제 pre-commit 부분을 eslint 명령어로 대체하여 실행하면 
eslint 가 정상적으로 커밋전에 실행하는 것을 볼 수 있다.

- package.json

```
{
  "husky": {
    "hooks": {
      "pre-commit": "eslint app.js --fix"
    }
  }
}
```

해당 방법으로 실행을 했을 때 린트 수행중 오류를 발견하면 커밋 과정은 취소 되며
린트를 통과하게끔 코드를 수정해야만 커밋할 수 있는 환경으로 변경 됐다.

하지만 코드 작성량이 많아지면서 모든 파일을 검사하기에는 커밋 작성 까지 
매우 느려질 수 있는데 이럴 경우에는 lint-staged를 사용하여 변경 된 파일 만 검사가 가능하다.

- 패키지 설치

```
$ npm i -D lint-staged
```

- 패키지 파일에 설정을 추가

```
{
  "lint-staged": {
    "*.js": "eslint --fix"
  }
}
// 내용이 변경된 파일 중에 .js 확장자로 끝나는 파일만 린트로 코드 검사를 한다.
```

- pre-commit 훅도 변경

```
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

## 2. 에디터 확장 도구

- ESLint 확장 도구 설치
  - 규칙과 맞지 않는 코드 작성시 빨간줄 또는 노란줄 나오게 한다.

에디터 설정중 저장시 액션을 추가할 수 있는데 ESLint로 코드를 정정할 수 있다.

- .vscode/settings.json:
```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
이렇게 ESLint 익스텐션으로는 실시간 코드 품질 검사를 하고 저장시 자동 포메팅을 하도록 하면 실시간으로 코드 품질을 검사하고 포맷도 일관적으로 유지할 수 있다.