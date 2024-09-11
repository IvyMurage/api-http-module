const http = require('http')
const fs = require('fs')

const requestListener = (req, res) => {
    // set the default content type to json
    res.setHeader('accept', 'application/json')
    res.setHeader('Content-Type', 'application/json')

    if (req.url === '/users' && req.method === 'GET') {
        fs.readFile('./data.json', (err, data) => {
            if (err) {
                res.writeHead(404)
                res.end(JSON.stringify({
                    message: 'File not found'
                }))
            }
            res.writeHead(200)
            const users = data.length ? data : []
            res.end(users)
        })

    }

    if (req.url === '/users/new' && req.method === 'POST') {

        let body = ''
        req
            .on('data', chunk => {
                body += chunk
            })
            .on('end', () => {
                let users = []
                const parsedData = JSON.parse(body)
                fs.readFile('./data.json', (err, data) => {
                    if (err) throw err

                    if (data.length > 0) {
                        users = JSON.parse(data)
                        users.push(parsedData)
                    } else {
                        users.push(parsedData)
                    }

                    fs.writeFile('./data.json', JSON.stringify(users), (err) => {
                        if (err) throw err
                    })

                })
                res.writeHead(200)
                res.end(JSON.stringify(parsedData))
            })

    }
}
const server = http.createServer(requestListener)

server.listen(3000, (req, res) => {
    console.log('server listening')
})