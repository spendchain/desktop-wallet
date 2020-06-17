import { Contracts } from "@arkecosystem/platform-sdk";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

export class HttpClient implements Contracts.HttpClient {
	#client: AxiosInstance;
	readonly #socksHost: string = "socks5h://127.0.0.1:9050";

	readonly #defaultConfig: AxiosRequestConfig = {
		timeout: 2000,
	};

	public constructor() {
		this.#client = axios.create(this.#defaultConfig);
	}

	public withSocks(): HttpClient {
		this.#client = axios.create({
			...this.#defaultConfig,
			httpAgent: new SocksProxyAgent(this.#socksHost),
			httpsAgent: new SocksProxyAgent(this.#socksHost),
		});

		return this;
	}

	public async get(path: string, query: object = {}): Promise<Record<string, any>> {
		return await this.#client.get(path, { params: { ...query } });
	}

	public async post(path: string, body: object, headers: object = {}) {
		return await this.#client.post(path, { body, headers });
	}
}
