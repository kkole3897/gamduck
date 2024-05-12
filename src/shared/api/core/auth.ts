import { coreApiUrl } from '@/shared/config';

export type OauthRegistrationCompleteResponse = {
  isRegistrationCompleted: true;
  accessToken: string;
  accessTokenExpireAt: string;
  refreshToken: string;
  refreshTokenExpireAt: string;
};

export type OauthRegistrationRequireResponse = {
  isRegistrationCompleted: false;
  accessToken: string;
  accessTokenExpireAt: string;
};

export type OauthLoginResponse =
  | OauthRegistrationCompleteResponse
  | OauthRegistrationRequireResponse;

export async function loginByKakao(code: string): Promise<OauthLoginResponse> {
  const uri = `${coreApiUrl}/auth/kakao`;

  const body = JSON.stringify({ code });

  const response = await fetch(uri, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // TODO: error 구체화
    throw new Error();
  }

  const data = await response.json();

  return data;
}

export type RegisterOauthRequestBody = {
  nickname: string;
};

export async function registerOauthUser(body: RegisterOauthRequestBody) {
  const uri = `${coreApiUrl}/auth/registration/oauth-user`;
  const serializedBody = JSON.stringify(body);

  const response = await fetch(uri, {
    method: 'POST',
    body: serializedBody,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // TODO: oauth user api call error 구체화
    throw new Error();
  }

  const data: OauthRegistrationCompleteResponse = await response.json();

  return data;
}
