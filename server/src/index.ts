import { config } from 'dotenv';

config();

import app from './server';

let {
    PORT = '8080',
} = process.env;

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
