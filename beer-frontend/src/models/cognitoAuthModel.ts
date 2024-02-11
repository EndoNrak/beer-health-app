import generateRandomString from "../utils/generateRandomString";
import { SHA256, enc, HmacSHA256 } from 'crypto-js';
import { Buffer } from 'buffer';

import {
  REACT_APP_COGNITO_AUTH_CLIENT_ID,
  REACT_APP_COGNITO_AUTH_CLIENT_SECRET,
  REACT_APP_COGNITO_USER_POOL_DOMAIN,
  REACT_APP_DOMAIN,
} from "../env";

const GUEST_TOKEN = "guest";

export class CognitoAuthModel {
  auth_domain: string;
  app_domain: string;
  client_id: string;
  client_secret: string;
  code_verifier: string;
  code_challenge: string;
  state: string;
  scope: string;
  user_name: string = "";
  user_id: string = "";
  access_token: string = "";
  refresh_token: string = "";

  // コンストラクタを追加
  constructor(
    auth_domain: string,
    app_domain: string,
    client_id: string,
    client_secret: string,
    code_verifier: string,
    code_challenge: string,
    state: string,
    scope: string,
  ) {
    this.auth_domain = auth_domain;
    this.app_domain = app_domain;
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.code_verifier = code_verifier;
    this.code_challenge = code_challenge;
    this.state = state;
    this.scope = scope;
  }

  copyWith({
    auth_domain,
    app_domain,
    client_id,
    client_secret,
    code_verifier,
    code_challenge,
    state,
    scope,
    access_token,
    refresh_token,
    user_name,
    user_id
  }: Partial<CognitoAuthModel>): CognitoAuthModel {
    return new CognitoAuthModel(
      auth_domain ?? this.auth_domain,
      app_domain ?? this.app_domain,
      client_id ?? this.client_id,
      client_secret ?? this.client_secret,
      code_verifier ?? this.code_verifier,
      code_challenge ?? this.code_challenge,
      state ?? this.state,
      scope ?? this.scope,
    )
    .setTokens(access_token ?? this.access_token, refresh_token ?? this.refresh_token)
    .setUserName(user_name ?? this.user_name, user_id ?? this.user_id);
  }

  // アクセストークンとリフレッシュトークンをセットするメソッド
  setTokens(access_token: string, refresh_token: string): this {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    return this;
  }

  setUserName(user_name: string, user_id: string): this {
    this.user_name = user_name;
    this.user_id = user_id;
    return this;
  }

  get redirect_login_url(): string {
    return `${this.app_domain}/redirect/login/cognito`
  }
  
  get redirect_logout_url(): string {
    return `${this.app_domain}/redirect/login/cognito`
  }

  get login_url(): string {
    return `${this.auth_domain}/authorize?client_id=${this.client_id}&response_type=code&scope=${this.scope}&redirect_uri=${encodeURIComponent(this.redirect_login_url)}`;
  }

  get logout_url(): string {
    return `${this.auth_domain}/logout?client_id=${this.client_id}&logout_uri=${encodeURIComponent(this.redirect_logout_url)}`;
  }

  get basic_token(): string {
    return Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64');
  }

  get secret_hash(): string {
    const hash = HmacSHA256(this.user_name + this.client_id, this.client_secret);
    const hashBase64 = enc.Base64.stringify(hash);
    return hashBase64;
  }

  get is_guest_login(): boolean {
    return this.access_token === GUEST_TOKEN;
  }
}

export class CognitoAuthModelFactory {
  static create(): CognitoAuthModel {
    const auth_domain = REACT_APP_COGNITO_USER_POOL_DOMAIN;
    const app_domain = REACT_APP_DOMAIN;
    const client_id = REACT_APP_COGNITO_AUTH_CLIENT_ID;
    const client_secret = REACT_APP_COGNITO_AUTH_CLIENT_SECRET;
    const code_verifier = generateRandomString(128);
    const wordArray = SHA256(code_verifier);
    const code_challenge = enc.Base64.stringify(wordArray);
    const state = generateRandomString(16);
    const scope = 'email+openid+profile';
    return new CognitoAuthModel(auth_domain, app_domain, client_id, client_secret, code_verifier, code_challenge, state, scope);
  }

  static createFromJson(json: Record<string, any>): CognitoAuthModel {
    const {
      auth_domain,
      app_domain,
      client_id,
      client_secret,
      code_verifier,
      code_challenge,
      state,
      scope,
      user_name,
      user_id,
      access_token,
      refresh_token,
    } = json;

    return new CognitoAuthModel(
      auth_domain,
      app_domain,
      client_id,
      client_secret,
      code_verifier,
      code_challenge,
      state,
      scope,
    ).setTokens(access_token, refresh_token).setUserName(user_name, user_id);
  }

  static createGuest(user_name: string): CognitoAuthModel {
    const auth_domain = REACT_APP_COGNITO_USER_POOL_DOMAIN;
    const app_domain = REACT_APP_DOMAIN;
    const client_id = REACT_APP_COGNITO_AUTH_CLIENT_ID;
    const client_secret = REACT_APP_COGNITO_AUTH_CLIENT_SECRET;
    const code_verifier = generateRandomString(128);
    const wordArray = SHA256(code_verifier);
    const code_challenge = enc.Base64.stringify(wordArray);
    const state = generateRandomString(16);
    const scope = 'email+openid+profile';
    const user_id = `guest-${user_name}-id`;
    const access_token=GUEST_TOKEN;
    const refresh_token = GUEST_TOKEN;
    return new CognitoAuthModel(auth_domain, app_domain, client_id, client_secret, code_verifier, code_challenge, state, scope)
    .setTokens(access_token, refresh_token)
    .setUserName(user_name, user_id);
  }
}
