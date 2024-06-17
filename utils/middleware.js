
//logger -   (morgon also csn be used available in npm)
app.use((req,res,next) => {
    req.time = new Date(Date.now()).toString();
    console.log(req.method, req.hostname, req.path,req.time);
    next();
});