// error.js

const mainDisplayElement = document.getElementById("result"); // main.js에서 DOM 선택을 담당하는 것이 더 좋음
const subDisplayElement = document.getElementById("sub-display"); // main.js에서 DOM 선택을 담당하는 것이 더 좋음

/**
 * 메인 디스플레이에 에러 메시지를 표시하고 에러 스타일을 적용합니다.
 * @param {string} message - 표시할 에러 메시지.
 */
export function showError(message) {
    if (mainDisplayElement) {
        mainDisplayElement.textContent = message;
        mainDisplayElement.classList.add("error");
    }
    if (subDisplayElement) {
        subDisplayElement.textContent = "Error!"; // 보조 디스플레이에도 에러 표시
    }
}

/**
 * 메인 디스플레이에서 에러 메시지와 스타일을 제거합니다.
 */
export function removeError() {
    if (mainDisplayElement) {
        mainDisplayElement.textContent = "0"; // 에러 제거 시 기본값으로 복원
        mainDisplayElement.classList.remove("error");
    }
    if (subDisplayElement) {
        subDisplayElement.textContent = ""; // 보조 디스플레이 초기화
    }
}