const mongoose = require('mongoose')

const info = () => {
    console.log('more arguments needed')
    console.log('argument should look like: node mongo.js password name number')
    console.log('if the name contains two or more words put the name in quotation marks')
    process.exit(1)
}

const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}

if (process.argv.length < 3) {
    info()
}

if (process.argv.length < 5 && process.argv.length > 3) {
    info()
}

if (process.argv.length > 5) {
    info()
}

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]

const url =
    `mongodb+srv://rabischawarri:${password}@cluster0.nb8ud.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


if (process.argv.length === 3) {
    console.log('phonebook:')
    console.log(parseInt('hello'))
    Person
    .find({})
    .then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

const person = new Person({
    id: generateId(),
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}





