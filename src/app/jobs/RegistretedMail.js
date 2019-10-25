import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class RegistretedMail {
  get key() {
    return 'RegistretedMail';
  }

  async handle({ data }) {
    const { student, plan, endDateRegistration, priceRegistration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula realizada',
      template: 'registreted',
      context: {
        student: student.name,
        plan: plan.title,
        endDateRegistration: format(
          parseISO(endDateRegistration),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        priceRegistration,
      },
    });
  }
}

export default new RegistretedMail();
