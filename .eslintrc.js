module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    wx: "readonly", // wx mini program
    my: "readonly", // ali mini program
    uni: "readonly", // uni
    plus: "readonly", // uni
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier/vue",
  ],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 未使用声明，方便调试
    "no-unused-vars": "warn",

    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        // 比起页面空格产生的影响，我还是希望代码看起来简单一点
        htmlWhitespaceSensitivity: "ignore",
      },
    ],
  },
};
