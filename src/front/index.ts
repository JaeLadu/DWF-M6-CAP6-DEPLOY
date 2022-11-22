import { initChat } from "./components/chat";
import { initForm } from "./components/form";
import { initHeader } from "./components/header";
import { initMessage } from "./components/message";
import { initChatPage } from "./pages/chat";
import { initUserPage } from "./pages/user/indext";
import { initWelcomePage } from "./pages/welcome";
import { initRouter } from "./router";
(() => {
   initHeader();
   initForm();
   initMessage();
   initChat();
   initChatPage();
   initUserPage();
   initWelcomePage();
   const root =
      document.querySelector(".root") || document.createElement("div");
   initRouter(root);
})();
