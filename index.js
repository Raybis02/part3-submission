const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')



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

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}

app.get('/favicon.ico', (req, res) => res.status(204).end())

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date_time}</p>`)
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else{
        response.status(404).send(`<h2>404 Page Not Found</h2> <p>there is no entry for a person with id ${id}</p>`).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const deleted = persons.find(person => person.id === id)

    if (deleted) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).json(deleted)
    } else {
        response.status(404).send({ error: 'Person not found' })
    }
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId().toString(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
