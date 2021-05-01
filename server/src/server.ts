import express from 'express';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

import runNewDistro from './utils/runNewDistro';
import ECSManager from './utils/ECSManager';
import DomainManager from './utils/DomainManager';
import { rooms } from './utils/RoomDistroMap';
import { cleanDistros } from './utils/cleanDistros';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const {
    BASE_DOMAIN = 'linucks-io.alias-rahil.tk',
    PORT = '8080',
} = process.env;

const ecsManager = new ECSManager();
const domainManager = new DomainManager(BASE_DOMAIN);
domainManager.register('api', `http://127.0.0.1:${PORT}`);

app.post('/provision', async (req, res) => {
    let { distroName: roomName = '' } = req.body;

    roomName = roomName.toString();
    console.log({ roomName });

    if (!roomName) {
        res.json({ success: false, message: 'Invalid URL.' });
        return;
    }

    let url: string;

    if (!rooms[roomName]) {
        const sessionId = `distro-${uuid()}`;

        // Do not await creating new distro, send the URL anyway
        runNewDistro(roomName, sessionId, domainManager, ecsManager);

        url = `${sessionId}.${BASE_DOMAIN}`;

        rooms[roomName] = {
            ...rooms[roomName],
            url,
        };
    } else {
        url = rooms[roomName].url;
    }

    console.log({ rooms });

    res.json({
        success: true,
        url,
    });
});

app.get('/ping', (_req, res) => {
    res.json({ success: true, message: 'pong' });
});

cleanDistros(ecsManager).start();

export default app;
