import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class RegistretedMail {
  get key() {
    return 'RegistretedMail';
  }

  async handle({ data }) {
    const { student, plan, endDateRegistration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula realizada',
      template: 'registreted',
      context: {
        student: student.name,
        plan: plan.title,
        endDate: format(
          parseISO(endDateRegistration),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistretedMail();
