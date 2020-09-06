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
