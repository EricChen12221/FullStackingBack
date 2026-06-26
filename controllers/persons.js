const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', ((request, response) =>
{
  Person.find({}).then((persons) => {
    response.json(persons)
  })
}
)
)

personRouter.get('/:id', ((request, response, next) =>
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

personRouter.delete('/:id', ((request, response, next) =>
{
  Person.findByIdAndDelete(request.params.id).then(() =>
    response.status(204).end()
  )
    .catch(error => next(error))
}
))

personRouter.put('/:id', ((request, response, next) => {
  const { name, number } = request.body
  console.log('hello')
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

personRouter.post('/', ((request, response, next) =>
{
  const body = request.body

  const newPerson = new Person(
    {
      name: body.name || '',
      number: body.number || ''
    })

  newPerson.save().then(() => {response.json(newPerson)})
    .catch(error => next(error))
}
))

module.exports = personRouter