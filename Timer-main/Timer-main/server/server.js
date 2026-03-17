import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT||3000;
const DATA_FILE = "./data.json";

app.use(cors({
  // origin: "http://localhost:5173",
  origin: "*",
  methods:["GET","POST","PUT","DELETE"],
}))
app.use(express.json());
function readData() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeData(timers) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(timers, null, 2));
}

app.get("/api/timers", (req, res) => {
  res.json(readData());
});

app.post("/api/timers", (req, res) => {
  const timers = readData();
  const newTimer = req.body;
  timers.push(newTimer);
  writeData(timers);
  res.json(newTimer);
});

app.put("/api/timers", (req, res) => {
  const { id, title, project } = req.body;
  const timers = readData();
  const updated = timers.map(t =>
    t.id === id ? { ...t, title, project } : t
  );
  writeData(updated);
  res.json({ success: true });
});

app.delete("/api/timers", (req, res) => {
  const { id } = req.body;
  const timers = readData().filter(t => t.id !== id);
  writeData(timers);
  res.json({ success: true });
});

app.post("/api/timers/start", (req, res) => {
  const { id, start } = req.body;
  const timers = readData();
  const updated = timers.map(t =>
    t.id === id ? { ...t, runningSince: start } : t
  );
  writeData(updated);
  res.json({ success: true });
});

app.post("/api/timers/stop", (req, res) => {
  const { id, stop } = req.body;
  const timers = readData();
  const updated = timers.map(t => {
    if (t.id === id && t.runningSince) {
      const elapsed = stop - t.runningSince;
      return { ...t, elapsed: t.elapsed + elapsed, runningSince: null };
    }
    return t;
  });
  writeData(updated);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
