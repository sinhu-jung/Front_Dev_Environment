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
