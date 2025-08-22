import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error Mongo:", err));

// Modelo de reserva
const reservaSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true },
  nombre: String,
  sala: String,
  telefono: String,
  fecha: { type: Date, default: Date.now }
});

const Reserva = mongoose.model("Reserva", reservaSchema);

// Rutas
app.get("/reservas", async (req, res) => {
  const reservas = await Reserva.find();
  res.json(reservas);
});

app.post("/reservas", async (req, res) => {
  try {
    const nueva = new Reserva(req.body);
    await nueva.save();
    res.json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/reservas/:numero", async (req, res) => {
  try {
    const numero = req.params.numero;
    const borrada = await Reserva.findOneAndDelete({ numero });
    res.json(borrada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
