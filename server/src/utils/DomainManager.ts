import redbird from 'redbird';
import { resolve } from 'path';
import fs from 'fs';

const {
    REDBIRD_PORT = '80',
    NODE_ENV = 'testing',
} = process.env;

if (NODE_ENV === 'production') {
    console.log(fs.readFileSync(resolve(__dirname, '..', '..', 'certs', 'privkey.pem'), { encoding: 'utf-8' }));
    console.log(fs.readFileSync(resolve(__dirname, '..', '..', 'certs', 'fullchain.pem'), { encoding: 'utf-8' }));
}

export default class DomainManager {
    public baseDomain: string;

    public proxy: any;

    constructor(baseDomain: string) {
        this.proxy = NODE_ENV === 'production'
            ? redbird({
                port: parseInt(REDBIRD_PORT, 10),
                xfwd: false,
                ssl: {
                    key: resolve(__dirname, '..', '..', 'certs', 'privkey.pem'),
                    cert: resolve(__dirname, '..', '..', 'certs', 'fullchain.pem'),
                    port: 443,
                },
            })
            : redbird({
                port: parseInt(REDBIRD_PORT, 10),
                xfwd: false,
            });

        this.baseDomain = baseDomain;
    }

    /**
     * Domain should be of this form: example.com
     * URL should be of this form: http://172.17.42.1:8001
     * @param domain string
     * @param url string
     */
    register(subdomain: string, url: string) {
        this.proxy.register(`${subdomain}.${this.baseDomain}`, url);
    }

    /**
     * Domain should be of this form: example.com
     * URL should be of this form: http://172.17.42.1:8001
     * @param domain string
     * @param url string
     */
    unregister(subdomain: string, url: string) {
        this.proxy.unregister(`${subdomain}.${this.baseDomain}`, url);
    }
}
