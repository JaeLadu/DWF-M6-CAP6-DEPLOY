import { Router } from "@vaadin/router";
import { state } from "../../state";

function initUserPage() {
   class UserPage extends HTMLElement {
      constructor() {
         super();
      }
      async onBeforeEnter(location, commands, router) {
         const user = await state.getUser();
         if (!user) {
            return commands.redirect("/");
         }
      }

      async connectedCallback() {
         const user = await state.getUser();

         const header = document.createElement("header-comp");
         const container = document.createElement("div");
         const title = document.createElement("h1");
         const form = document.createElement("form-comp");
         const style = document.createElement("style");

         container.classList.add("container");

         title.classList.add("title");
         title.textContent = `Bienvenido ${user.name}`;

         form.setAttribute("type", "user");
         form.setAttribute("button", "Comenzar");
         form.addEventListener("newSubmit", async (e) => {
            //recupera los datos del form desde el custom event
            const formData = (e as CustomEvent).detail;
            //inicia todo el proceso de conectar la dataBase, que devuelve true si es exitoso
            //y false si algo salió mal
            const connected = await state.enterChatRoom(formData);

            if (connected) {
               //si todo sale bien, redirecciona a la página de chat
               Router.go("/chat");
               return;
            } else {
               form.setAttribute("incorrectId", "true");
            }
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
        }
        form-comp{
           margin-bottom: 70px;
        }
        `;

         container.append(title, form);
         this.append(header, container, style);
      }
   }
   customElements.define("user-page", UserPage);
}

export { initUserPage };
