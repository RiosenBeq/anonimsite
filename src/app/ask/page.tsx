import { AskFlow } from "@/components/ask/AskFlow";

export const metadata = {
  title: "Ask anonymously · Anonim",
  description:
    "Ask freely. No one will know it was you. Anonim doesn't store your name, your face, or your account against this question.",
};

export default function AskPage() {
  return <AskFlow />;
}
