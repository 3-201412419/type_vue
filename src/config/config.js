const devApiUrl = 'http://localhost:8080/api';
const prodApiUrl = '/api';

export const apiBaseUrl = process.env.NODE_ENV === 'production' ? prodApiUrl : devApiUrl;

export const steamApiPath = '/steam';
export const youtubeApiPath = '/youtube';