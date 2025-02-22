import Post from './post.model.js'
import Comment from '../comments/comment.model.js'
import Category from '../categories/category.model.js'
import mongoose from 'mongoose'

// Crear publicación (cualquier usuario registrado)
export const createPost = async (req, res) => {
  try {
    const { category, title, content } = req.body

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const existingCategory = await Category.findById(category)
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const newPost = new Post({ title, content, category, author: req.user._id })
    await newPost.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message })
  }
}

// Obtener todas las publicaciones (público)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category', 'name')
      .populate('author', 'username email')
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts', error: err.message })
  }
}

// Obtener publicación por ID (público)
export const getPostById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' })
    }

    const post = await Post.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'username email')

    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving post', error: err.message })
  }
}

// Actualizar publicación (solo autor)
export const updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' })
    }

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

// Eliminar publicación (autor o ADMIN) y sus comentarios
export const deletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only delete your own posts' })
    }

    await Comment.deleteMany({ post: req.params.id }) // Eliminar comentarios asociados
    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post and related comments deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message })
  }
}
