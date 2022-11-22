import randomColor from "randomcolor";
import { rtdb } from "./dataBase";
import { ref, onValue } from "firebase/database";

const BACKENDURL = "http://localhost:3000";

const state = {
   data: {
      user: {
         name: "",
         email: "",
         color: "",
      },
      messages: {},
   },
   subscribed: [],

   subscribe(f) {
      this.subscribed.push(f);
   },

   async getUser(email?: string) {
      //si la función recibe un email, pide el id del usuario al back usando el mail y en la misma linea usa
      //la funcion .json() para parsear la respuesta
      if (email) {
         const response = await fetch(`${BACKENDURL}/signin`, {
            method: "post",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
         });
         const user = await response.json();
         //si el back devuelve un usuario, lo usa para setear el usuario local y lo retorna
         if (user.email) {
            this.data.user = { ...user };

            localStorage.setItem(
               "DWFRoomsUser",
               JSON.stringify(this.data.user)
            );

            return this.data.user;
         }
      }
      //Si el back no devuelve nada, chequea si user ya tiene datos. Si los tiene, lo devuelve
      if (this.data.user.id) {
         return this.data.user;
      }
      const local = localStorage.getItem("DWFRoomsUser");
      //Si user no tiene datos, busca en local si hay algo guardado, si hay algo, lo recupera y lo devuelve
      if (local) {
         this.data.user = JSON.parse(local);
         return this.data.user;
      }
      //si todo lo anterior falla, devuelve un objeto vacío
      return {};
   },

   async setNewUser(user) {
      //setea el user con todo lo que le pase dentro de un objeto a la función
      this.data.user = { ...user, color: randomColor() };
      //guarda el user en la base de datos y recibe el id en userId
      const userId = await (
         await fetch(`${BACKENDURL}/signup`, {
            method: "post",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(this.data.user),
         })
      ).json();
      //le agrega el id de la base de datos al usuario
      this.data.user.id = userId;
      //guarda el usuario con todos los datos nuevos en local
      localStorage.setItem("DWFRoomsUser", JSON.stringify(this.data.user));
   },

   removeLocalUser() {
      this.data.user = {};
      localStorage.removeItem("DWFRoomsUser");
      this.data.room = "";
   },

   async setNewRoom(user) {
      //mando un post para crear el nuevo room, parseo la respuesta y la guardo en roomId, todo en la misma linea
      const roomId = await (
         await fetch(`${BACKENDURL}/rooms`, {
            method: "post",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
         })
      ).json();

      this.setLocalRoom(roomId);
   },

   async getRoom(shortId: string, userId: string) {
      //manda un get al back para que le dé el id de la room cuyo shortId es el que se pasa
      //en parametro y lo devuelve
      try {
         const roomId = await (
            await fetch(`${BACKENDURL}/rooms/${shortId}?userId=${userId}`)
         ).json();
         this.setLocalRoom({ shortId, longId: roomId });
      } catch (e) {
         console.log(e);

         return e;
      }
   },

   connectDB(roomId: string) {
      //limpia cualquier mensaje viejo que pueda haber quedado
      this.data.messages = {};

      //conecta la rtdb en la room específica que se pasa como parámetro y actualiza
      //mensajes cada vez que la rtdb manda data nueva.
      //también hace que todas las funciones subscrptas se ejecuten con la nueva data de mensajes

      onValue(ref(rtdb, `rooms/${roomId}`), (snap) => {
         this.data.messages = { ...snap.val().messages };
         this.subscribed.forEach((f) => {
            f();
         });
      });
   },

   setLocalRoom(room: { shortId: string; longId: string }) {
      this.data.room = room;
   },
   getLocalRoom() {
      return this.data.room;
   },

   getMessages() {
      return this.data.messages;
   },
   async pushMessage(message: string) {
      //Manda el mensaje al backend para que lo escriba en la rtdb
      fetch(`${BACKENDURL}/messages`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            message: { ...(await this.getUser()), message },
            room: this.getLocalRoom().longId,
         }),
      });
   },

   async enterChatRoom(userAndRoomData) {
      //Chequea si el user existe
      let user = await this.getUser(userAndRoomData.email);
      //Chequea si el user quiere crear una room nueva
      const newRoom = userAndRoomData.room == "Nuevo room";

      //si el user no existe, lo crea
      if (!user.id) {
         await this.setNewUser({
            name: userAndRoomData.name,
            email: userAndRoomData.email,
         });
         user = await this.getUser();
      }
      //si el user quiere una nueva room, la crea
      if (newRoom) {
         await this.setNewRoom(user);
      }
      //si el user conoce la room a la que quiere entrar, busca esa room en la base de datos

      if (!newRoom) {
         await this.getRoom(userAndRoomData.roomId, user.id);
      }

      if (this.getLocalRoom()) {
         //checkea que room no sea undefined y conecta la rtdb con ese valor
         this.connectDB(this.getLocalRoom().longId);
         return true;
      } else {
         //si room no es lo que se espera, devuelve false para que quien llame a la función
         //sepa que algo salió mal
         return false;
      }
   },
};

export { state };
