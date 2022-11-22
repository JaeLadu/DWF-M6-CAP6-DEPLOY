import { state } from "../../state";

function initChat() {
   class ChatComp extends HTMLElement {
      constructor() {
         super();
         state.subscribe(() => this.render());
      }

      connectedCallback() {
         const container = document.createElement("div");

         container.style.overflow = "scroll";
         container.style.maxHeight = "55vh";
         this.append(container);

         this.render();
      }
      async render() {
         console.log("render");

         const container =
            this.querySelector("div") || document.createElement("div");
         const messages = state.getMessages();
         const user = await state.getUser();

         container.innerHTML = "";
         for (const m in messages) {
            const message = document.createElement("message-comp");
            if (messages[m].id == user.id) {
               message.setAttribute("sender", "me");
            } else {
               message.setAttribute("sender", "other");
            }
            message.setAttribute("message", messages[m].message);
            message.setAttribute("user", messages[m].name);
            message.setAttribute("color", messages[m].color);

            container.append(message);
            container.scroll({
               top: container.scrollHeight,
            });
         }
      }
   }

   customElements.define("chat-comp", ChatComp);
}

export { initChat };
