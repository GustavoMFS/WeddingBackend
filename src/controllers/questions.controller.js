import { Question } from "../models/Questions.js";

export const getQuestionsByInvite = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const questions = await Question.find({ inviteId });
    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err);
    res.status(500).json({ message: "Erro ao buscar perguntas" });
  }
};

export const createQuestion = async (req, res) => {
  const { inviteId, question, required } = req.body;

  try {
    const newQuestion = new Question({
      inviteId,
      question,
      required: required ?? false,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Erro ao criar pergunta:", err);
    res.status(500).json({ message: "Erro ao criar pergunta" });
  }
};
