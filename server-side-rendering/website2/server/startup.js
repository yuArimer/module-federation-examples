const backupRequire = __webpack_require__.d;

console.log("im startup code");
console.log("remote", `${REMOTE_NAME}`);
console.log(this);
const containerID = Object.keys(__webpack_modules__).find((m) => {
  return m !== module.id;
});
const container = __webpack_require__(containerID);
__webpack_require__.d = () => {
  console.log("mocked required");
};
module.exports = {
  get: (request) => {
    console.log("getter hit");
    return container.get(request);
  },
  init: (args) => {
    console.log("init container");
    return container.init(args);
  },
};
backupRequire(exports);
