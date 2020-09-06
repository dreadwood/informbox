'use strict';

(() => {
  const URL_LOAD = `https://reqres.in/api/unknown?per_page=12`;

  const statusCode = {
    OK: 200
  };

  const loadData = (loadCallback, errorCallback) => {
    const request = new XMLHttpRequest();
    request.responseType = `json`;

    request.open(`GET`, URL_LOAD);
    request.send();

    request.addEventListener(`load`, () => {
      if (request.status === statusCode.OK) {
        loadCallback(request.response);
      } else {
        errorCallback(`Ошибочка вышла: ${request.status} ${request.statusText}`);
      }
    });

    request.addEventListener(`error`, () => {
      errorCallback(`Произошла ошибка соединения`);
    });

    request.open(`GET`, URL_LOAD);
    request.send();
  };

  window.load = loadData;
})();
