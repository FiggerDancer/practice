module.exports = {
    root: true,
    // 代码运行环境
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
      "eslint-config-airbnb-base",
      "plugin:vue/recommended",
    ],
    // 解析器配置
    parserOptions: {
        ecmaVersion: 2018,        // es6版本
        sourceType: "module",     // 源代码为 ES6 module
        "parser": "babel-eslint"
    },
    rules: {
        "linebreak-style": "off",       // 去掉行末的  lf; crlf 检查
        indent: ['error', 4],       // 缩进统一使用 
        "vue/html-indent": ['error', 4],
      //   'no-tabs': 'on',
        'no-underscore-dangle': 'off',  // 允许变量命名以下划线开头
        'no-plusplus': 'off',           // 允许使用一元运算符 ++ --
        'max-len': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
    },
    overrides: [
      {
        "files": ["tests/**/*.test.js"],
        "rules": {
          "no-unused-expressions": "off"
        }
      },
      {
        "files": ["tests/**/*.test.js"],
        "rules": {
          "prefer-arrow-callback": "off"
        }
      },
      {
        "files": ["tests/**/*.test.js"],
        "rules": {
          "func-names": "off"
        }
      },
      {
        "files": ["build/*.js"],
        "rules": {
          "import/no-extraneous-dependencies": "off"
        }
      }
    ]
  };
  