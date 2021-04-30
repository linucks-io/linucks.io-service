import { config } from 'dotenv';

config();

import app from './server';

let {
    PORT = '8080',
    PLUGIN_ID = '',
} = process.env;

app.set('pluginId', PLUGIN_ID);

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
