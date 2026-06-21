require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req,res) =>  JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error = 'CastError'){
      return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

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

app.get("/api/persons/:id", ((request, response, next) => 
    {
      Person.findById(request.params.id).then(person => {
          if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
      })
      .catch(error => next(error))
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

app.delete("/api/persons/:id", ((request, response, next) => 
  {
    Person.findByIdAndDelete(request.params.id).then(result =>
      response.status(204).end()
    )
    .catch(error => next(error))
  }
))

app.put("/api/persons/:id", ((request, response, next) => {
    const {name, number} = request.body
    console.log("hello")
    Person.findById(request.params.id).then(person => {
      console.log(person)
      if(!person){
        response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(result => response.json(result))
        
    })
    .catch(error => next(error))
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

const undefinedEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(undefinedEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})