import express, { json } from "express";
import cors from "cors";
import { firestore, rtdb } from "./dataBase";

const PORT = process.env.PORT || 3000;
const ROOT_PATH = __dirname.replace("src/back", "");
const app = express();

app.use(json());
app.use(cors());

app.get("/up", (req, res) => {
   res.send("Server UP");
});
app.post("/signup", async (req, res) => {
   let exists = await firestore
      .collection("/users")
      .where("email", "==", req.body.email)
      .get()
      .then((snap) => {
         return !snap.empty;
      });

   if (!exists) {
      const userId = (await firestore.collection("/users").add(req.body)).id;

      return res.status(201).json(userId);
   } else {
      return res.status(400).send({ message: "user already exists" });
   }
});

app.post("/signin", async (req, res) => {
   const userId = await firestore
      .collection("/users")
      .where("email", "==", req.body.email)
      .get();
   if (!userId.empty) {
      return res
         .status(202)
         .json({ ...userId.docs[0].data(), id: userId.docs[0].id });
   } else {
      return res.status(400).send({ message: "user not found" });
   }
});

app.post("/rooms", async (req, res) => {
   const shortId = Math.floor(Math.random() * 8999 + 1000);
   const longId = rtdb.ref("/rooms").push({ users: [req.body.user] }).key;

   await firestore
      .collection("/rooms")
      .doc(shortId.toString())
      .set({ rtdbId: longId, users: [req.body.user] });

   res.status(201).send(JSON.stringify({ shortId, longId }));
});

app.get("/rooms/:roomId", async (req, res) => {
   const user = await firestore.doc(`/users/${req.query.userId}`).get();

   if (!user.exists) {
      return res.status(404).send({
         message: "User not found, must be registered user",
         user: false,
         room: false,
      });
   }

   const room = (
      await firestore.doc(`/rooms/${req.params.roomId}`).get()
   ).data();

   if (!room) {
      return res.status(404).send({
         message: "room id not valid. There is no room with your id",
         user: true,
         room: false,
      });
   }

   const userExists = room?.users.find(
      (u: { email: string }) => u.email == user.data()?.email
   );

   if (!userExists) {
      await firestore
         .doc(`/rooms/${req.params.roomId}`)
         .update({ users: [...room.users, user.data()] });

      const rtdbUsers = (
         await rtdb.ref(`/rooms/${room.rtdbId}/users`).get()
      ).val();

      await rtdb
         .ref(`/rooms/${room.rtdbId}`)
         .update({ users: [...rtdbUsers, user.data()] });
   }

   return res.json(room.rtdbId);
});

app.post("/messages", (req, res) => {
   const { room, message } = req.body;

   const response = rtdb.ref(`/rooms/${room}/messages`).push(message);

   res.send(response);
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
   res.sendFile(ROOT_PATH + "dist/index.html");
});

app.listen(PORT, () =>
   console.log(
      `listening on port ${PORT} and the environment is ${process.env.ENVIRONMENT}`
   )
);
