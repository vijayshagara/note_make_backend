import { createLogger, format, transports } from "winston";

const loggerWinston = createLogger({
    transports:[
        new transports.Console(),
    ],
    format: format.combine(
        format.colorize(),
        format.json(),
        format.timestamp(),
        //format.prettyPrint(),
    ),
});


export default loggerWinston;

