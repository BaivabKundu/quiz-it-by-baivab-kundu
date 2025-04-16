import React from "react";

import { Button, Tag, Typography } from "@bigbinary/neetoui";
import { useTranslation, Trans } from "react-i18next";
import routes from "routes";
import { buildRoute } from "utils/url";

const Card = ({ quiz: { name, category, questionsCount, slug } }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between space-y-5 rounded-lg border border-gray-200 p-6 shadow-sm">
      <div>
        <Typography className="mb-2 text-xl font-bold">
          <Trans
            components={{ span: <span /> }}
            i18nKey="labels.publicQuizCard.quizName"
            values={{ name }}
          />
        </Typography>
        <Tag
          className="p-2 text-black"
          style="info"
          label={
            <Trans
              components={{ span: <span /> }}
              i18nKey="labels.publicQuizCard.quizCategory"
              values={{ category }}
            />
          }
        />
      </div>
      <div>
        <Typography className="mb-4 font-semibold text-black">
          <Trans
            components={{ span: <span /> }}
            i18nKey="labels.publicQuizCard.questionsCount"
            values={{ count: questionsCount }}
          />
        </Typography>
        <Button
          className="w-full justify-center rounded bg-blue-600 py-3 text-center text-white transition-colors hover:bg-blue-700"
          disabled={questionsCount === 0}
          label={t("labels.buttons.startQuiz")}
          to={buildRoute(routes.public.quizzes.register, slug)}
        />
      </div>
    </div>
  );
};
export default Card;
