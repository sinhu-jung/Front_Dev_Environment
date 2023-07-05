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

대화식 명령어로 진행되는데 모듈 시스템을 사용하는지, 어떤 프레임웍을 사용하는지, 어플리케이션이 어떤 환경에서 동작하는지 등에 답하면 된다. 답변에 따라 .eslintrc 파일을 자동으로 만들 수 있다.