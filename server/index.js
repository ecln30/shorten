require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const { MongoClient } = require('mongodb');
const uri = process.env.URI;
const dns = require("dns")
const path = require("path")
const nanoid = require("nanoid")
const app = express()

MongoClient.connect(uri, { useNewUrlParser: true })
  .then(client => {
      app.locals.db = client.db("shorten")
      console.log("connected MongoDB")
  })
  .catch( () => console.error("Failed to connect to the database "))

const shortenURL = (db, url) => {
    const shortenedURLs = db.collection("shortenedURLs")
    return shortenedURLs.findOneAndUpdate({ original_url: url}, {
        $setOnInsert: {
            originanl_url: url,
            short_id: nanoid(7)
        },
    },
    {
        returnOriginal: false,
        upsert: true
    })
}

const checkIfShortIdExists = (db, code) => db.collection("shortenedURLs")
              .findOne({ short_id: code})


app.use(express.static(path.join(__dirname, "../public")))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, "../public", "index.html")
    res.sendFile(htmlPath)
})

app.get("/:short_id", (req, res) => {
    const shortId = req.params.short_id
    checkIfShortIdExists(db, shortId)
    .then(doc => {
        if (doc === null) return res.send("Uh on. We could not find a link at that URL")

        res.redirect(doc.original_url)
    })
    .catch(console.error)
})

app.post('/new', (req, res) => {
     let originalUrl
     try {
         originalUrl = new URL(req.body.url)
     } catch(err) {
         return res.status(400).send({ error: "invalid URL"})
     }

     dns.lookup(originalUrl.hostname, (err) => {
         if (err) {
             return res.status(404).send({ error: "Address not found"})
         }

         const { db } = req.app.locals
         shortenURL(db, originalUrl.href)
            .then( result => {
                const doc = result.value
                res.json({
                    original_url: doc.original_url,
                    short_id: doc.short_id
                })
            })
            .catch(console.error)
     })
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))




















































