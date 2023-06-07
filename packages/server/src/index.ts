import bodyParser  from 'body-parser'
import express from 'express'
import  cors from 'cors'

const db = new Map<string, string>()
db.set(
  'did:key:z6MkjEzr5pDDWJoE5AziBNVbvUMDFbfA2Qm1hNCvhFMFCNaR',
  'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3JBcERRU0t3cmZ6eFFMcGp3clY5dkVpRXJoY0xVY0V1eVdvNzdiSDJ6cjFSI3o2TWtyQXBEUVNLd3JmenhRTHBqd3JWOXZFaUVyaGNMVWNFdXlXbzc3YkgyenIxUiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1ODAxMzAwODAsImlhdCI6MTY4NjE2MzM2OCwiaXNzIjoiZGlkOmtleTp6Nk1rckFwRFFTS3dyZnp4UUxwandyVjl2RWlFcmhjTFVjRXV5V283N2JIMnpyMVIiLCJqdGkiOiI2OGE1Y2NkMi1mMDRmLTQ3YzAtYTNkMS1hNmExNjA2MzliOGIiLCJuYmYiOjE2ODYxNjMzNjgsIm5vbmNlIjoiOTJjYzdkNDktZTA3Mi00NzMzLTk2MTItYzUxN2FjMmYzNzcyIiwic3ViIjoiZGlkOmtleTp6Nk1rakV6cjVwRERXSm9FNUF6aUJOVmJ2VU1ERmJmQTJRbTFoTkN2aEZNRkNOYVIiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlzc3VlciI6IiIsImlzc3VhbmNlRGF0ZSI6IiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImFwcE5hbWUiOiJEdW1teSIsInZhbGlkVW50aWwiOiIyMDI0LTA4LTIwVDEzOjIwOjEwLjAwMCswMDAwIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJiN2YzMGM4MC0xYzAxLTQ2NWItODRjNS05ODEwNDU0YzhlNGQiLCJ0eXBlIjoiQ3JlZGVudGlhbFNjaGVtYTIwMjMifX19._3GPu4utbaTTLcjRtLQ3PEnCENI9Zdj0XGklrvi4DK1sBtY2iDLdb6OphUR8TViqxusILv_UgWuAoXLdJZvXCw'
)

const app = express()
const port = 9000
app.use(bodyParser.json()) // Use body-parser middleware to parse JSON bodies
app.use(cors())

app.post('/', async (req, res) => {
  const did = await  req.body.did
  // Not a customer
  if(!db.has(did)) {
    res.status(403).send('Access Denied')
  }  else {
    // // Has their access been recvoked?
    const dwnRes = await fetch('http://localhost:8080/v1/credentials/verification',  {
      method: 'PUT',
      body: JSON.stringify({ credentialJwt: db.get(did) }),
      headers: {
        mode:'no-cors',
        'Content-Type': 'application/json',
      },
    })  
    const body = await  dwnRes.json() 
    if(dwnRes.status === 200) {
      res.status(200).send(body) // should be { verified: true}
    }  else {
      res.status(dwnRes.status).send('Access Denied')
    }
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
