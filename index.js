const express = require('express')

const app = express()

const port = 8000

app.use(express.json())
app.use((req, res, next) => {
    res.set({
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
    })
    next()
})

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html')
})

app.get('/*', (req, res) => {
    res.sendFile(process.cwd() + `${req.originalUrl}`)
})

app.post('/save-files', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
    console.log(`App is live at http://localhost:${port}`);
});