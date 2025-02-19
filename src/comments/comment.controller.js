import Comment from './comment.model.js'
import mongoose from 'mongoose'

// Crear comentario (cualquier usuario registrado)
export const createComment = async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, author: req.user._id })
    await newComment.save()
    res.status(201).json(newComment)
  } catch (err) {
    res.status(500).json({ message: 'Error creating comment', error: err.message })
  }
}

// Obtener todos los comentarios de una publicación (público)
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username email')
    res.json(comments)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving comments', error: err.message })
  }
}

// Editar comentario (solo autor)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own comments' })
    }

    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedComment)
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment', error: err.message })
  }
}

// Eliminar comentario (solo autor)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' })
    }

    await Comment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Comment deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message })
  }
}
