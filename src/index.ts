import express ,{ Request,Response,NextFunction } from 'express';
import expressWinston  from "express-winston";
import winstonLogger from "./winston/logger";
import { configDotenv } from 'dotenv';
import helmet from 'helmet';
import {connectDb} from '../src/db'
import Router  from './Router/user'
const app = express()
app.use(helmet());
app.use(express.json());
configDotenv()

const PORT = process.env.APP_PORT || 4000


// winston logger
app.use(expressWinston.logger({
    winstonInstance: winstonLogger,
}));
//api router
app.use('/api',Router)

//error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    winstonLogger.error('error===>>', err);
  
    if (err.message === 'jwt expired') {
      return res.status(403).send({
        message: 'Bad jwt Token',
      });
    }
  
    return res.status(500).send({
      message: 'Internal server error',
    });
  });

//connecting DB
connectDb()

app.listen(PORT,()=>{
    console.log('server is lisgtening on port 3000')
})