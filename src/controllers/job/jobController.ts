// import { TalkRequest } from "../../dtos/job/request/jobRequest";
// import { openAIWithUserInput } from "../../services/job/gptService";
// import { Request, Response } from "express";

// export class JobController {
//   async talk(req: Request<{}, {}, TalkRequest>, res: Response) {
//     try {
//       const result = await openAIWithUserInput(req.body);
//       res.status(200).json(result);
//     } catch (error) {
//       res.status(500).json({ message: "요청 처리에 실패했습니다." });
//     }
//   }
// }
