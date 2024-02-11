import generateRandomString from "../utils/generateRandomString";
import { SHA256, enc } from 'crypto-js';
import { Buffer } from 'buffer';
import { REACT_APP_FITBIT_AUTH_CLIENT_ID, REACT_APP_DOMAIN, REACT_APP_FITBIT_AUTH_CLIENT_SECRET} from "../env";

const GUEST_TOKEN = "guest";

export class FitbitAuthModel {
  client_id: string;
  app_domain: string;
  client_secret: string;
  code_verifier: string;
  code_challenge: string;
  state: string;
  scope: string;
  user_id: string = "";
  user_name: string = "";  
  avatar_url: string = "";
  access_token: string = "";
  refresh_token: string = "";

  // コンストラクタを追加
  constructor(
    client_id: string,
    app_domain: string,
    client_secret: string,
    code_verifier: string,
    code_challenge: string,
    state: string,
    scope: string,
  ) {
    this.client_id = client_id;
    this.app_domain = app_domain;
    this.client_secret = client_secret;
    this.code_verifier = code_verifier;
    this.code_challenge = code_challenge;
    this.state = state;
    this.scope = scope;
  }

  // copyWithメソッドを追加
  copyWith({
    client_id,
    app_domain,
    avatar_url,
    client_secret,
    code_verifier,
    code_challenge,
    state,
    scope,
    access_token,
    refresh_token,
    user_id,
    user_name
  }: Partial<FitbitAuthModel>): FitbitAuthModel {
    return new FitbitAuthModel(
      client_id ?? this.client_id,
      app_domain ?? this.app_domain,
      client_secret ?? this.client_secret,
      code_verifier ?? this.code_verifier,
      code_challenge ?? this.code_challenge,
      state ?? this.state,
      scope ?? this.scope,
    )
    .setTokens(access_token ?? this.access_token, refresh_token ?? this.refresh_token)
    .setUserInfo(user_name ?? this.user_name, user_id ?? this.user_id, avatar_url ?? this.avatar_url);
  }

  // アクセストークンとリフレッシュトークンをセットするメソッド
  setTokens(access_token: string, refresh_token: string): this {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    return this;
  }
  
  setUserInfo(user_name: string, user_id: string, avatar_url: string): this {
    this.user_name = user_name;
    this.user_id = user_id;
    this.avatar_url = avatar_url;
    return this;
  }

  get redirect_login_url(): string {
    return `${this.app_domain}/redirect/login/fitbit`
  }

  get generate_auth_url(): string {
    // return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${this.client_id}&scope=${this.scope}&code_challenge=${this.code_challenge}&code_challenge_method=S256&state=${this.state}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${this.client_id}&scope=${this.scope}&redirect_uri=${encodeURIComponent(this.redirect_login_url)}`;
    }
  
  get_basic_token(): string {
    return Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64');
  }
  
  get is_guest_login(): boolean {
    return this.access_token === GUEST_TOKEN;
  }
}

export class FitbitAuthModelFactory {
  static create(): FitbitAuthModel {
    const client_id = REACT_APP_FITBIT_AUTH_CLIENT_ID;
    const app_domain = REACT_APP_DOMAIN;
    const client_secret = REACT_APP_FITBIT_AUTH_CLIENT_SECRET;
    const code_verifier = generateRandomString(128);
    const wordArray = SHA256(code_verifier);
    const code_challenge = enc.Base64.stringify(wordArray);
    const state = generateRandomString(16);
    const scope = 'activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight';
    return new FitbitAuthModel(client_id, app_domain, client_secret, code_verifier, code_challenge, state, scope);
  }

  static createFromJson(json: Record<string, any>): FitbitAuthModel {
    const {
      client_id,
      app_domain,
      client_secret,
      code_verifier,
      code_challenge,
      state,
      scope,
      user_name,
      user_id,
      avatar,
      access_token,
      refresh_token,
    } = json;

    return new FitbitAuthModel(
      client_id,
      app_domain,
      client_secret,
      code_verifier,
      code_challenge,
      state,
      scope,
    )
    .setTokens(access_token, refresh_token)
    .setUserInfo(user_name, user_id, avatar);
  }

  static createGuest(user_name: string): FitbitAuthModel {
    const client_id = REACT_APP_FITBIT_AUTH_CLIENT_ID;
    const app_domain = REACT_APP_DOMAIN;
    const client_secret = REACT_APP_FITBIT_AUTH_CLIENT_SECRET;
    const code_verifier = generateRandomString(128);
    const wordArray = SHA256(code_verifier);
    const code_challenge = enc.Base64.stringify(wordArray);
    const state = generateRandomString(16);
    const scope = 'activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight';
    const user_id = `guest-${user_name}-id`;
    const avatar_url = "";  
    const access_token = GUEST_TOKEN;
    const refresh_token = GUEST_TOKEN;
    return new FitbitAuthModel(client_id, app_domain, client_secret, code_verifier, code_challenge, state, scope)
    .setTokens(access_token, refresh_token)
    .setUserInfo(user_name, user_id, avatar_url);
  }
}
