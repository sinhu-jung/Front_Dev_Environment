# 바벨의 기본 개념

- 브라우저에서도 사용하는 자바스크립트 코드가 조금씩 다르다.
- 프론트엔드 코드가 각 브라우저에 맞게 구현이 되다 보니까 코드가 일괄적이지 못한 현상이 발생했다.
- 과거 사파리 최신 브라우저는 Promise.prototype.finally 메소드를 사용하지 못했다.

위와 같은 프론트엔드에서 크로스 브라우징 이슈는 코드의 일괄성을 해치고 초심자들을 불안하게 만든다
따라서 이것을 해결 해 줄 수 있는것이 바벨이다.

바벨은 ECMAScript2015+로 작성한 코드를 모든 브라우져에서 동작하도록 호환성을 지켜준다.
뿐만아니라 타입스크립트, JSX처럼 다른 언어로 분류되는 것도 포함한다.

# 바벨의 기본 동작

- babel 설치

```
$npm i -D @babel/core @babel/cli
```

- babel 실행

```
npx babel app.js
const alert = msg => window.alert(msg);
```

바벨은 세단계로 빌드를 진행한다.

1. 파싱(Parsing)
2. 변환(Transforming)
3. 출력(Printing)

- 파싱
  파싱은 토큰을 받아 분해한다.
  예를들어 위의 바벨 실행 코드를 보면 const 라는 토큰 alert 라는 토큰 등호 토큰으로 분해한다. 이 과정을 파싱이라고 한다.

- 변환
  변환은 es6로 돼 있는 코드를 es5 로 변환시키는 단계이다.

- 출력
  변경된 결과물을 출력하는 단계이다.

하지만 위의 결과물은 파싱을 했지만 변환이 안 돼었다.
변환하기 전과 후의 코드가 같기 때문이다.

# 플러그인

- 바벨에는 플러그인 이라는게 있는데 이 플러그인이 변환을 담당한다.

## 1. 커스텀 플러그인

- my-babel-plugin.js

```
module.exports = function myBabelPlugin() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;

        // 바벨이 만든 AST 노드를 출력한다
        console.log("Identifier() name:", name);

        // 변환작업: 코드 문자열을 역순으로 변환한다
        path.node.name = name.split("").reverse().join("");
      },
    },
  };
};
```

플러그인 형식은 visitor 객체를 가진 함수를 반환해야 한다.
따라서 이 객체는 바벨이 파싱하여 만든 추상 구문 트리(AST)에 접근할 수 있는 메소드를 제공한다.
그중 Identifier() 메소드의 동작 원리를 살펴보는 코드다.

```
$ npx babel app.js --plugins ./my-babel-plugin.js
Identifier() name: alert
Identifier() name: msg
Identifier() name: window
Identifier() name: alert
Identifier() name: msg
const trela = gsm => wodniw.trela(gsm);
```

Identifier() 메소드로 들어온 인자 path에 접근하면 코드 조각에 접근할 수 있으며 path.node.name의 값을 변경하는데 문자를 뒤집는 코드다.
결과의 마지막 줄에서 보는것 처럼 이 코드의 문자열 순서가 역전되었다.

ECMASCript2015로 작성한 코드를 인터넷 익스플로러에서 돌리기 위해 const 코드를 var로 변경하는 플러그인을 만들어 보면 다음과 같다.

```
module.exports = function myBabelPlugin() {
 return {
   visitor: {
     // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-block-scoping/src/index.js#L26
     VariableDeclaration(path) {
       console.log("VariableDeclaration() kind:", path.node.kind); // const

       // const => bar 변환
       if (path.node.kind === "const") {
         path.node.kind = "var";
       }
     },
   },
 };
};

```

이번에는 vistor 객체에 VariableDeclaration() 메소드를 정의했다.
path에 접근해 보면 키워드가 잡히는 걸 알 수 있다.
path.node.kind가 const 일 경우 var로 변환하는 코드다.

## 2. 플러그인 사용

es6 에서 es5 로 변환하는 작업이 block-scoping 플러그인이다.

- 설치

```
$ npm i -D @babel/plugin-transform-block-scoping
```

플러그인 설치후 실행해보면 커스텀 플러그인과 같은 결과를 도출한다.

```
npx babel app.js --plugins @babel/plugin-transform-block-scoping

var alert = msg => window.alert(msg);
```

화살표 함수를 지원하지 않는 브라우저가 있을 수 있다.
따라서 이 부분도 지원하는 플러그인이 있는데 그것이 arrow-functions 플러그인 이다.

- 설치

```
$ npm i -D @babel/plugin-transform-arrow-functions
```

- 실행

```
$ npx babel app.js  --plugins @babel/plugin-transform-block-scoping  --plugins @babel/plugin-transform-arrow-functions

var alert = function (msg) {
  return window.alert(msg);
};
```

ECMAScript5에서부터 지원하는 엄격 모드를 사용하는 것이 안전하기 때문에 "use strict" 구문을 추가해야 한다.

- strict-mode 플러그인을 설치

```
$ npm i -D @babel/plugin-transform-strict-mode
```

- 실행

```
$ npx babel app.js  --plugins @babel/plugin-transform-block-scoping  --plugins @babel/plugin-transform-arrow-functions --plugins @babel/plugin-transform-strict-mode

"use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

플러그인이 추가 될 수록 명령어가 점점 길어 지는 것을 볼 수 있다.
설정 파일로 분리하여 사용해보면 다음과 같다.

- babel.config.js

```
module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode",
  ],
};
```

- 다시 바벨 실행

```
npx babel app.js

"use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

# 프리셋

ECMAScript2015+으로 코딩할 때 필요한 플러그인을 일일이 설정하는 일은 무척 지난한 일이다.
코드 한 줄 작성하는데도 세 개 플러그인 세팅을 했으니 말이다.
목적에 맞게 여러가지 플러그인을 세트로 모아놓은 것을 프리셋 이라고 한다.

## 1. 커스텀 프리셋

- my-babel-preset.js

```
module.exports = function myBabelPreset() {
  return {
    plugins: [
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-strict-mode",
    ],
  };
};

```

- babel.config.js 수정

```
module.exports = {
  presets: ["./my-babel-preset.js"],
};
```

실행해보면 동일한 결과를 출력하는 것을 볼 수있다.

## 2. 프리셋 사용하기

바벨은 목적에 따라 몇가지 프리셋을 제공한다

- preset-env
- preset-flow
- preset-react
- preset-typescript

- preset-env
  preset-env는 ECMAScript2015+를 변환할 때 사용한다. 바벨 7 이전 버전에는 연도별로 각 프리셋을 제공했지만(babel-reset-es2015, babel-reset-es2016, babel-reset-es2017, babel-reset-latest) 지금은 env 하나로 합쳐졌다.

preset-flow, preset-react, preset-typescript는 flow, 리액트, 타입스크립트를 변환하기 위한 프리셋이다.

- preset-env 설치

```
$ npm i -D @babel/preset-env
```

- 바벨 설정 변경

```
module.exports = {
  presets: ["@babel/preset-env"],
};
```

- 바벨 실행

```
$ npx babel app.js

"use strict";

var alert = function alert(msg) {
  return window.alert(msg);
};
```

# env 프리셋 설정과 폴리필

## 1. 타겟 브라우저

코드가 크롬 최신 버전(2019년 12월 기준)만 지원하다고 했을때 다른 브라우저를 위한 코드 변환은 불필요하다.
target 옵션에 브라우져 버전명만 지정하면 env 프리셋은 이에 맞는 플러그인들을 찾아 최적의 코드를 출력한다.

- babel.config.js

```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79", // 크롬 79까지 지원하는 코드를 만든다
        },
      },
    ],
  ],
};
```

크롬은 블록 스코핑과 화살표 함수를 지원하기 때문에 코드를 변환하지 않고 이러한 결과물을 도출한다.

## 2. 폴리필

ECMASCript2015의 Promise 객체를 사용하는 코드를 작성하면 다음과 같다.

- app.js

```
new Promise()
```

플러그인이 프라미스를 ECMAScript5 버전으로 변환할 것으로 기대했는데 예상과 다르다. 바벨은 ECMAScript2015+를 ECMAScript5 버전으로 변환할 수 있는 것만 빌드한다. 그렇지 못한 것들은 "폴리필"이라고부르는 코드조각을 추가해서 해결한다.

가령 ECMAScript2015의 블록 스코핑은 ECMASCript5의 함수 스코핑으로 대체할 수 있다. 화살표 함수도 일반 함수로 대체할 수 있다. 이런 것들은 바벨이 변환해서 ECMAScript5 버전으로 결과물을 만든다.

한편 프라미스는 ECMAScript5 버전으로 대체할 수 없다. 다만 ECMAScript5 버전으로 구현할 수는 있다

env 프리셋은 폴리필을 지정할 수 있는 옵션을 제공한다.

```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 폴리필 사용 방식 지정
        corejs: {
          // 폴리필 버전 지정
          version: 2,
        },
      },
    ],
  ],
};

```

useBuiltIns는 어떤 방식으로 폴리필을 사용할지 설정하는 옵션이다. "usage" , "entry", false 세 가지 값을 사용하는데 기본값이 false 이므로 폴리필이 동작하지 않았던 것이다. 반면 usage나 entry를 설정하면 폴리필 패키지 중 core-js를 모듈로 가져온다(이전에 사용하던 babel/polyfile은 바벨 7.4.0부터 사용하지 않음).

corejs 모듈의 버전도 명시하는데 기본값은 2다. 버전 3과 차이는 확실히 잘 모르겠다. 이럴 땐 그냥 기본값을 사용하는 편이다.

# 웹팩으로 통합

실무에서는 바벨을 직접 사용하지는 않고 웹팩으로 통합해서 사용한다.
로더 형태로 제공하는데 babel-loader 로 알려져 있다.

- 패키지 설치

```
$ npm i -D babel-loader
```

- 웹팩 설정에 로더 추가

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader", // 바벨 로더를 추가한다
      },
    ],
  },
}
```

폴리필 사용 설정을 했다면 core-js도 설치해야한다. 웹팩은 바벨 로더가 만든 아래 코드를 만나면 core-js를 찾을 것이기 때문이다.

코어 js 설치

```
$ npm i core-js@2
```

그리고 웹팩으로 빌드하면 정상적으로 빌드가 되는것을 볼 수 있다.
