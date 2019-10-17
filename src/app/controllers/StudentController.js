import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      weight: Yup.number().required(),
      size: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Error de validação STORE STUDENT' });
    }

    const { email } = req.body;

    const studentExists = await Student.findOne({
      where: { email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const student = await Student.create(req.body);

    return res.json({
      student,
    });
  }
}

export default new StudentController();
