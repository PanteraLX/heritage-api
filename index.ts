import { App } from './src/app';

require('dotenv').config();
console.log(process.env.DB_PASS);

const port: number = Number.parseInt(process.env.APP_PORT, 10) || 8080;
const hostname: string = process.env.APP_HOST || 'localhost';

const app: App = new App();

app.express.listen(port, hostname, (err: any): void => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server is listening on ${port}`);
});

