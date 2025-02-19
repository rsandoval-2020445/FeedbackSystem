import Post from './post.model.js'
import mongoose from 'mongoose'

// Crear publicación (cualquier usuario registrado)
export const createPost = async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, author: req.user._id })
    await newPost.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message })
  }
}

// Obtener todas las publicaciones (público)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('category').populate('author', 'username email')
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts', error: err.message })
  }
}

// Obtener publicación por ID (público)
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('author', 'username email')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving post', error: err.message })
  }
}

// Actualizar publicación (solo autor)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' })
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedPost)
  } catch (err) {
    res.status(500).json({ message: 'Error updating post', error: err.message })
  }
}

// Eliminar publicación (solo autor)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message })
  }
}
