import express from 'express'

const app = express()

app.get('/test', (req, res) => {
    const span = '<span style="text-decoration: underline;">app<span/>'
    const heading = `<h1>This is ${span} hot reloaded!<h1/>`
    res.send(heading);
})

app.listen(8000)