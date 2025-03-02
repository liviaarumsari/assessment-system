import { useEffect } from "react";
import { useStudentQuiz } from "../context/user-context.tsx";
import { Layout } from "../layouts/layout.tsx";
import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@ui/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const Submit = () => {
  const { studentQuiz } = useStudentQuiz();
  const navigate = useNavigate();
  useEffect(() => {
    if (studentQuiz && studentQuiz.status !== 'SUBMITTED') {
      navigate('/quiz/1');
    }
  }, [studentQuiz, navigate]);
  return (
    <Layout pageTitle="Quiz" showTitle={false} showNavigation={false}>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="my-6 text-white rounded-full bg-green-500 p-2">
          <CheckIcon className="w-8 h-8" />
        </div>
        <h1 className="font-bold text-2xl">Jawaban telah terkirim!</h1>
        <h2 className="font-semibold">
          Terima kasih telah mengerjakan quiz ini
        </h2>
        <Link to="/review">
          <Button variant="link" className="underline">
            Review
          </Button>
        </Link>
      </div>
    </Layout>
  );
};
