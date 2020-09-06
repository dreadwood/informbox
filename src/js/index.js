'use strict';

(() => {
  window.addEventListener(`load`, () => {
    window.load(window.render.table, window.render.message);
    window.state.update();
    window.state.change();
  });
})();
