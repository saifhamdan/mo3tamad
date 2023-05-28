import QuizController from 'components/quiz/QuizController';

const StartExamPage = () => {
  const data = {
    name: 'quiz data',
    questions: [
      {
        desc: '12312',
        options: [],
      },
      {
        desc: '3123',
      },
    ],
  };
  return (
    <div>
      <div></div>
      <QuizController quiz={data} />
    </div>
  );
};

export default StartExamPage;
