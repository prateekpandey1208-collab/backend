import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

const handleError = (res, error) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error(error.message);

  return res.status(500).json({
    message: "Internal server error"
  });
};

const createPost = async (req, res) => {
  try {
    const { name, description, age } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof age !== "number" ||
      !Number.isFinite(age)
    ) {
      return res.status(400).json({
        message: "Provide a name, description and numeric age"
      });
    }

    const post = await Post.create({
      name,
      description,
      age
    });

    return res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json(posts);
  } catch (error) {
    return handleError(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const body = req.body ?? {};
    const updates = {};

    for (const field of ["name", "description", "age"]) {
      if (Object.hasOwn(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide name, description or age to update"
      });
    }

    for (const field of ["name", "description"]) {
      if (
        Object.hasOwn(updates, field) &&
        (
          typeof updates[field] !== "string" ||
          !updates[field].trim()
        )
      ) {
        return res.status(400).json({
          message: `${field} must be a non-empty string`
        });
      }
    }

    if (
      Object.hasOwn(updates, "age") &&
      (
        typeof updates.age !== "number" ||
        !Number.isFinite(updates.age)
      )
    ) {
      return res.status(400).json({
        message: "Age must be a number"
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deletePost = async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    return res.status(200).json({
      message: "Post successfully deleted"
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export { createPost, getPosts, updatePost, deletePost };