class AppointmentFactory {
  Build(simpleAppointment) {
    const day = simpleAppointment.date.getDate() + 1;
    const month = simpleAppointment.date.getMonth();
    const year = simpleAppointment.date.getFullYear();
    const [hour, minute] = simpleAppointment.time.split(":").map(Number);

    const startDate = new Date(year, month, day, hour, minute, 0, 0);

    return {
      id: simpleAppointment._id,
      title: `${simpleAppointment.name} - ${simpleAppointment.description}`,
      start: startDate,
      end: startDate,
      // Adicionando campos `date` e `time` originais para serem usados no envio de notificações
      date: simpleAppointment.date,
      time: simpleAppointment.time,
      name: simpleAppointment.name,
      email: simpleAppointment.email,
      notified: simpleAppointment.notified,
    };
  }
}

module.exports = new AppointmentFactory();
