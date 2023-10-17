import { Avatars, Client, Databases, Functions, Locale, Storage, Teams, Users } from 'node-appwrite';
import { AppwriteContext, AppwriteRequest, AppwriteResponseResult } from 'types';

export type FunctionConfig = {
  endpoint?: string;
};

class API {
  constructor(protected readonly client: Client) {}

  get users() {
    return new Users(this.client);
  }

  get teams() {
    return new Teams(this.client);
  }

  get database() {
    return new Databases(this.client);
  }

  get storage() {
    return new Storage(this.client);
  }

  get functions() {
    return new Functions(this.client);
  }

  get locale() {
    return new Locale(this.client);
  }

  get avatars() {
    return new Avatars(this.client);
  }
}

export abstract class Appwrite {
  protected endpoint = 'https://cloud.appwrite.io/v1';
  protected project = Bun.env['APPWRITE_FUNCTION_PROJECT_ID'] as string;
  protected key = Bun.env['APPWRITE_API_KEY'] as string;
  protected jwt?: string;

  protected request!: AppwriteRequest;
  protected log!: AppwriteContext['log'];
  protected error!: AppwriteContext['error'];

  abstract handler(): Promise<Record<string, any>>;

  private async proxy({ req, res, log, error }: AppwriteContext): Promise<AppwriteResponseResult> {
    this.request = req;
    this.log = log;
    this.error = error;

    this.parseJwt();

    const result = await this.handler();
    return res.json(result);
  }

  constructor() {
    return new Proxy(this, {
      apply: (_target, _thisArg, [ctx]) => {
        return this.proxy(ctx);
      },
    });
  }

  protected get admin() {
    return new API(this.getClientAdmin());
  }

  protected get user() {
    return new API(this.getClientUser());
  }

  protected getClientAdmin(): Client {
    return new Client() //
      .setEndpoint(this.endpoint)
      .setProject(this.project)
      .setKey(this.key);
  }

  protected getClientUser(): Client {
    if (!this.jwt) {
      throw new Error('JWT is undefined, use .setJwt first or pass it ');
    }

    return new Client() //
      .setEndpoint(this.endpoint)
      .setProject(this.project)
      .setJWT(this.jwt);
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  setProject(project: string) {
    this.project = project;
  }

  setKey(key: string) {
    this.key = key;
  }

  setJwt(jwt: string) {
    this.jwt = jwt;
  }

  private parseJwt() {
    const [, jwt] = this.request.headers['authorization'];
    this.setJwt(jwt);
  }
}
