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
            res
                .writeHead(500)
                .end(JSON.stringify({
                    message: 'Something went wrong',
                    error: error.message
                }))
        }
    }
    if (req.url === '/users/new' && req.method === 'POST') {
        let body = ''
        req
            .on('data', chunk => {
                body += chunk
            })
            .on('end', async () => {
                try {
                    const parsedBodyData = JSON.parse(body)
                    let users = []
                    const data = await fs.readFile('./database.json')
                    if (data.length > 0) users = JSON.parse(data)

                    users.push(parsedBodyData)

                    await fs.writeFile('./database.json', JSON.stringify(users))
                    res
                        .writeHead(200)
                        .end(JSON.stringify(parsedBodyData))
                } catch (error) {
                    res
                        .writeHead(500, {
                            'Content-type': 'application/json'
                        })
                        .end(JSON.stringify({
                            message: 'something went wrong while adding a user',
                            error: error.message
                        }))
                }
            })
    }

    if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
        const getId = req.url.split('/')
        const id = getId[getId.length - 1]

        const data = await fs.readFile('./database.json')
        const users = data.length ? JSON.parse(data) : []
        const userIndex = users.findIndex(user => user.id === Number(id))
        users.splice(userIndex, 1)

        await fs.writeFile('./database.json', JSON.stringify(users))
        res.writeHead(200)
        res.end(JSON.stringify({message: 'User successfully deleted'}))
    }
}


const server = http.createServer(requestListener)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})