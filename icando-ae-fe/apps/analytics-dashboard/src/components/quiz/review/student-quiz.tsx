import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { QuestionList } from "./question-list";
import { useMemo } from "react";
import { QuestionWithAnswer } from "../../../interfaces/quiz";
import { QuizInfo } from "./quiz-info";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import CompetencyChart from "../competency-chart";
import { StatsCard } from "../../ui/stats-card.tsx";
import { CardTitle } from "@ui/components/ui/card.tsx";
import { getStudentQuizReview } from "../../../services/student-quiz.ts";

export const StudentQuiz = () => {
  const params = useParams<{ quizid: string; studentquizid: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["studentQuiz", params.studentquizid],
    queryFn: () => getStudentQuizReview(params.studentquizid!),
    enabled: !!params.quizid && !!params.studentquizid,
  });

  const questionWithAnswer = useMemo(() => {
    if (!data || isLoading) {
      return [];
    }

    const result: QuestionWithAnswer[] = data.quiz.quiz!.questions!.map(
      (question) => {
        if (data.quiz.studentAnswers === null) {
          return {
            ...question,
            studentAnswer: null,
          };
        }

        const answer = data.quiz.studentAnswers.find(
          (answer) => answer.questionId === question.id,
        );

        return {
          ...question,
          studentAnswer: answer || null,
        };
      },
    );

    return result;
  }, [data, isLoading]);

  const questionCorrectStats = useMemo(() => {
    if (!data || isLoading) {
      return null;
    }

    const totalUnanswered =
      data.quiz.quiz!.questions!.length - data.quiz.studentAnswers!.length;
    const totalIncorrect =
      data.quiz.quiz!.questions!.length -
      totalUnanswered -
      data.quiz.correctCount!;

    return {
      totalUnanswered,
      totalIncorrect,
      totalCorrect: data.quiz.correctCount!,
    };
  }, [data, isLoading]);

  return (
    <div className="flex flex-col gap-10">
      {data && !isLoading && (
        <StatsCard className="items-start">
          <QuizInfo data={data} />
        </StatsCard>
      )}
      <div className="flex gap-10 flex-wrap items-top">
        {data && !isLoading && (
          <StatsCard className="w-fit">
            <CardTitle>Competency Statistics</CardTitle>
            <CompetencyChart data={data.competency} />
          </StatsCard>
        )}
        {questionCorrectStats && (
          <StatsCard className="w-fit">
            <CardTitle>Question Statistics</CardTitle>
            <PieChart
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              series={[
                {
                  arcLabel: (item) =>
                    `${(100 * item.value) / (questionCorrectStats.totalCorrect + questionCorrectStats.totalIncorrect + questionCorrectStats.totalUnanswered)}%`,
                  arcLabelMinAngle: 45,
                  data: [
                    {
                      id: 0,
                      value: questionCorrectStats.totalCorrect,
                      label: "Correct",
                    },
                    {
                      id: 1,
                      value: questionCorrectStats.totalIncorrect,
                      label: "Incorrect",
                    },
                    {
                      id: 2,
                      value: questionCorrectStats.totalUnanswered,
                      label: "Unanswered",
                    },
                  ],
                },
              ]}
              width={500}
              height={300}
            />
          </StatsCard>
        )}
      </div>
      <StatsCard className="w-full">
        <CardTitle>Questions</CardTitle>
        <QuestionList questions={questionWithAnswer} />{" "}
      </StatsCard>
    </div>
  );
};
