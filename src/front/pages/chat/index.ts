import { state } from "../../state";

function initChatPage() {
   class ChatPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const header = document.createElement("header-comp");
         const container = document.createElement("div");
         const titlesContainer = document.createElement("div");
         const title = document.createElement("h1");
         const subtitle = document.createElement("h3");
         const chat = document.createElement("chat-comp");
         const form = document.createElement("form-comp");
         const style = document.createElement("style");

         container.classList.add("container");

         titlesContainer.classList.add("titles-container");

         title.classList.add("title");
         title.textContent = "Chat";

         subtitle.classList.add("subtitle");
         subtitle.textContent = `Room ID: ${state.getLocalRoom().shortId}`;

         form.setAttribute("type", "chat");
         form.addEventListener("newMessage", (e) => {
            const { message } = (e as CustomEvent).detail;

            state.pushMessage(message);
         });

         style.textContent = `
         .container{
            padding: 1px 30px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: calc(100vh - 60px);
         }
         .title{
            font-family: 'Roboto', sans-serif;
            font-size: 52px;
            font-weight: 700;
            margin: 16px 0;
         }
         .subtitle{
            font-family: 'Roboto', sans-serif;
            font-size: 24px;
            font-weight: 500;

         }
         form-comp{
            margin-bottom: 30px;
         }
         `;
         titlesContainer.append(title, subtitle);
         container.append(titlesContainer, chat, form);
         this.append(header, container, style);
      }
   }
   customElements.define("chat-page", ChatPage);
}
export { initChatPage };
