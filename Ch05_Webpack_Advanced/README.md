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