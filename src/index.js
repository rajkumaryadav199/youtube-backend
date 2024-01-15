import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

/* methods for dotenv configer is return in package.json*/
dotenv.config({
    path: './.env'
})

/*connectDB is a asnyc so it  return a promiss so we are handling promiss*/
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8080, ()=>{
        console.log(`Server is runinig at port ${process.env.PORT}`)
    });
    app.on('error', (error)=>{
        console.log(`Error in data base connection`,error );
        throw error;
    })
})
.catch((error)=>{
    console.log(`Error in connecting the database ${error}`)
});




/* iffy is good habite to write the connection of data base */

/*
( async()=>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        app.on('error', (error)=>{
            console.log(`Error in data base connection`,error );
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listenig on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log('Error' , error);
        throw error;
    }
})
*/