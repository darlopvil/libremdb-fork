import type { NextApiRequest, NextApiResponse } from 'next';
import type Trivia from 'src/interfaces/shared/trivia';
import trivia from 'src/utils/fetchers/titleTrivia';
import getOrSetApiCache from 'src/utils/getOrSetApiCache';
import { titleTriviaKey } from 'src/utils/constants/keys';
import { AppError, getErrorProperties } from 'src/utils/helpers';

type ResponseData = { status: true; data: Trivia } | { status: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (req.method !== 'GET') throw new AppError('Invalid method', 400);

    const titleId = req.query.titleId as string;
    const data = await getOrSetApiCache(titleTriviaKey(titleId), trivia, titleId);
    res.status(200).json({ status: true, data });
  } catch (error) {
    const { message, statusCode } = getErrorProperties(error);
    res.status(statusCode).json({ status: false, message });
  }
}