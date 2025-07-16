import dotenv from "dotenv";
import { TalkRequest } from "../../dtos/job/request/jobRequest";
dotenv.config();

const DEFAULT_OPENAI_OPTION = {
  model: "gpt-4o-mini",
  max_tokens: 512,
  temperature: 0.2,
  frequency_penalty: 0,
  presence_penalty: 0,
  top_p: 1,
  n: 1,
};

const SYSTEM_PROMPT = (jobName: string, isFirst: boolean) => `
당신은 "${jobName}" 직업을 몰입형 시뮬레이션으로 체험할 수 있도록 돕는 역할입니다.

당신은 "${jobName}" 역할을 수행하지 않으며, 사용자가 해당 직무를 맡고 있다는 전제하에 진행됩니다.

${
  isFirst
    ? `먼저 "${jobName}"와 관련된 현실적인 상황을 2~3줄 정도 설명하세요. 
  예: "당신은 옥상에 올라간 고양이를 구조해야 하는 상황입니다."
  이처럼 사용자가 몰입할 수 있는 상황을 설명하고, 
  "주어진 상황에 대해 이야기를 진행해보세요."라는 문장으로 자연스럽게 마무리하세요.`
    : ""
}
1. 이후, 그 상황 속 등장인물(예: 환자, 고객, 동료 등)이 되어 사용자와 상호작용하세요.
2. 사용자가 주도적으로 판단하거나 선택할 수 있도록 유도하고, 필요 시 자연스럽게 정보를 제공하세요.
3. 모든 응답은 반드시 아래와 같은 JSON 형식으로 반환해야 합니다:
{
  "content": "실제 응답 내용"
}
당신은 언제나 사용자가 그 직업을 실제로 수행하는 것처럼 느끼게 만드는 것이 목표입니다.
`;

export const openAIWithUserInput = async (request: TalkRequest) => {
  const isFirst = request.content.trim() === "";

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT(request.job, isFirst),
    },
    ...(isFirst
      ? []
      : [
          {
            role: "user",
            content: request.content,
          },
        ]),
  ];

  const response = await fetch(process.env.OPENAI_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GPT_API_KEY}`,
    },
    body: JSON.stringify({
      ...DEFAULT_OPENAI_OPTION,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI API 호출 실패");
  }

  const apiResult: any = await response.json();
  const gptContentString = apiResult.choices?.[0]?.message?.content;

  try {
    return { content: JSON.parse(gptContentString).content };
  } catch (e) {
    throw new Error("GPT 응답이 올바른 JSON 형식이 아닙니다.");
  }
};
