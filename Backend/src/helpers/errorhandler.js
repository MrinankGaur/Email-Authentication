//error handler middleware

const errorHandler = (err,req,res,next)=>{
    //check if respone header have already been sent to the client
    if(res.headersSent){
        return next(err);
    }

    const statusCode = res.statusCode && res.statusCode>=400 ? res.statusCode : 500;
    res.statusCode(statusCode); // set the status code for the response

    //log error stack trace to the console if not in production -> for debugging

    if(process.env.NODE_ENV!=="production"){
        console.log(err);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null :err.stack,
    });


};

export default errorHandler;