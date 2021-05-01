import redbird from 'redbird';

const {
    REDBIRD_PORT = '80',
} = process.env;

export default class DomainManager {
    public baseDomain: string;

    public proxy: any;

    constructor(baseDomain: string) {

        this.proxy = redbird({
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
