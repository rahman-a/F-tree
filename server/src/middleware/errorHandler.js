const notFound = (req, res, next) => {
    const error = new Error(`${req.originalUrl} Not Found`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).send({
        error:err.message,
        stack:process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

export {notFound, errorHandler}