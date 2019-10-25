import { startOfISOWeek, endOfISOWeek, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;
    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Id de aluno não existe!' });
    }

    const today = new Date();
    const checkinDate = `${today.getFullYear()}-${today.getMonth() +
      1}-${today.getDate()}`;

    const parseCheckinDate = parseISO(checkinDate);

    const startWeek = startOfISOWeek(parseCheckinDate);
    const endWeek = endOfISOWeek(parseCheckinDate);

    const where = {
      created_at: {
        $between: [startWeek, endWeek],
      },
    };

    const checkinsInAWeek = await Checkin.findAll(where);

    const [...arrayCheckinsInAWeek] = checkinsInAWeek;

    if (arrayCheckinsInAWeek.length > 4) {
      return res.json('Limite de checkins excedido!');
    }

    const checkinDone = await Checkin.create({
      student_id: id,
    });

    return res.json(checkinDone);
  }

  async index(req, res) {
    const { id } = req.params;
    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Id de aluno não existe!' });
    }

    const checkins = await Checkin.findAll();
    return res.json(checkins);
  }
}

export default new CheckinController();
