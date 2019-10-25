import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;
    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Id de aluno não existe!' });
    }

    const checkinDone = await Checkin.create({
      student_id: id,
    });

    return res.json(checkinDone);
  }
}

export default new CheckinController();
