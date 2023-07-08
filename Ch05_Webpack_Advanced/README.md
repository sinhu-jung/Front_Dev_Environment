# 웹팩 심화

## 웹팩 개발 서버

### 설치 및 사용

- webpack-dev-server 패키지 설치

```
$ npm i -D webpack-dev-server
```

- package.json 스크립트 설정

```
{
  "scripts": {
    "start": "webpack-dev-server"
  }
}
```

npm start 를 하고  http://localhost:8080로 접속하면 우리가 빌드했던 파일을 볼 수 있다.
뿐만 아니라 소스를 수정할 때마다 빌드를 다시 수행 해줘서
브라우저 새로 고침만 하면 소스가 수정된 것을 확인 할 수있다.

### 기본 설정

웹팩 설정 파일의 devServer 객체에 개발 서버 옵션을 설정할 수 있다.

- webpack.config.js
```
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    host: "dev.domain.com",
    overlay: true,
    port: 8081,
    stats: "errors-only",
    historyApiFallback: true,
  },
}
```

- contentBase: 정적파일을 제공할 경로. 기본값은 웹팩 아웃풋이다.

- publicPath: 브라우져를 통해 접근하는 경로. 기본값은 '/' 이다.

- host: 개발환경에서 도메인을 맞추어야 하는 상황에서 사용한다. 예를들어 쿠기 기반의 인증은 인증 서버와 동일한 도메인으로 개발환경을 맞추어야 한다. 운영체제의 호스트 파일에 해당 도메인과 127.0.0.1 연결한 추가한 뒤 host 속성에 도메인을 설정해서 사용한다.

- overlay: 빌드시 에러나 경고를 브라우져 화면에 표시한다.

- port: 개발 서버 포트 번호를 설정한다. 기본값은 8080.

- stats: 메시지 수준을 정할수 있다. 'none', 'errors-only', 'minimal', 'normal', 'verbose' 로 메세지 수준을 조절한다.

- historyApiFallBack: 히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.

이 외에도 개발 서버를 실행할때 명령어 인자로 --progress를 추가하면 빌드 진행율을 보여준다. 빌드 시간이 길어질 경우 사용하면 좋다.

## API 연동

### 목업 API
웹팩 개발 서버 설정 중 before 속성은 웹팩 서버에 기능을 추가할 수 있는 여지를 제공한다. 
이것을 이해하려면 노드 Express.js에 사전지식이 있으면 유리한데, 간단히 말하면 익스프레스는 미들웨어 형태로 서버 기능을 확장할 수 있는 웹프레임웍이다. 
devServer.before에 추가하는 것이 바로 미들웨어인 셈이다.

- webpack.config.js
```
    before: (app) => {
      app.get("/api/users", (req, res) => {
        res.json([
          {
            id: 1,
            name: "Alice",
          },
          {
            id: 2,
            name: "Bek",
          },
          {
            id: 3,
            name: "Chris",
          },
        ]);
      });
    },
```
before에 설정한 미들웨어는 익스프레스에 의해서 app 객체가 인자로 전달되는데 Express 인스턴스다.
이 객체에 라우트 컨트롤러를 추가할 수 있는데 app.get(url, controller) 형태로 함수를 작성한다.
컨트롤러에서는 요청 req과 응답 res 객체를 받는데 여기서는 res.json() 함수로 응답하는 코드를 만들었다.

해당 주소로 접근하면
```
[
    {
        "id": 1,
        "name": "Alice"
    },
    {
        "id": 2,
        "name": "Bek"
    },
    {
        "id": 3,
        "name": "Chris"
    }
]
```
배열을 주는 것을 확인 할 수 있다.

axios 를 설치하여 위의 소스를 출력하는 코드로 변경하면 다음과 같다.

- axios 설치

```
$ npm i axios
```

- app.js

```
import "../css/app.css";
import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get("/api/users");
  console.log(res);
  document.body.innerHTML = res.data.map((user) => {
    return `<div>${user.id}: ${user.name}</div>`;
  });
});

console.log(process.env.NODE_ENV);

```

브라우저의 네트워크 탭에서 api 를 받아오는 것을 확인 할 수 있고
화면에 잘 나오는걸 볼 수 있다.

### 목업 API 2

목업 API 가 많이 필요 할 때는 connect-api-mocker 패키지도 사용하는 편이다.

- connect-api-mocker 패키지 설치

```
$ npm i -D connect-api-mocker
```

mocks/api/users/GET.json 경로에 API 응답 파일을 만든다.

- GET.json

```
[
    {
      "id": 1,
      "name": "Alice"
    },
    {
      "id": 2,
      "name": "Bek"
    },
    {
      "id": 3,
      "name": "Chris"
    },
    {
        "id": 4,
        "name": "Daniel"
    }
]
```

기존에 설정한 목업 응답 컨트롤러를 제거하고 connect-api-mocker로 미들웨어를 대신한다.

- webpack.config.js

```
const apiMocker = require("connect-api-mocker")

module.exports = {
  devServer: {
    before: (app, server, compiler) => {
      app.use(apiMocker("/api", "mocks/api"))
    },
  },
}
```

## 핫 모듈 리플레이스먼트

핫 모듈 리플레이스 먼트는 변경한 모듈만 화면에서 갈아 치우는 것이다.
즉 전체 화면을 리프레쉬 하지 않고 변경된 부분만 갈아 치우기 때문에 다른 모듈은 이전 데이터를 유지한다.

### 핫 모듈 설정

핫 모듈을 설정 하는 부분은 webpack.config.js 의 devServer 에서 hot 속성을 켜면 된다.

- webpack.config.js
```
module.exports = {
  devServer = {
    hot: true,
  },
}
```

- app.js

```
if (module.hot) {
  console.log("핫모듈 켜짐");

  module.hot.accept("./result", async () => {
    console.log("result 모듈 변경 됨");
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept("./form", () => {
    console.log("form 모듈 변경 됨");
    formEl.innerHTML = form.render();
  });
}
```

devServer.hot 옵션을 켜면 웹팩 개발 서버 위에서 module.hot 객체가 생성된다. 이 객체의 accept() 메소드는 감시할 모듈과 콜백 함수를 인자로 받는다. 위에서는 app.js 모듈을 감시하고 변경이 있으면 전달한 콜백 함수가 동작하도록 했다.
이렇게 동작 하는 것을 HMR 인터페이스 라고 부른다.
대표적인 로더 중에는 style-loader가 HMR이 적용 돼 있다.

## 최적화

번들링 결과물이 커짐에 따라 파일을 다운로드 받는데 시간이 많이 걸림으로 브라우저에도 영향을 줄 수 있다. 
번들링 한 결과 물을 최적화하는 방법은 다음과 같다.

### production 모드

웹팩의 최적화 방법중 mode 값을 설정하는 방식이 있다.
세가지 값이 올 수 있는데 development 는 디버깅 편의를 위해 두개의 플러그인을 사용한다.

+ NamedChunksPlugin
+ NamedModulesPlugin

DefinePlugin을 사용한다면 process.env.NODE_ENV 값이 "development"로 설정되어 어플리케이션에 전역변수로 주입된다.

mode를 "production"으로 설정하면 자바스크립트 결과물을 최소화 하기 위해 다음 일곱 개 플러그인을 사용한다.

+ FlagDependencyUsagePlugin
+ FlagIncludedChunksPlugin
+ ModuleConcatenationPlugin
+ NoEmitOnErrorsPlugin
+ OccurrenceOrderPlugin
+ SideEffectsFlagPlugin
+ TerserPlugin

DefinePlugin을 사용한다면 process.env.NODE_ENV 값이 "production" 으로 설정되어 어플리케이션 전역변수로 들어간다.

환경변수 NODE_ENV 값에 따라 모드를 설정하도록 웹팩 설정 코드를 추가하면 다음과 같다
- webpack.config.js

```
const mode = process.env.NODE_ENV || "development" // 기본값을 development로 설정

module.exports = {
  mode,
}
```

빌드 시에 이를 운영 모드로 설정하여 실행하도록 npm 스크립트를 추가한다.
- package.json
```
{
  "scripts": {
    "start": "webpack-dev-server --progress",
    "build": "NODE_ENV=production webpack --progress"
  }
}
```

### optimazation 속성으로 최적화

optimize-css-assets-webpack-plugin 을 사용하면 css 파일도 빈간을 없애는 압축이 가능하다.

- 패키지 설치

```
$ npm i -D optimize-css-assets-webpack-plugin
```

- 웹팩 설정 추가

```
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  optimization: {
   minimizer: mode === "production" ? [new OptimizeCSSAssetsPlugin()] : [],
  }, 
}
```

optimization.minimizer는 웹팩이 결과물을 압축할때 사용할 플러그인을 넣는 배열이다. 

mode=production일 경우 사용되는 TerserWebpackPlugin은 자바스크립트 코드를 난독화하고 debugger 구문을 제거한다. 이 설정 이외에도  콘솔 로그를 제거하는 옵션도 있다.

- 패키지 설치

```
$ npm i -D terser-webpack-plugin
```

- optionmization.minimizer 배열에 추가

```
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그를 제거한다
                },
              },
            }),
          ]
        : [],
  },
}
```

### 코드 스플리팅

코드를 압축하는 것 외에도 아예 결과물을 여러개로 쪼개면 좀 더 브라우져 다운로드 속도를 높일 수 있다. 
큰 파일 하나를 다운로드 하는것 보다 작은 파일 여러개를 동시에 다운로드하는 것이 더 빠르기 때문이다.

- webpack.config.js
```
module.exports = {
  entry: {
    main: "./src/app.js",
    result: "./src/result.js",
  },
}
```

하지만 두 파일을 비교해 보면 중복코드가 있다.
axios 모듈인데 main, result 둘다 사용하기 때문이다.

SplitChunksPlugin은 코드를 분리할때 중복을 예방하는 플러그인이다.

- webpack.config.js

```
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
}
```

이런 방식은 엔트리 포인트를 적절히 분리해야기 때문에 손이 많이 가는 편이다. 반면 자동으로 변경해 주는 방식이 있는데 이를 다이나믹 임포트라고 부른다.

- app.js

```
import "../css/app.css";
import form from "./form";

let resultEl;
let formEl;

document.addEventListener("DOMContentLoaded", async () => {
  formEl = document.createElement("div");
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  import(/* webpackChunkName: "result" */ "./result.js").then(async (m) => {
    const result = m.default;
    resultEl = document.createElement("div");
    resultEl.innerHTML = await result.render();
    document.body.appendChild(resultEl);
  });
});

```

 import() 함수로 가져올 result 모듈 경로를 전달하는데 주석으로 webpackHunkName: "result"를 전달했다. 이것은 웹펙이 이 파일을 처리할때 청크로 분리하는데 그 청그 이름을 설정한 것이다.

  엔트리 포인트를 다시 main만 남겨두고 optimization에 설정한 SplitChunksPlugin 옵션도 제거 한 뒤 다시 빌드를 하면 자동으로 분리 한 것을 볼 수 있다.

  ### externals
   externals 는 외부 라이브러리등 이미 패키지로 제공 될 때 빌드 과정을 거쳐 다시 빌드 할 필요가 없는 것들을 제외 시켜주는 역할을 한다.

  - webpack.config.js
  ```
  module.exports = {
  externals: {
    axios: "axios",
  },
  }
  ```

  externals에 추가하면 웹팩은 코드에서 axios를 사용하더라도 번들에 포함하지 않고 빌드한다. 대신 이를 전역 변수로 접근하도록하는데 키로 설정한 axios가 그 이름이다.

  axios는 이미 node_modules에 위치해 있기 때문에 이를 웹팩 아웃풋 폴더에 옮기고 index.html에서 로딩해야한다. 파일을 복사하는 CopyWebpackPlugin을 설치한다.

  - 패키지 설치

  ```
  $ npm i -D copy-webpack-plugin
  ```

  - 웹팩 설정
  ```
  const CopyPlugin = require("copy-webpack-plugin")

      new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js", // 목적지 파일에 들어간다
        },
      ],
    }),
  ```

  마지막으로 index.html에서는 axios를 로딩하는 코드를 추가한다.

  ```
    <script type="text/javascript" src="axios.min.js"></script>
  ```