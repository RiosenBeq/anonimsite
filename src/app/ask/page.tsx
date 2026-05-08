import { AskFlow } from "@/components/ask/AskFlow";
import { fetchQuestions, fetchTopics } from "@/lib/queries";

export const metadata = {
  title: "Ask anonymously · Anonim",
  description:
    "Ask freely. No one will know it was you. Anonim doesn't store your name, your face, or your account against this question.",
};

export default async function AskPage() {
  const [topics, similar] = await Promise.all([fetchTopics(), fetchQuestions({ limit: 3 })]);
  return <AskFlow topics={topics} similarQuestions={similar} />;
}
