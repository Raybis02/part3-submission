const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Establishing connection to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    id: String,
    name:{
        type: String,
        minLength: [3, 'Name must be at least 3 characters long'],
        required: true
    },
    number:{
        type: String,
        validate:{
            validator: function(v) {
                    const minlength = 9
                	return v.length >= minlength && /^\d{2,3}-\d{5,}$/.test(v) 
            },
            message: props => `Number '${props.value}' is invalid. Numbers contain at least 8 digits split by a \'-\' after the first 2 or 3 digits`
        },
        required: true,
    } 
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)

