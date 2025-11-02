export interface TalkRequest {
  job: string;
  history: {
    role: "user" | "assistant";
    content: string;
  }[];
  content: string; // 사용자의 현재 입력
}
