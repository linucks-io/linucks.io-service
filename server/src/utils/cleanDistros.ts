import cron from 'node-cron';
import ECSManager from './ECSManager';
import axios from 'axios';
import { rooms } from './RoomDistroMap';

const {
    NODE_ENV = 'testing',
} = process.env;

const CRON_STRING = NODE_ENV === 'production' ? '*/30 * * * *' : '* * * * *';

export function cleanDistros(ecsManager: ECSManager) {
    const task = cron.schedule(CRON_STRING, async () => {
        const p: Promise<{ success: boolean, roomName: string }>[] = [];

        Object.keys(rooms).forEach(async (roomName) => {
            console.log('Removing distro from', roomName);
            p.push(ecsManager.stopDistro(roomName));
        });

        (await Promise.all(p)).forEach((result) => {
            if (!result.success) {
                console.log('Failed to remove distro for', result.roomName);
                return;
            }
            console.log('Successfully removed distro from', result.roomName);
        });
    });

    return task;
}
