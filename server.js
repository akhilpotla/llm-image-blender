const express = require("express");
const cors = require("cors");

const app = express();

// Init Middleware
app.use(
  express.json({
    extended: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // IMPORTANT: this must be set to true to allow sending and receiving cookies
  })
);

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/v1/images", require("./routes/api/images"));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
