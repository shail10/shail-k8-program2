const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 8000

const STORAGE_PATH = '/shail_PV_dir'

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Container 2 is running successfully')
})

app.post('/sum', (req, res) => {
  console.log('sum api hit')

  const { file, product } = req.body

  try {
    const filePath = path.join(STORAGE_PATH, file)

    const data = fs.readFileSync(filePath, 'utf8')
    const rows = data.trim().split('\n')

    if (rows.length < 2) {
      return res.status(400).json({
        file: file,
        error: 'Input file not in CSV format.',
      })
    }

    const headers = rows[0].split(',')

    if (
      headers.length !== 2 ||
      headers[0].trim() !== 'product' ||
      headers[1].trim() !== 'amount'
    ) {
      return res.status(400).json({
        file: file,
        error: 'Input file not in CSV format.',
      })
    }

    const trimmedHeaders = headers.map((header) => header.trim())

    const productIndex = trimmedHeaders.indexOf('product')
    const amountIndex = trimmedHeaders.indexOf('amount')
    console.log(amountIndex)

    let sum = 0
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',')
      const trimmedColumns = columns.map((column) => column.trim())
      console.log(trimmedColumns)

      if (trimmedColumns.length !== 2) {
        return res.status(400).json({
          file: file,
          error: 'Input file not in CSV format.',
        })
      }

      const amount = parseFloat(trimmedColumns[amountIndex])
      console.log(amount)

      if (isNaN(amount)) {
        return res.status(400).json({
          file: file,
          error: 'Input file not in CSV format.',
        })
      }

      if (trimmedColumns[productIndex] === product) {
        sum += amount
      }
    }

    return res.json({
      file: file,
      sum: sum,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      file: file,
      error: 'An error occurred while processing the file.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Container 2 running on port:${PORT}`)
})
