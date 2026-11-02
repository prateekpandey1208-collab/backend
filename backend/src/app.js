import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend is running successfully"
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON in request body"
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large"
    });
  }

  console.error(error.message);

  return res.status(500).json({
    message: "Internal server error"
  });
});

export default app;