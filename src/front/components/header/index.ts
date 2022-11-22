function initHeader() {
   class Header extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const header = document.createElement("header");
         const style = document.createElement("style");

         style.textContent = `
         header{
            width: 100%;
            height: 60px;
            background-color: #FF8282;
         }
         `;
         this.append(header, style);
      }
   }
   customElements.define("header-comp", Header);
}

export { initHeader };
