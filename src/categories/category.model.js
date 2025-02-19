import mongoose from 'mongoose'

// Modelo de Categoría
const CategorySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        }
    }, 
    {  
        timestamps: true 
    }
)

const Category = mongoose.model('Category', CategorySchema)

export default Category