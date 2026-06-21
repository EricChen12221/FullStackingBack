require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req,res) =>  JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')


let persons = 
[
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

app.get("/api/persons", ((request, response) =>
    {
      Person.find({}).then((persons) => {
        response.json(persons)  
      })
    }
  )
)

app.get("/api/persons/:id", ((request, response) => 
    {
      const id = request.params.id
      const person = persons.find((person) => id === person.id)

      if (person) {
        response.send(person)
      } else {
        response.status(404).end()
      }
    }
))

app.get("/info", ((request, response) =>
    {
      response.send(
`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date().toString()}</p>`
      )
    }
  )
)

app.delete("/api/persons/:id", ((request, response) => 
  {
    Person.findByIdAndDelete(request.params.id).then(result =>
      response.status(204).end()
    )
  }
))

app.post("/api/persons", ((request, response) => 
  {
    const body = request.body

    if(!body.name || !body.number) {
      return response.status(400).json({error: 'content missing'})
    }

    const newPerson = new Person(
    {
      name: body.name || '',
      number: body.number || ''
    })

    newPerson.save().then((res) => {response.json(newPerson)})
  }
))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})