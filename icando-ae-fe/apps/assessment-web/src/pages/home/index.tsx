import { Layout } from '../../layouts/layout.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.tsx";
import { Button } from "@ui/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { Badge } from "@ui/components/ui/badge.tsx";
import { useStudentProfile, useStudentQuiz } from "../../context/user-context.tsx";
import { startQuiz } from '../../services/quiz.ts';


export const Home = () => {
  const { quiz } = useStudentQuiz()
  const { student } = useStudentProfile()
  const currentDate = new Date();
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    try {
      const quizAttempt = await startQuiz();
      if (quizAttempt) {
        navigate(`/quiz/1`);
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
  }
  function formatHour(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
  return (
    <Layout pageTitle={'Home'} showTitle={false} showNavigation={false}>
      {quiz && student ? (
        <>
          <h1 className="text-lg mb-2">Selamat datang, {student.firstName}</h1>
          <Card className="space-x-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{quiz.name ? quiz.name : "Untitled Quiz"}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {quiz.subject && quiz.subject.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quiz.subject.map((subject) => (
                      <Badge key={subject}>{subject}</Badge>
                    ))}
                  </div>
                )}
              </CardDescription>
              <div className="grid grid-cols-2 gap-x-4 py-2">
                <div className="text-left font-medium text-gray-700">Durasi Pengerjaan:</div>
                <div className="text-left text-lg font-semibold text-black">{quiz.duration} menit</div>

                <div className="text-left font-medium text-gray-700">Batas Pengerjaan:</div>
                <div className="text-left text-lg font-semibold text-black"> {formatDate(new Date(quiz.endAt))} {formatHour(new Date(quiz.endAt))}</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="flex flex-row justify-between space-x-2"
                onClick={handleStartQuiz}
                disabled={new Date(quiz.startAt) > currentDate || new Date(quiz.endAt) < currentDate}>
                Mulai
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : null}
    </Layout>
  );
}
