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
