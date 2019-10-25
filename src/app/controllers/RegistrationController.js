import * as Yup from 'yup';
import { addMonths, format, parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import RegistretedMail from '../jobs/RegistretedMail';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Error de validação STORE REGISTRATION' });
    }

    const { student_id, plan_id } = req.body;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    const studentRegistreted = await Registration.findOne({
      where: { student_id },
    });

    if (!student) {
      return res.status(404).json({ error: 'Id de usuário inexistente!' });
    }

    if (!plan) {
      return res.status(404).json({ error: 'Id de plano inexistente!' });
    }

    if (studentRegistreted) {
      return res.status(400).json({ error: 'Aluno já matriculado!' });
    }

    const { price, duration } = plan;

    const { start_date } = req.body;

    const parseDuration = parseFloat(duration);

    const priceRegistration = parseDuration * price;
    const formatStartDate = format(parseISO(start_date), 'yyyy-MM-dd');
    const parseFormatStartDate = parseISO(formatStartDate);

    const endDateRegistration = addMonths(parseFormatStartDate, duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date: endDateRegistration,
      price: priceRegistration,
    });

    await Queue.add(RegistretedMail.key, {
      student,
      plan,
      endDateRegistration,
      priceRegistration,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const registrations = await Registration.findAll();

    res.json(registrations);
  }

  async delete(req, res) {
    const { id } = req.params;

    const registrationToDelete = await Registration.findByPk(id);

    if (!registrationToDelete) {
      return res.json('Id da matricula não existe!');
    }

    await registrationToDelete.destroy();

    return res.json(`Matricula de id ${id} removida com sucesso!`);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Error de validação UPDATE REGISTRATION' });
    }

    const registrationToUpdate = await Registration.findByPk(req.params.id);

    if (!registrationToUpdate) {
      return res.status(404).json('Id da matricula não existe!');
    }

    const plan = await Plan.findOne({
      where: { id: req.body.plan_id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Id de plano inexistente!' });
    }

    const { price, duration } = plan;
    const { plan_id, start_date } = req.body;

    const parseDuration = parseFloat(duration);
    const priceRegistration = parseDuration * price;
    const formatStartDate = format(parseISO(start_date), 'yyyy-MM-dd');
    const parseFormatStartDate = parseISO(formatStartDate);
    const endDateRegistration = addMonths(parseFormatStartDate, duration);

    const registration = await registrationToUpdate.update({
      plan_id,
      start_date,
      end_date: endDateRegistration,
      price: priceRegistration,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
