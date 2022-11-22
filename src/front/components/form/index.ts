import { Router } from "@vaadin/router";
import { state } from "../../state";

function initForm() {
   class FormComp extends HTMLElement {
      constructor() {
         super();
      }

      static get observedAttributes() {
         return ["incorrectId"];
      }
      attributeChangedCallback(name, oldV, newV) {
         if (newV == "true") {
            this.querySelector(".room-id")?.classList.add("error");
         }
      }

      connectedCallback() {
         const form = document.createElement("form");
         const style = document.createElement("style");
         const type = this.getAttribute("type");
         const buttonText = this.getAttribute("button");

         if (type == "no-user") {
            form.innerHTML = `
            <form>
            <label class="name">
               <span>Tu nombre</span>
               <input type="text" name="name" />
            </label>
            <label class="email">
               <span>Tu mail</span>
               <input type="email" name="email" />
            </label>
            <label>
               <span>Room</span>
               <select name="room" class="room">
                  <option value="Nuevo room">Nuevo room</option>
                  <option value="Room existente">Room existente</option>
               </select>
            </label>
            <button>${buttonText || "Enviar"}</button>
         </form>
         
         `;

            form.addEventListener("change", () => {
               const formData = new FormData(form);
               const data = Object.fromEntries(formData);
               const roomIdExists =
                  form.lastElementChild?.previousElementSibling?.className ==
                  "room-id";

               if (data.room == "Nuevo room" && roomIdExists) {
                  form.lastElementChild?.previousElementSibling?.remove();
               } else if (data.room == "Room existente" && !roomIdExists) {
                  const label = document.createElement("label");
                  const labelTitle = document.createElement("span");
                  const input = document.createElement("input");

                  label.classList.add("room-id");
                  labelTitle.textContent = "Room id";
                  input.type = "text";
                  input.name = "roomId";

                  label.append(labelTitle, input);

                  form.lastElementChild?.insertAdjacentElement(
                     "beforebegin",
                     label
                  );
               }
            });

            form.addEventListener("submit", (e) => {
               e.preventDefault();

               const formData = new FormData(form);
               const data = Object.fromEntries(formData);
               const newSubmit = new CustomEvent("newSubmit", {
                  bubbles: true,
                  detail: data,
               });
               this.dispatchEvent(newSubmit);
            });
         }

         if (type == "user") {
            form.innerHTML = `
            <form>
               <label>
                  <span>Room</span>
                  <select name="room" class="room">
                     <option value="Nuevo room">Nuevo room</option>
                     <option value="Room existente">Room existente</option>
                  </select>
               </label>
                  <div class="buttons-container">
                     <button>${buttonText || "Enviar"}</button>
                  </div>
               </form>
            `;

            const backButton = document.createElement("button");
            backButton.textContent = "Cambiar de usuario";
            backButton.addEventListener("click", () => {
               state.removeLocalUser();
               Router.go("/");
            });
            form.querySelector(".buttons-container")?.append(backButton);

            form.addEventListener("change", () => {
               const formData = new FormData(form);
               const data = Object.fromEntries(formData);
               const roomIdExists = form.querySelector(".room-id");

               if (data.room == "Nuevo room" && roomIdExists) {
                  form.lastElementChild?.previousElementSibling?.remove();
               } else if (data.room == "Room existente" && !roomIdExists) {
                  const label = document.createElement("label");
                  const labelTitle = document.createElement("span");
                  const input = document.createElement("input");

                  label.classList.add("room-id");
                  labelTitle.textContent = "Room id";
                  input.type = "text";
                  input.name = "roomId";

                  label.append(labelTitle, input);

                  form.lastElementChild?.insertAdjacentElement(
                     "beforebegin",
                     label
                  );
               }
            });

            form.addEventListener("submit", (e) => {
               e.preventDefault();

               const formData = new FormData(form);
               const data = Object.fromEntries(formData);
               const newSubmit = new CustomEvent("newSubmit", {
                  bubbles: true,
                  detail: data,
               });
               this.dispatchEvent(newSubmit);
            });
         }

         if (type == "chat") {
            form.innerHTML = `

         <form>

            <input type="text" name="message" />

            <button>Enviar</button>

         </form>

         `;

            form.addEventListener("submit", (e) => {
               e.preventDefault();

               const formData = new FormData(form);
               const data = Object.fromEntries(formData);
               const newMessage = new CustomEvent("newMessage", {
                  bubbles: true,
                  detail: data,
               });
               this.dispatchEvent(newMessage);
               form.reset();
            });
         }

         style.textContent = `
         label{
            display: block;
            margin: 10px 0px;
         }
         span{
            display: block;
            font-family: 'Roboto', sans-serif;
            font-size: 24px;
            font-weigth:500;
         }
         select, input{
            height: 55px;
            width: 100%;
            border: 2px black solid;
            border-radius: 4px;
            font-family: 'Roboto', sans-serif;
            font-size: 24px;
            font-weigth:500;
         }
         .error{
            border: 2px red solid;
         }
         button{
            height: 55px;
            width: 100%;
            margin: 5px 0;
            background-color: #9CBBE9;
            border: none;
            border-radius: 4px;
            font-family: 'Roboto', sans-serif;
            font-size: 22px;
            font-weigth:500;

         }
         `;

         this.append(form, style);
      }
   }
   customElements.define("form-comp", FormComp);
}

export { initForm };
