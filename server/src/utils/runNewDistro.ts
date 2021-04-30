import DomainManager from './DomainManager';
import ECSManager from './ECSManager';
import { rooms } from './RoomDistroMap';

export default async function runNewDistro(
    roomName: string,
    sessionId: string,
    domainManager: DomainManager,
    ecsManager: ECSManager
) {
    const domain = `${sessionId}.${domainManager.baseDomain}`;

    console.log('Creating new Distro in ECS.');

    const port = 6080;

    const { privateIp, taskArn } = await ecsManager.runNewDistro({
        roomName, domain,
    });

    rooms[roomName] = { ...rooms[roomName], taskArn };

    const url = `http://${privateIp}:${port}`;
    domainManager.register(sessionId, url);

    console.log('New Distro Created, domain registered:', domain);

    return domain;
}
