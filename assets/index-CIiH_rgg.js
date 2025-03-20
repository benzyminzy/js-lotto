var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _numbers, _selectedNumbers, _prizes, _lottos, _prizes2, _winningNumbers, _bonusNumbers, _numbers2;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
async function handleError(operation, onError) {
  try {
    return await operation();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}
class DuplicatedLottoNumber extends Error {
  constructor() {
    super("로또 번호는 중복될 수 없습니다.");
  }
}
class InvalidLottoLength extends Error {
  constructor(requiredLength) {
    super(`로또 번호는 ${requiredLength}개를 입력해 주세요.`);
  }
}
class InvalidLottoRange extends Error {
  constructor(min, max) {
    super(`${min} 이상 ${max} 이하 숫자를 입력해 주세요.`);
  }
}
class InvalidLottoType extends Error {
  constructor() {
    super("로또 번호는 숫자만 입력 가능합니다.");
  }
}
const _LottoNumbers = class _LottoNumbers {
  constructor({
    numbers,
    count = _LottoNumbers.LOTTO_SELECTION_COUNT,
    min = _LottoNumbers.NUMBER_MIN_RANGE,
    max = _LottoNumbers.NUMBER_MAX_RANGE
  }) {
    __privateAdd(this, _numbers, []);
    _LottoNumbers.validateLottoNumbers(numbers, count, min, max);
    __privateSet(this, _numbers, numbers);
  }
  static validateLottoNumbers(numbers, count, min, max) {
    _LottoNumbers.validateNumberType(numbers);
    _LottoNumbers.validateDuplication(numbers);
    _LottoNumbers.validateNumberLength(numbers, count);
    _LottoNumbers.validateNumberRange(numbers, min, max);
  }
  static validateNumberType(numbers) {
    if (numbers.some((number) => !Number.isInteger(number))) {
      throw new InvalidLottoType();
    }
  }
  static validateDuplication(numbers) {
    if (new Set(numbers).size !== numbers.length) {
      throw new DuplicatedLottoNumber();
    }
  }
  static validateNumberLength(numbers, count) {
    if (numbers.length !== count) {
      throw new InvalidLottoLength(count);
    }
  }
  static validateNumberRange(numbers, min, max) {
    if (numbers.some((number) => number < min || number > max)) {
      throw new InvalidLottoRange(min, max);
    }
  }
  getMatchCount(numbers) {
    return __privateGet(this, _numbers).filter((num) => numbers.includes(num)).length;
  }
  get values() {
    return [...__privateGet(this, _numbers)];
  }
};
_numbers = new WeakMap();
__publicField(_LottoNumbers, "LOTTO_SELECTION_COUNT", 6);
__publicField(_LottoNumbers, "NUMBER_MIN_RANGE", 1);
__publicField(_LottoNumbers, "NUMBER_MAX_RANGE", 45);
let LottoNumbers = _LottoNumbers;
class Lottos {
  constructor({
    numbers,
    count = LottoNumbers.LOTTO_SELECTION_COUNT,
    min = LottoNumbers.NUMBER_MIN_RANGE,
    max = LottoNumbers.NUMBER_MAX_RANGE
  } = {}) {
    __privateAdd(this, _selectedNumbers);
    const selectedNumbers = numbers ?? this.generateUniqueNumbers(min, max, count);
    __privateSet(this, _selectedNumbers, new LottoNumbers({
      numbers: selectedNumbers,
      count,
      min,
      max
    }));
  }
  generateUniqueNumbers(min, max, count) {
    const numbers = /* @__PURE__ */ new Set();
    while (numbers.size < count) {
      numbers.add(this.getRandomNumber(min, max));
    }
    return Array.from(numbers);
  }
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  getMatchCount(numbers) {
    return __privateGet(this, _selectedNumbers).values.filter(
      (selectedNumber) => numbers.includes(selectedNumber)
    ).length;
  }
  get values() {
    return [...__privateGet(this, _selectedNumbers).values];
  }
}
_selectedNumbers = new WeakMap();
const _LottoPrizes = class _LottoPrizes {
  constructor(conditions = _LottoPrizes.PRIZE_CONDITIONS) {
    __privateAdd(this, _prizes, []);
    __privateSet(this, _prizes, conditions.map((condition) => {
      return { ...condition, matchCount: 0 };
    }));
  }
  getPrizeMoney() {
    return __privateGet(this, _prizes).filter((prize) => prize.matchCount > 0).reduce((acc, prize) => acc + prize.prizeMoney * prize.matchCount, 0);
  }
  checkPrizeMatch(matchedResults) {
    __privateGet(this, _prizes).forEach((prize) => {
      const matchedLotto = matchedResults.filter((result) => {
        const isMatchCountEqual = result.matchCount === prize.requiredMatchCount;
        const isBonusMatchValid = prize.bonusMatched === result.bonusMatched;
        return isMatchCountEqual && isBonusMatchValid;
      });
      prize.matchCount = matchedLotto.length;
    });
  }
  get status() {
    return __privateGet(this, _prizes).map((prize) => {
      return { ...prize };
    });
  }
};
_prizes = new WeakMap();
__publicField(_LottoPrizes, "PRIZE_CONDITIONS", [
  {
    requiredMatchCount: 3,
    bonusMatched: false,
    prizeMoney: 5e3
  },
  {
    requiredMatchCount: 4,
    bonusMatched: false,
    prizeMoney: 5e4
  },
  {
    requiredMatchCount: 5,
    bonusMatched: false,
    prizeMoney: 15e5
  },
  {
    requiredMatchCount: 5,
    bonusMatched: true,
    prizeMoney: 3e7
  },
  {
    requiredMatchCount: 6,
    bonusMatched: false,
    prizeMoney: 2e9
  }
]);
let LottoPrizes = _LottoPrizes;
class LottoPurchaseError extends Error {
  constructor(purchaseUnit) {
    super(`구입 금액은 ${purchaseUnit}원 단위로 입력해야 합니다.`);
  }
}
const _LottoGame = class _LottoGame {
  constructor(lottos, prizes) {
    __privateAdd(this, _lottos);
    __privateAdd(this, _prizes2);
    __privateSet(this, _lottos, lottos);
    __privateSet(this, _prizes2, prizes ?? new LottoPrizes());
  }
  static validatePurchaseAmount(purchaseAmount, price) {
    if (!Number.isInteger(purchaseAmount) || purchaseAmount < 0 || purchaseAmount % price !== 0) {
      throw new LottoPurchaseError(price);
    }
  }
  purchase(purchaseAmount) {
    _LottoGame.validatePurchaseAmount(purchaseAmount, _LottoGame.PRICE_PER_LOTTO);
    const quantity = purchaseAmount / _LottoGame.PRICE_PER_LOTTO;
    __privateSet(this, _lottos, Array.from({ length: quantity }, () => new Lottos()));
    return __privateGet(this, _lottos).map((lotto) => lotto.values);
  }
  getReturnRate() {
    const prizeMoney = __privateGet(this, _prizes2).getPrizeMoney();
    const returnRate = prizeMoney / (__privateGet(this, _lottos).length * _LottoGame.PRICE_PER_LOTTO) * 100;
    return Math.floor(returnRate);
  }
  getMatchedResults(winningNumbers, bonusNumbers) {
    return __privateGet(this, _lottos).map((lottos) => {
      const matchCount = lottos.getMatchCount(winningNumbers);
      const bonusMatched = !!lottos.getMatchCount(bonusNumbers);
      return { matchCount, bonusMatched };
    });
  }
  draw(drawNumbers) {
    const { winningNumbers, bonusNumbers } = drawNumbers.values;
    const lottoMatchedResults = this.getMatchedResults(
      winningNumbers,
      bonusNumbers
    );
    __privateGet(this, _prizes2).checkPrizeMatch(lottoMatchedResults);
    return __privateGet(this, _prizes2).status;
  }
};
_lottos = new WeakMap();
_prizes2 = new WeakMap();
__publicField(_LottoGame, "PRICE_PER_LOTTO", 1e3);
let LottoGame = _LottoGame;
class DrawNumbers {
  constructor({ winningNumbers, bonusNumbers }) {
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumbers);
    LottoNumbers.validateDuplication([
      ...winningNumbers.values,
      ...bonusNumbers.values
    ]);
    __privateSet(this, _winningNumbers, winningNumbers);
    __privateSet(this, _bonusNumbers, bonusNumbers);
  }
  get values() {
    return {
      winningNumbers: __privateGet(this, _winningNumbers).values,
      bonusNumbers: __privateGet(this, _bonusNumbers).values
    };
  }
}
_winningNumbers = new WeakMap();
_bonusNumbers = new WeakMap();
class AbstractLottoNumbers {
  constructor({ numbers, min, max, count }) {
    __privateAdd(this, _numbers2);
    __privateSet(this, _numbers2, new LottoNumbers({
      numbers,
      min,
      max,
      count
    }));
  }
  get values() {
    return [...__privateGet(this, _numbers2).values];
  }
}
_numbers2 = new WeakMap();
class WinningNumbers extends AbstractLottoNumbers {
  constructor({ numbers, min, max, count }) {
    super({ numbers, min, max, count });
  }
}
const _BonusNumbers = class _BonusNumbers extends AbstractLottoNumbers {
  constructor({ numbers, min, max, count = _BonusNumbers.BONUS_NUMBER_COUNT }) {
    super({
      numbers,
      min,
      max,
      count
    });
  }
};
__publicField(_BonusNumbers, "BONUS_NUMBER_COUNT", 1);
let BonusNumbers = _BonusNumbers;
function validateNumericInput(input, maxLength) {
  input.value = input.value.replace(/[^0-9]/g, "").slice(0, maxLength);
}
function setForm(form, onSubmit) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmit(new FormData(form));
  });
  return form;
}
function setupPurchaseForm(onSubmit) {
  const form = document.querySelector(".purchase-section form");
  setForm(form, (formData) => {
    const purchaseAmount = formData.get("purchase-amount");
    onSubmit(purchaseAmount);
  });
  const input = form.querySelector("input");
  input.addEventListener("input", () => validateNumericInput(input, 6));
}
function setupDrawNumbersForm(onSubmit) {
  const form = document.querySelector(".draw-numbers-section form");
  setForm(form, (formData) => {
    const winningNumbers = formData.getAll("winningNumbers");
    const bonusNumber = formData.getAll("bonusNumber");
    onSubmit(winningNumbers, bonusNumber);
  });
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => validateNumericInput(input, 2));
  });
}
function resetForms() {
  const purchaseForm = document.querySelector(".purchase-section form");
  const drawNumbersForm = document.querySelector(".draw-numbers-section form");
  purchaseForm.reset();
  drawNumbersForm.reset();
}
function handlePurchaseFormSubmit({ onSubmit }) {
  setupPurchaseForm((value) => {
    const purchasedAmount = Number(value);
    onSubmit(purchasedAmount);
  });
}
function handleDrawNumbersFormSubmit({ onSubmit }) {
  setupDrawNumbersForm((winningNumbersInput, bonusNumberInput) => {
    const winningNumbers = winningNumbersInput.map((value) => Number(value));
    const bonusNumbers = bonusNumberInput.map((value) => Number(value));
    onSubmit(winningNumbers, bonusNumbers);
  });
}
function createModalContainer() {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  return modalContainer;
}
function createModalContentWrapper() {
  const modalContent = document.createElement("section");
  modalContent.classList.add("modal-content");
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", closeModal);
  modalContent.append(closeButton);
  return modalContent;
}
function createModalHeader(title) {
  const modalHeader = document.createElement("header");
  modalHeader.textContent = title;
  return modalHeader;
}
function createModalButton(text, onClick) {
  const modalButton = document.createElement("button");
  modalButton.classList.add("modal-button");
  modalButton.textContent = text;
  modalButton.addEventListener("click", () => {
    onClick();
    closeModal();
  });
  return modalButton;
}
function createModalText(text) {
  const modalText = document.createElement("p");
  modalText.classList.add("modal-text");
  modalText.textContent = text;
  return modalText;
}
function createModalTableHeader(columns) {
  const header = document.createElement("thead");
  const headerLow = document.createElement("tr");
  const headerCells = columns.map((column) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = column;
    return headerCell;
  });
  headerLow.append(...headerCells);
  header.append(headerLow);
  return header;
}
function createModalTableBody(rows) {
  const body = document.createElement("tbody");
  const bodyRows = rows.map((row) => {
    const bodyRow = document.createElement("tr");
    const bodyCells = row.map((cell) => {
      const bodyCell = document.createElement("td");
      bodyCell.textContent = cell;
      return bodyCell;
    });
    bodyRow.append(...bodyCells);
    return bodyRow;
  });
  body.append(...bodyRows);
  return body;
}
function createModalContent(columns, rows) {
  const table = document.createElement("table");
  const header = createModalTableHeader(columns);
  const body = createModalTableBody(rows);
  table.append(header, body);
  return table;
}
function createModal({
  title,
  text,
  buttonText,
  onClick,
  columns = [],
  rows = []
}) {
  const modalContainer = createModalContainer();
  const modalContentWrapper = createModalContentWrapper();
  const modalHeader = createModalHeader(title);
  const modalContent = createModalContent(columns, rows);
  const modalText = createModalText(text);
  const modalButton = createModalButton(buttonText, onClick);
  modalContentWrapper.append(modalHeader, modalContent, modalText, modalButton);
  modalContainer.append(modalContentWrapper);
  return modalContainer;
}
function closeModal() {
  const modal = document.querySelector(".modal-container");
  modal.remove();
}
function showPurchaseResultStep() {
  const section = document.querySelector(".purchase-result-step");
  section.style.visibility = "visible";
}
function hidePurchaseResultStep() {
  const section = document.querySelector(".purchase-result-step");
  section.style.visibility = "hidden";
}
function removePurchaseResult() {
  const resultSection = document.querySelector(".result-section");
  resultSection.replaceChildren();
}
function createResultText(quantity) {
  const resultText = document.createElement("p");
  resultText.textContent = `총 ${quantity}개를 구매하였습니다.`;
  return resultText;
}
function createResultLottoList(purchasedLottos) {
  const resultLottoList = document.createElement("ul");
  const resultLottos = purchasedLottos.map((lotto) => {
    const lottoText = document.createElement("li");
    lottoText.textContent = lotto.join(", ");
    return lottoText;
  });
  resultLottoList.append(...resultLottos);
  return resultLottoList;
}
function printPurchaseResult(quantity, purchasedLottos) {
  const resultSection = document.querySelector(".result-section");
  const resultText = createResultText(quantity);
  const resultLottoList = createResultLottoList(purchasedLottos);
  resultSection.append(resultText, resultLottoList);
}
function showResultModal({ text, onClick, rows }) {
  const modal = createModal({
    title: "🏆 당첨 통계 🏆",
    text,
    buttonText: "다시 시작하기",
    onClick,
    columns: ["일치 갯수", "당첨금", "당첨 갯수"],
    rows
  });
  document.body.appendChild(modal);
}
function updatePurchasedResultView(quantity, purchasedLottos) {
  removePurchaseResult();
  showPurchaseResultStep();
  printPurchaseResult(quantity, purchasedLottos);
}
function openResultModal({ rate, results, onClick }) {
  const convertedResults = results.map((result) => {
    return [
      `${result.requiredMatchCount}개 일치${result.bonusMatched ? " + 보너스볼" : ""}`,
      result.prizeMoney.toLocaleString(),
      result.matchCount
    ];
  });
  showResultModal({
    text: `당신의 총 수익률은 ${rate}%입니다.`,
    onClick,
    rows: convertedResults
  });
}
function resetPurchaseResult() {
  removePurchaseResult();
  hidePurchaseResultStep();
}
function purchaseLottos(lottoGame, purchaseAmount) {
  const purchasedLottos = lottoGame.purchase(purchaseAmount);
  const quantity = purchasedLottos.length;
  updatePurchasedResultView(quantity, purchasedLottos);
}
function drawLottos(lottoGame, winningNumbers, bonusNumbers) {
  const drawNumbers = new DrawNumbers({
    winningNumbers: new WinningNumbers({ numbers: winningNumbers }),
    bonusNumbers: new BonusNumbers({ numbers: bonusNumbers })
  });
  return lottoGame.draw(drawNumbers);
}
function resetGame() {
  const newGame = new LottoGame(new LottoPrizes());
  resetForms();
  resetPurchaseResult();
  return newGame;
}
function showResults(rate, results, callback) {
  openResultModal({
    rate,
    results,
    onClick: callback
  });
}
function initializeGame() {
  let lottoGame = new LottoGame(new LottoPrizes());
  handlePurchaseFormSubmit({
    onSubmit: (purchaseAmount) => handleError(() => purchaseLottos(lottoGame, purchaseAmount))
  });
  handleDrawNumbersFormSubmit({
    onSubmit: (winningNumbers, bonusNumbers) => handleError(() => {
      const results = drawLottos(lottoGame, winningNumbers, bonusNumbers);
      const rate = lottoGame.getReturnRate();
      showResults(rate, results, () => {
        lottoGame = resetGame();
      });
    })
  });
}
window.addEventListener("load", initializeGame);
