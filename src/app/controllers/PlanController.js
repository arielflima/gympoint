import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error de validação STORE Plan' });
    }

    const { title } = req.body;

    const planExists = await Plan.findOne({
      where: { title },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: 'Plano com mesmo nome já cadastrado!' });
    }

    const plan = await Plan.create(req.body);

    return res.json({
      plan,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error de validação UPDATE Plan' });
    }

    const { title } = req.body;

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Esse id de Plano não existe! ' });
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }
}

export default new PlanController();
