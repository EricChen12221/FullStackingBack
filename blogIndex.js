const app = require('./blogsListApp')
const logger = require('./utils/logger')
const config = require('./utils/blogConfig')

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})