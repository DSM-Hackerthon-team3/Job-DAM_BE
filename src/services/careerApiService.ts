import axios from 'axios';
import { AptitudeTestRequest } from '../dtos/user/request/userRequest';

const CAREERNET_API_KEY = process.env.CAREERNET_API_KEY;
const CAREERNET_API_URL = 'https://www.career.go.kr/inspct/openapi/test/questions';

export const getAptitudeTestResult = async (request: AptitudeTestRequest): Promise<any> => {
  const response = await axios.post(CAREERNET_API_URL, {
    apikey: CAREERNET_API_KEY,
    qestrnSeq: '6',
    trgetSe: '100209',
    name: 'test',
    gender: '100323',
    grade: '',
    startDtm: Date.now(),
    answers: request.answers.join(' ')
  });

  return response.data;
};