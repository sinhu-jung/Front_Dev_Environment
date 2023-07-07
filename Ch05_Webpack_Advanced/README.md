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