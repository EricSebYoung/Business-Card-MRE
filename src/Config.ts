//Enter host name here
const host = "smtp.gmail.com"
//Email Settings - Replace with another e-mail.
const email = "name@domain";
//const password = "enter password here";
const clientId = "Enter client ID";
const clientSecret = "Enter client secret code";
const refreshToken = 
"Enter refresh token";
const accessToken = 
"Enter access token";

export function GetHost() {
	return host;
}

export function GetConfigEmail() {
	return email;
}

export function GetClientId() {
	return clientId;
}

export function GetClientSecret() {
	return clientSecret;
}

export function GetRefreshToken() {
	return refreshToken;
}

export function GetAccessToken() {
	return accessToken;
}
