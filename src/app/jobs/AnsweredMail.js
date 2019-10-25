import Mail from '../../lib/Mail';

class AnsweredMail {
  get key() {
    return 'AnsweredMail';
  }

  async handle({ data }) {
    const { student, question, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua duvida foi respondida!',
      template: 'answered',
      context: {
        student: student.name,
        question,
        answer,
      },
    });
  }
}

export default new AnsweredMail();
