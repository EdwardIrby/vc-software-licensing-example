import bodyParser  from 'body-parser'
import express from 'express'
import  cors from 'cors'
import { customerDID, credentialJwt } from './data.js'

// FAKE DB
const db = new Map<string, string>()
db.set(
  customerDID,
  credentialJwt
)

const app = express()
const port = 9000
app.use(bodyParser.json())
app.use(cors())

app.post('/', async (req, res) => {
  const did = await  req.body.did
  // Not a customer
  if(!db.has(did)) {
    res.status(403).send('Access Denied')
  }  else {
    // Has their access been recvoked?
    const dwnRes = await fetch('http://localhost:8080/v1/credentials/verification',  {
      method: 'PUT',
      body: JSON.stringify({ credentialJwt: db.get(did) }),
      headers: {
        'Content-Type': 'application/json',
      },
    })  
    const body = await  dwnRes.json() 
    if(dwnRes.status === 200) {
      res.status(200).send(body) // This should be { verified: true}
    }  else {
      res.status(403).send('Access Denied')
    }
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
