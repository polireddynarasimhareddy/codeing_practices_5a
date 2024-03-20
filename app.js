const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const app = express()
let db = null
const dbpath = path.join(__dirname, 'moviesData.db')
app.use(express.json())
module.exports = app

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB error : ${e.message}`)
    process.exit(1)
  }
}

initilizeDBAndServer()

//API 1 GET
app.get('/movies/', async (request, response) => {
  const getMovieQuery = `SELECT * FROM movie ;`
  const moviesobject = await db.all(getMovieQuery)
  const ans = moviesobject => {
    return {
      movieName: moviesobject.movie_name,
    }
  }

  response.send(moviesobject.map(eachMovie => ans(eachMovie)))
})

//API 2 POST

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const postMovieQuery = `

      INSERT INTO

      movie (director_id,movie_name,lead_actor)

      VALUES(

      ${directorId},

      "${movieName}",

      "${leadActor};")`
  const movie = await db.run(postMovieQuery)
  response.send('Movie Successfully Added')
})

//API 3 GET

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `SELECT * FROM movie where movie_id = ${movieId} ;`

  const moviesobject = await db.all(getMovieQuery)
  const ans = moviesobject => {
    return {
      movieid: moviesobject.movie_id,
      directorId: moviesobject.director_id,
      movieName: moviesobject.movie_name,
      leadActor: moviesobject.lead_actor,
    }
  }

  response.send(moviesobject.map(eachMovie => ans(eachMovie)))
})

//API 4 PUT
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const {directorId, movieName, leadActor} = request.body
  const updateMovieQuery = `update movie set director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  where movie_id = ${movieId};
  `

  const movie = await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

//API 5 DELETE
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `delete from movie where movie_id =
  ${movieId};
  `
  await db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

//API 6 GET

app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `select * from director;`
  getDirectorQueryListQueryResponse = await db.all(getDirectorQuery)

  const converDirectorDBAPI6 = objectItem => {
    return {
      directorId: objectItem.director_id,
      directorName: objectItem.director_name,
    }
  }
  response.send(
    getDirectorQueryListQueryResponse.map(eachItem =>
      converDirectorDBAPI6(eachItem),
    ),
  )
})

//API 7 GET
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getDirectoryQuery_2 = `select movie_name as movieName from movie
   where director_id = ${directorId};`
  const converDirectorDBAPI7 = await db.all(getDirectoryQuery_2)
  response.send(converDirectorDBAPI7)
})
