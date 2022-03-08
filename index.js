const express = require('express')
const streamo = require('./mod/main')
const cors = require('cors')

const port = process.env.PORT || 8080

const server = express()

server.use(cors())

server.get('/', (req,res) => {
  const limit = req.query.limit || 16  
    streamo.get_home(res,limit)
})

server.get('/category', (req,res) => {
      streamo.all_category_list(res)
})

server.get('/search',(req,res) => {
  res.status(404).json({ message: "No Query Entered" })
})

server.get('/tv',(req,res) => {
  res.status(404).json({ message: "What Tv Show?" })
})

server.get('/m',(req,res) => {
  res.status(404).json({ message: "What Movie?" })
})

server.get('/lib',(req,res) => {
  res.status(404).json({ message: "No Query Entered" })
})

server.get('/tv/:mediaID',(req,res) => {
  const mediaID = req.params.mediaID
  streamo.get_tv(res,mediaID)
})

server.get('/m/:mediaID',(req,res) => {
  const mediaID = req.params.mediaID
  streamo.get_movie(res,mediaID)
})

server.get('/search/:query',(req,res) => {
  const query = req.params.query
  const page = req.query.page || 1
  streamo.search_media(res,query,page)
})


server.get('/lib/:srchID',(req,res) => {
  const query = req.params.srchID
  const page = req.query.page || 1
  streamo.search_lib(res,query,page)
})

server.get('/category/:genre',(req,res) => {
  const genre = req.params.genre
  streamo.get_category(res,genre)
})	

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
} )
