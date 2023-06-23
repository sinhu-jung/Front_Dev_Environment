# 웹팩 - 기본 (webpack4)

## 웹팩이 필요한 이유

### 1. 배경

문법 수준에서 모듈을 지원하기 시작한 것은 ES2015 부터이다.
import/export 구문이 없었던 무듈 이전 상황을 살펴보는 것이 웹팩 등장 배경을 설명하기 좋다.

덧셈 함수를 보면

- math.js

```
function sum(a, b) { return a + b; }
```

- app.js

```
sum(1, 2);
```

위 코드들은 모두 하나의 HTML 파일 안에서 로딩해야만 실행된다.
math.js가 로딩되면 app.js는 이름 공간에서 sum을 찾은 뒤 함수를 실행한다.
문제는 sum 이 전역 공간에 노출되며 다른 파일에서도 sum이란 이름을 사용하면 충돌한다.

#### IIFE 방식의 모듈

위와 같은 전역 스코프가 오염되는 문제를 예방하기 위해 스코프를 사용한다.
함수 스코프를 만들어 외부에서 안으로 접근하지 못하도록 공간을 격리한다.
스코프 안에서는 자신만의 이름 공간이 존재하므로 스코프 외부와 이름 충돌을 막을 수 있다.

- math.js

```
var math = math || {} // math 네임스페이스

(function() {
    function sum(a, b) { return a + b; }
    math.sum = sum;
})();
```

같은 코드를 즉시실행함수로 감싸서 다른 파일또는 같은파일에서 이 안으로 접근할 수 없다.
자바스크립트 함수 스코프의 특징이다.
sum 이란 이름은 즉시실행함수 안에 감추어졌기 때문에 외부에서는 같은 이름을 사용해도 괜찮다.
전역에 등록한 math라는 이름의 공간만 잘 사용하면 된다.

#### 다양한 모듈 스펙

위와같은 방식으로 자바스크립트 모듈을 구현하는 대표적인 명세가 AMD와 CommonJS다.

- CommonJS는 자바스크립트를 사용하는 모든 환경에서 모듈을 하는 것이 목표이며 export 키워드로 모듈을 만들고 require() 함수로 불러 들이는 방식이다.
- 대표적으로 서버 사이드 플랫폼인 Node.js 에서 이를 사용한다.

math.js

```
export function sum(a, b) { return a + b; }
```

app.js

```
const sum = require('./math.js');
sum(1,2);
```

- AMD(Asynchoronous Module Definition)는 비동기로 로딩되는 환경에서 모듈을 사용하는 것이 목표이며 주로 브라우저 환경에서 사용된다.

- UMD(Universal Module Definition)는 AMD 기반으로 CommonJS 방식까지 지원하는 통합형태이다.

위와 같이 각 커뮤니티에서 각자의 스펙을 제안하다가 ES2015에서 표준 모듈 시스템을 내 놓았다.
지금은 바벨과 웹팩을 이용해 모듈 시스템을 사용하는 것이 일반적이다.

math.js

```
export function sum(a, b) { return a + b; }
```

app.js

```
import * as math from './math.js';
math.sum(1, 2);
```

export 구문으로 모듈을 만들고 import 구문으로 가져올 수 있다.

#### 브라우져의 모듈 지원

모든 브라우져에서 모듈 시스템을 지원하지 않는다.
인터넷 익스플로러를 포함한 몇 몇 브라우져에서는 여전히 모듈을 사용하지 못하며.
가장 많이 사용하는 크롬 브라우져를 살펴보면

- index.html

```
<script type="module" src="src/app.js"></script>
```

"<script>" 태그로 로딩할 때 type="text/javascript" 대신 type="module"을 사용한다.
app.js는 모듈을 사용할 수 있다.

그러나 브라우져에 무관하게 사용하고 싶을 때가 있는데 이를 해결 해 주는 것이 웹팩이다.

### 2. 엔트리/아웃풋

웹팩은 여러개 파일을 하나의 파일로 합쳐주는 번들러(bundler)다. 하나의 시작점(entrypoint)으로 부터
의존적인 모듈을 전부 찾아내서 하나의 결과물을 만들어낸다.
app.js 부터 시작해 math.js 파일을 찾은 뒤 하나의 파일로 만드는 방식이다.

- 번들작업을 하는 webpack 패키지와 웹팩 터미널 도구인 webpack-cli 를 설치

```
$ npm install -D webpack webpack-cli
```

- webpack --help 옵션으로 사용방법을 확인 해 보면

```
$ node_modules/.bin/webpack --help

  --mode                 Enable production optimizations or development hints.
                                     [선택: "development", "production", "none"]
  --entry      The entry point(s) of the compilation.                   [문자열]
  --output, -o                  The output path and file for compilation assets

```

위와 같이 나오는데

--mode, --entry, --output 세 개 옵션만 사용하면 코드를 묶을 수 있다.

- --mode: 웹팩 실행 모드를 의미하며 개발 버전인 development를 지정한다.
- --entry: 시작점 경로를 지정하는 옵션이다.
- --output: 번들링 결과물을 위치할 경로이다.

```
$ node_modules/.bin/webpack --mode development --entry ./src/app.js --output dist/main.js
```

위 명령어를 실행하면 dist/main.js 에 번들된 결과가 저장된다.
이 코드를 index.html에 로딩하면 번들링 전과 똑같은 결과를 만든다.

- index.html

```
<script src="dist/main.js"></script>
```

- --config 항목을 보면

```
$ node_modules/.bin/webpack --help

  --config               Path to the config file
                         [문자열] [기본: webpack.config.js or webpackfile.js]
```

이 옵션은 웹팩 설정파일의 경로를 지정할 수 있는데 기본 파일명이 webpack.config.js 혹은 webpackfile.js다

- webpack.config.js

```
const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
}
```

터미널에서 사용한 옵션인 mode, entry, ouput을 설정한다.

- mode: development 문자열을 사용했다.
- entry: 어플리케이션 진입점임 src/app.js 로 설정한다.
- output: [name]은 entry에 추가한 main이 문자열로 들어오는 방식이다.
  - output.path는 절대 경로를 사용하기 때문에 path 모듈의 resolve() 함수를 사용해서 계산했다. (path는 노드 코어 모듈 중 하나로 경로를 처리하는 기능을 제공한다)

웹팩 실행을 위한 NPM 커스텀 명령어를 추가한다.

- package.json

```
{
  "scripts": {
    "build": "./node_modules/.bin/webpack"
  }
}
```

### 로더

#### 1. 로더의 역할

- 웹팩은 모든 파일을 모듈로 바라본다. 자바스크립트로 만든 모듈 뿐만아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에 import 구문을 사용하면 자바스크립트 코드 안으로 가져올수 있다.
- 로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로 변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다. 뿐만아니라 CSS 파일을 자바스크립트에서 직접 로딩할수 있도록 해준다.

#### 2. 커스텀 로더 만들기

- myloader.js

```
module.exports = function myWebpackLoader(content) {
  console.log("myWebpackLoader 가 동작함");
  return content;
};
```

- 함수로 만들수 있는데 로더가 읽은 파일의 내용이 함수 인자 content로 전달된다. 로더가 동작하는지 확인하는 용도로 로그만 찍고 곧장 content를 돌려 주며 로더를 사용하려면 웹팩 설정에서 module 객체에 추가한다.

- webpack.config.js

```
  module: {
   rules: [
     {
       test: /\.js$/, // 로더가 처리해야될 파일들의 패턴(정규 표현식)
       use: [path.resolve("./my-webpack-loader.js")],
     },
   ],
 },
```

- module.rules 배열에 모듈을 추가하는데 test와 use로 구성된 객체를 전달한다.

- test에는 로딩에 적용할 파일을 지정한다. 파일명 뿐만아니라 파일 패턴을 정규표현식으로 지정할수 있는데 위 코드는 .js 확장자를 갖는 모든 파일을 처리하겠다는 의미다.

- use에는 이 패턴에 해당하는 파일에 적용할 로더를 설정하는 부분이다. 방금 만든 my-webpack-loader 함수의 경로를 지정한다.

빌드를 하게 되면 터미널에 myWebpackLoader 가 동작함이 2개가 적혀 있는 것을 볼 수 있는데 지금 만들어 놓은 파일은 app.js 와 app.js 에서 가져와서 사용하는 math.js 가 있다.
test 에 적힌 규칙대로 .js 파일만 다 가져와서 로더가 돌기 때문에 2번이 찍히는 것이다.

- 소스에 있는 모든 console.log() 함수를 alert() 함수로 변경하도록 로더를 변경해 보면 다음과 같다.

- my-webpack-loader.js

```
module.exports = function myWebpackLoader(content) {
  return content.replace("console.log(", "alert(");
};

```

빌드 후 확인을 해보면 console.log 가 alert 로 변경 된 것을 알 수 있다.

### 자주 사용하는 로더
