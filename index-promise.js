const http = require('http')
const fs = require('fs').promises

const PORT = 5000

const requestListener = async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('accept', 'application/json')

    if (req.url === '/users' && req.method === 'GET') {
        try {
            const data = await fs.readFile('./database.json') // Read as string
            const users = data.length ? JSON.parse(data) : [] // Parse JSON

            res.writeHead(200)
            res.end(JSON.stringify(users)) // Send JSON response
        } catch (error) {
            res.writeHead(500)
            res.end(JSON.stringify({
                message: 'Something went wrong',
                error: error.message
            }))
        }
    
    }
}


const server = http.createServer(requestListener)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})