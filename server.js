import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // permite conexiones desde cualquier origen
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Esquema de reservas
const reservaSchema = new mongoose.Schema({
  numero: { type: Number, unique: true },
  nombre: String,
  sala: String,
  telefono: String,
});
const Reserva = mongoose.model("Reserva", reservaSchema);

// Endpoints
app.get("/", (req, res) => res.send("Backend Rifa del Jardín funcionando ✅"));

app.get("/reservas", async (req, res) => {
  const reservas = await Reserva.find({});
  res.json(reservas);
});

app.post("/reservas", async (req, res) => {
  const { numero, nombre, sala, telefono } = req.body;

  try {
    const existente = await Reserva.findOne({ numero });
    if (existente) return res.status(400).json({ error: "Número ya reservado" });

    const nueva = await Reserva.create({ numero, nombre, sala, telefono });
    res.json(nueva);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.delete("/reservas/:numero", async (req, res) => {
  const { numero } = req.params;
  await Reserva.deleteOne({ numero });
  res.json({ message: "Reserva eliminada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
