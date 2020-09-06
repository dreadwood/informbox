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
