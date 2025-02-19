// Modelo de Publicación
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        category: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },
        author: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        comments: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Comment' 
            }
        ]
    }, 
    { 
        timestamps: true 
    }
)

const Post = mongoose.model('Post', PostSchema)

export default Post