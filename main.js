import "./style.css";
import io from "socket.io-client";

const spectorServer = import.meta.env.VITE_SERVER_HOST;
const socket = io(spectorServer, { autoConnect: false });
socket.auth = { video: true };
socket.connect();

const appContainer = document.querySelector("#js-app");
const videoPlayerTpl = document.querySelector("#js-video-player");
const buttonTpl = document.querySelector("#js-button-tpl");
const waitingTpl = document.querySelector("#js-waiting-tpl");
const offlineTpl = document.querySelector("#js-disconnected-tpl");
const connectedTpl = document.querySelector("#js-connected-tpl");

let currentScreen = null;

const cloneTemplate = (element) => document.importNode(element.content, true);

const showScreen = (templateElement) => {
  const clone = cloneTemplate(templateElement);
  const cloneContainer = document.createElement("div");
  cloneContainer.classList.add("frame");
  cloneContainer.appendChild(clone);
  if (currentScreen) {
    currentScreen = appContainer.replaceChild(cloneContainer, currentScreen);
  } else {
    currentScreen = appContainer.appendChild(cloneContainer);
  }

  return currentScreen;
};

socket.on("connect", () => {
  console.log("connected to server");
  showScreen(connectedTpl);
});
socket.on("disconnect", () => {
  console.log("disconnect");
  showScreen(offlineTpl);
});

//When dom is loaded and ready
document.addEventListener("DOMContentLoaded", function () {
  const btnTpl = showScreen(buttonTpl);
  const btnElement = btnTpl.querySelector("button");
  btnElement.addEventListener("click", () => {
    showScreen(waitingTpl);
  });
});
