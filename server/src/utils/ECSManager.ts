import AWS from 'aws-sdk';
import { rooms } from './RoomDistroMap';
import sleep from './sleep';

const {
    AWS_ACCESS_KEY_ID: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
    AWS_REGION: region,
} = process.env;

export default class ECSManager {
    private ecs: AWS.ECS;

    private cluster: string;

    constructor() {
        const credentials = new AWS.Credentials({
            accessKeyId,
            secretAccessKey,
        });

        AWS.config.update({ region });

        this.ecs = new AWS.ECS({
            credentials,
        });
        this.cluster = 'remote-distro-cluster';
    }

    describeServices() {
        return new Promise((resolve, reject) => {
            this.ecs.describeServices({
                services: ['backend-service'],
                cluster: this.cluster,
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    describeTasks(tasks: string[]) {
        return new Promise((resolve, reject) => {
            this.ecs.describeTasks({
                cluster: this.cluster,
                tasks,
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    runTask(taskDefinition: string, networkConfiguration: any, tags?: { key: string, value: string }[]) {
        return new Promise((resolve, reject) => {
            this.ecs.runTask({
                cluster: this.cluster,
                taskDefinition,
                networkConfiguration,
                launchType: 'FARGATE',
                tags,
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    stopTask(taskArn: string) {
        return new Promise((resolve, reject) => {
            this.ecs.stopTask({
                cluster: this.cluster,
                task: taskArn
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    async taskDescriptionAfterRunning(tasks: string[]) {
        let taskData: any = await this.describeTasks(tasks);

        while (taskData.tasks[0].lastStatus !== 'RUNNING') {
            await sleep(4000);
            taskData = await this.describeTasks(tasks);
        }

        return taskData;
    }

    public async runNewDistro({ roomName, domain }: { roomName: string, domain: string }) {
        const { services } = await this.describeServices() as any;

        const createdTask: any = await this.runTask(
            roomName,
            services[0].networkConfiguration,
            [{
                key: 'roomName',
                value: roomName,
            },
            {
                key: 'domain',
                value: domain,
            }]
        );

        console.log('createdTask', createdTask);

        const { taskArn } = createdTask.tasks[0];
        const taskData: any = await this.taskDescriptionAfterRunning([taskArn]);

        console.log({ taskData });
        const { details: taskDetails } = taskData.tasks[0].attachments[0];
        const { value: privateIp } = taskDetails.find((detail: { name: string, value: string }) => detail.name === 'privateIPv4Address');

        return { privateIp, taskArn };
    }

    public async stopDistro(roomName: string) {
        const { taskArn } = rooms[roomName];
        if (!taskArn) {
            return {
                success: false,
                roomName,
            };
        }

        await this.stopTask(taskArn);

        console.log('Remote distro stopped for room', roomName);
        delete rooms[roomName];

        return {
            success: true,
            roomName,
        }
    }
}
