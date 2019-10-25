import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Id de aluno não existe!' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
      answer: null,
      answer_at: null,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { id } = req.params;

    if (!id) {
      const where = {
        where: {
          answer: null,
        },
      };

      const noResponses = await HelpOrder.findAll(where);

      return res.json(noResponses);
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Id de usuário não existe!' });
    }

    const where = {
      where: {
        student_id: id,
      },
    };

    const helpOrders = await HelpOrder.findAll(where);

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
