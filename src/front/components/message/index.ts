function initMessage() {
   class Message extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const shadow = this.attachShadow({ mode: "open" });
         const container = document.createElement("div");
         const user = document.createElement("span");
         const messageContainer = document.createElement("div");
         const message = document.createElement("p");
         const userContent = this.getAttribute("user");
         const color = this.getAttribute("color");
         const messageContent = this.getAttribute("message");
         const sender = this.getAttribute("sender");
         const style = document.createElement("style");

         container.classList.add(`container-${sender}`);
         messageContainer.classList.add(`${sender}`);

         user.textContent = userContent;

         message.textContent = messageContent;

         style.textContent = `
          .container-me{
             margin: 10px 0;
             display:flex;
             flex-direction: column;
             align-items: flex-end;
             justify-content: center;
             font-family:'Roboto', sans-serif;
          }
          .container-other{
             margin: 10px 0;
             display:flex;
             flex-direction: column;
             align-items: flex-start;
             justify-content: center;
             font-family:'Roboto', sans-serif;
          }
         .me{
            border-radius: 4px;
            padding:15px;
            background-color: #B9E97C;
            max-width:50%;
          }
          .me>p{
             margin: 0px;
             text-align: end;
          }
         .other{
            border-radius: 4px;
            padding:15px;
            background-color: ${color ? color : "#D8D8D8"};
            max-width:50%;
          }
          .other>p{
             margin: 0px;
          }
         `;

         container.append(user, messageContainer);
         messageContainer.append(message);
         shadow.append(container, style);
      }
   }
   customElements.define("message-comp", Message);
}

export { initMessage };
