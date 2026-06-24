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
    console.log(error)

    if(error.name === 'CastError'){
      return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
      return response.status(400).send({error: error.message})
    }

    next(error)
}



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

app.post("/api/persons", ((request, response, next) => 
  {
    const body = request.body

    const newPerson = new Person(
    {
      name: body.name || '',
      number: body.number || ''
    })

    newPerson.save().then((res) => {response.json(newPerson)})
    .catch(error => next(error))
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