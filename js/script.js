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

'use strict';

(() => {
  const messageBlock = document.querySelector(`.palette__message`);

  const renderTable = (request) => {
    const colors = request.data;
    const table = document.querySelector(`.palette__table tbody`);

    colors.forEach((color) => table.append(createRowElement(color)));
    hideMessage();
  };

  const createRowTemplate = ({id, name, year, color, pantone_value: value}) => {
    return (
      `<tr>
        <td class="palette__col-id">${id}</td>
        <td class="palette__col-name">${name}</td>
        <td class="palette__col-year">${year}</td>
        <td class="palette__col-color">
          <span
            class="palette__item-icon"
            style="background-color: ${color};"
          ></span>
          ${color}
        </td>
        <td class="palette__col-value">${value}</td>
      </tr>`
    );
  };

  const createRowElement = (color) => {
    const template = createRowTemplate(color);
    const newElement = document.createElement(`template`);
    newElement.innerHTML = template;

    return newElement.content;
  };

  const renderMessage = (message) => {
    const messageElement = messageBlock.querySelector(`p`);
    messageElement.textContent = message;
    messageBlock.classList.remove(`palette__message--hidden`);
  };

  const hideMessage = () => {
    messageBlock.classList.add(`palette__message--hidden`);
  };

  window.render = {
    table: renderTable,
    message: renderMessage,
  };
})();

'use strict';

(() => {
  let stateInputs = {
    id: true,
    name: true,
    year: true,
    color: true,
    value: true,
  };

  const table = document.querySelector(`.palette__table`);
  const tableInputs = table.querySelectorAll(`input`);
  const resetBtn = document.querySelector(`.palette__btn-reset`);

  const upadateStorage = () => {
    localStorage.setItem(`pantoneColors`, JSON.stringify(stateInputs));
  };

  const updateState = () => {
    stateInputs = JSON.parse(localStorage.getItem(`pantoneColors`)) || stateInputs;
  };

  tableInputs.forEach((input) => {
    input.addEventListener(`click`, (evt) => {
      if (!evt.target.checked) {
        stateInputs[evt.target.name] = false;
        upadateStorage();
        changeState();
      }
    });
  });

  resetBtn.addEventListener(`click`, () => {
    if (!resetBtn.disabled) {
      resetState();
      upadateStorage();
      changeState();
    }
  });

  const changeState = () => {
    Object.entries(stateInputs).map(([name, value]) => {
      if (value) {
        table.classList.remove(`palette__table--${name}-hidden`);
      } else {
        table.classList.add(`palette__table--${name}-hidden`);
      }

      tableInputs.forEach((input) => {
        if (input.name === name) {
          input.checked = value;
        }
      });
    });

    changeStaseBtn();
  };

  const changeStaseBtn = () => {
    const isInputsCheck = Object.values(stateInputs).every((value) => value === true);
    resetBtn.disabled = isInputsCheck;
  };

  const resetState = () => {
    tableInputs.forEach((input) => {
      input.checked = true;
      stateInputs[input.name] = true;
    });
  };

  window.state = {
    update: updateState,
    change: changeState,
  };
})();

'use strict';

(() => {
  window.addEventListener(`load`, () => {
    window.load(window.render.table, window.render.message);
    window.state.update();
    window.state.change();
  });
})();
