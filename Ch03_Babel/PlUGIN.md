# 웹팩 플러그인

## 1. 플러그인의 역할

- 로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다.
- 주로 번들된 파일을 난독화 하거나 특정 텍스트를 추출하는 용도로 사용

## 2. 커스텀 플러그인 만들기

- my-webpack-plugin.js

```
class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("My Plugin", (stats) => {
      console.log("MyPlugin: done");
    });
  }
}

module.exports = MyWebpackPlugin;

```

로더와 다르게 플러그인은 클래스로 제작한다. apply 함수를 구현하면 되는데 이 코드에서는 인자로 받은 compiler 객체 안에 있는 tap() 함수를 사용하는 코드다. 플러그인 작업이 완료되는(done) 시점에 로그를 찍는 코드이다.

플러그인을 웹팩 설정에 추가한다.

- webpack.config.js

```
const MyPlugin = require("./myplugin")

module.exports = {
  plugins: [new MyPlugin()],
}
```

웹팩 설정 객체의 plugins 배열에 설정한다. 클래스로 제공되는 플러그인의 생성자 함수를 실행해서 넘기는 방식이다.

그런데 파일이 여러 개인데 로그는 한 번만 찍혔다. 모듈이 파일 하나 혹은 여러 개에 대해 동작하는 반면 플러그인은 하나로 번들링된 결과물을 대상으로 동작 한다. 우리 예제에서는 main.js로 결과물이 하나이기 때문에 플러그인이 한 번만 동작한 것이라 추측할 수 있다.

번들 결과에 접근을 하기위해 코드를 수정을 해주면

- my-webpack-plugin.js

```
class MyWebpackPlugin {
     apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const source = compilation.assets['main.js'].source();
      compilation.assets['main.js'].source = () => {
        const banner = [
          '/**',
          ' * 이것은 BannerPlugin이 처리한 결과입니다.',
          ' * Build Date: 2019-10-10',
          ' */'
          ''
        ].join('\n');
        return banner + '\n' + source;
      }

      callback();
    })
  }
}

module.exports = MyWebpackPlugin;
```

compiler.plugin() 함수의 두번재 인자 콜백함수는 emit 이벤트가 발생하면 실행된다.
번들된 결과가 compilation 객체에 들어 있는데 compilation.assets['main.js'].source() 함수로 접근할 수 있다.
실행하면 터미널에 번들링된 결과물을 확인할 수 있다.

# 자주 사용하는 플러그인

## 1. BannerPlugin

커스텀으로 만들었던 my-webpack-plugin 이 실제로는 BannerPlugin 이라고 불린다.
결과물에 빌드 정보나 커밋 버전같은 걸 추가할 수 있으며 웹팩이 기본적으로 제공하고 있는 플러그인 이다.

- webpack.config.js

```
const webpack = require("webpack");
const childProcess = require("child_process");

  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
  ],
```

node_module 에 childProcess 를 사용하면 터미널에 명령어를 친 결과물을 얻을 수 있다.

## 2. DefinePlugin

어플리케이션은 개발환경과 운영환경으로 나눠서 운영한다.
가령 환경에 따라 API 서버 주소가 다를 수 있다.
같은 소스 코드를 두 환경에 배포하기 위해서는 이러한 환경 의존적인 정보를 소스가 아닌 곳에서 관리하는 것이 좋다.
배포할 때마다 코드를 수정하는 것은 곤란하기 때문이다.

웹팩은 이러한 환경 정보를 제공하기 위해 DefinePlugin을 제공한다.

- webpack.config.js

```
plugins: [
    new webpack.DefinePlugin({
      TWO: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
]
```

빈 객체를 전달해도 기본적으로 넣어주는 값이 있다.
노드 환경정보인 process.env.NODE_ENV 인데 웹팩 설정의 mode에 설정한 값이 여기에 들어간다.
"development"를 설정했기 때문에 어플리케이션 코드에서 process.env.NODE_ENV 변수로 접근하면 "development" 값을 얻을 수 있다.

## 3. HtmlWebpackPlugin

HtmlWebpackPlugin 은 웹팩의 기본 플러그인은 아니다.
써드 파티 패키지이기 때문에 따로 설치해야 하는 플러그인 이다.
HtmlWebpackPlugin은 HTML 파일을 후처리하는데 사용한다.
주로 빌드 타임의 값을 넣거나 코드를 압축할수 있다.

- HtmlWebpackPlugin 설치

```
$ npm i -D html-webpack-plugin@4
```

index.html 파일을 src/index.html로 옮긴뒤 빌드를 하게 되면 HTML 파일이 빌드 된다.

타이틀 부분에 ejs 문법을 이용하는데 <%= env %> 는 전달받은 env 변수 값을 출력한다. HtmlWebpackPlugin은 이 변수에 데이터를 주입시켜 동적으로 HTML 코드를 생성한다.

뿐만 아니라 웹팩으로 빌드한 결과물을 자동으로 로딩하는 코드를 주입해 준다.

- src/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document<%= env %></title>
  </head>
  <body></body>
</html>
```

- webpack.config.js

```
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
    }),
```

NODE_ENV=development 로 설정해서 빌드하면 빌드결과 "Document(개발용)"으로 나온다. NODE_ENV=production 으로 설정해서 빌드하면 빌드결과 "Document"로 나온다.

개발 환경과 달리 운영 환경에서는 파일을 압축하고 불필요한 주석을 제거하는 것이 좋다.

- webpack.config.js

```
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify: process.env.NODE_ENV === "production" ? {
        collapseWhitespace: true, // 빈칸제거
        removeComments: true, // 주석 제거
      } : false,
    }),
```

위와같이 설정하고 실행하면 빈칸 제거를 했으므로 index.html 파일이 일직선으로 나오며 주석이 전부 삭제 된 것을 볼 수 있다.

정적파일을 배포하면 즉각 브라우져에 반영되지 않는 경우가 있다. 브라우져 캐쉬가 원인일 경우가 있는데 이를 위한 예방 옵션도 있다.

```
new HtmlWebpackPlugin({
  hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
})
```

## 4. CleanWebpackPlugin

CleanWebpackPlugin 도 웹팩의 기본 플러그인이 아니기 때문에 따로 설치를 해줘야 한다.
CleanWebpackPlugin의 역할은 output 폴더를 삭제 해준다. 이전 빌드내용이 덮여 씌여지면 상관없지만 그렇지 않으면 아웃풋 폴더에 여전히 남아 있을 수 있기 때문이다.

- CleanWebpackPlugin 설치

```
$ npm i -D clean-webpack-plugin
```

- webpack.config.js

```
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
  plugins: [new CleanWebpackPlugin()],
}
```

## 5. MiniCssExtractPlugin

스타일시트가 점점 많아지면 하나의 자바스크립트 결과물로 만드는 것이 부담일 수 있다. 번들 결과에서 스트일시트 코드만 뽑아서 별도의 CSS 파일로 만들어 역할에 따라 파일을 분리하는 것이 좋다.
브라우져에서 큰 파일 하나를 내려받는 것 보다, 여러 개의 작은 파일을 동시에 다운로드하는 것이 더 빠르다.

개발 환경에서는 CSS를 하나의 모듈로 처리해도 상관없지만 프로덕션 환경에서는 분리하는 것이 효과적이다. MiniCssExtractPlugin은 CSS를 별로 파일로 뽑아내는 플러그인이다.

- MiniCssExtractPlugin 설치

```
$ npm i -D mini-css-extract-plugin
```

- webpack.config.js:

```
  const MiniCssExtractPlugin = require("mini-css-extract-plugin")

    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []),
```

개발 환경에서는 css-loader에의해 자바스크립트 모듈로 변경된 스타일시트를 적용하기위해 style-loader를 사용했다. 반면 프로덕션 환경에서는 별도의 CSS 파일으로 추출하는 플러그인을 적용했으므로 다른 로더가 필요하다.

- webpack.config.js:

```
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
```

filename에 설정한 값으로 아웃풋 경로에 CSS 파일이 생성되는 것을 볼 수 있다.
