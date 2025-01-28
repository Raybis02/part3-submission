require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Persons = require('./models/Person')
const Person = require('./models/Person')

morgan.token('json', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    } else if (request.method === 'DELETE') {
        return response.body ? response.body : ''
    }
    return ''
})

app.use((req, res, next) => {
    const oldSend = res.send
    res.send = data => {
        res.body = data
        oldSend.call(res, data)
    }
    next()
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


let date_time = new Date()


const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}

app.get('/favicon.ico', (req, res) => res.status(204).end())

// app.get('/', (request, response) => {
//     response.send('<h1>Welcome to Phonebook</h1>')
// })

app.get('/api/Persons', (request, response) => {
    Persons.find({}).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.send('<h1>Error 404 Page Not Found</h1><p>Database does not exist</p>')
            response.status(404).end()
        }
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Persons.length} people</p> <p>${date_time}</p>`)
})

app.get(`/api/Persons/:id`, (request, response) => {
    const id = request.params.id
    const person = Persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send(`<h2>404 Page Not Found</h2> <p>there is no entry for a person with id ${id}</p>`).end()
    }
})

app.delete('/api/Persons/:id', (request, response) => {
    const id = request.params.id
    const deleted = Persons.find(person => person.id === id)

    if (deleted) {
        Persons = Persons.filter(person => person.id !== id)
        response.status(204).json(deleted)
    } else {
        response.status(404).send({ error: 'Person not found' })
    }
})


app.post('/api/Persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({
                    error: 'name must be unique'
                })
            }

            const person = new Person({
                name: body.name,
                number: body.number
            })

            return person.save()
        })
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            console.log(error.message)
            response.status(400).json({
                error: 'Failed to save person'
            })
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
