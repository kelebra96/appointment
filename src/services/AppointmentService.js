var Appointment = require("../models/Appointment");
var mongoose = require("mongoose");
var mailer = require("nodemailer");
var AppointmentFactory = require("../factories/AppointmentFactory");

class AppointmentService {
  async Create(name, email, phone, cpf, description, date, time) {
    const [hour, minute] = time.split(":").map(Number);
    const timeEnd = new Date(date);
    timeEnd.setHours(hour + 1);
    timeEnd.setMinutes(minute);
    const formattedTimeEnd = `${timeEnd
      .getHours()
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    var newAppo = new Appointment({
      name,
      email,
      phone,
      cpf,
      description,
      date,
      time,
      timeend: formattedTimeEnd,
      finished: false,
      notified: false,
    });

    try {
      await newAppo.save();
      return true;
    } catch (error) {
      console.log(`Error on create appointment: ${error}`);
      return false;
    }
  }

  async GetAll(showFinished) {
    if (showFinished) {
      return await Appointment.find();
    } else {
      var appo = await Appointment.find({ finished: false });
      console.log("Appointments found:", appo);
      var appointments = [];

      appo.forEach((appointment) => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentFactory.Build(appointment));
        }
      });
      return appointments;
    }
  }

  async SendNotification() {
    try {
      console.log("SendNotification function called at:", new Date());
      var appos = await this.GetAll(false);
      console.log("Appointments to check for notifications:", appos.length);

      for (let appointment of appos) {
        if (!appointment.date || !appointment.time) {
          console.error(
            `Appointment com informações faltando: ${JSON.stringify(
              appointment
            )}`
          );
          continue;
        }

        const [hour, minute] = appointment.time.split(":").map(Number);
        let appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(hour);
        appointmentDate.setMinutes(minute);
        appointmentDate.setSeconds(0);
        appointmentDate.setMilliseconds(0);

        var limit = new Date(appointmentDate.getTime() - 30 * 60000); // 30 minutos antes

        console.log(
          `Checking appointment for ${
            appointment.name
          } on ${appointmentDate.toString()}`
        );

        if (new Date() > limit && !appointment.notified) {
          console.log(`Sending notification to: ${appointment.email}`);

          // Configuração do transporte de e-mail
          var transporter = mailer.createTransport({
            host: "smtp.hostinger.com.br",
            port: 465,
            auth: {
              user: "baseteste@myinventory.com.br",
              pass: "Ro04041932..",
            },
          });

          try {
            await transporter.sendMail({
              from: "Fabrica Software <baseteste@myinventory.com.br>",
              to: appointment.email,
              subject: "Sua consulta está próxima!",
              text: `Olá ${
                appointment.name
              }, lembre-se que sua consulta será em ${appointmentDate.toLocaleDateString()} às ${
                appointment.time
              }.`,
            });
            console.log(
              "Email de notificação enviado para:",
              appointment.email
            );

            // Atualizar status para notificado
            appointment.notified = true;
            await Appointment.findByIdAndUpdate(appointment.id, {
              notified: true,
            });
          } catch (error) {
            console.log(
              `Error on send email to ${appointment.email}: ${error}`
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error in SendNotification: ${error}`);
    }
  }

  async Finish(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid ID provided for finishing appointment: ${id}`);
      return false;
    }

    try {
      await Appointment.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (error) {
      console.error(`Error on finish appointment: ${error}`);
      return false;
    }
  }
}

// Instanciar o serviço de agendamento
const appointmentService = new AppointmentService();

// Agendar a execução da função SendNotification a cada 1 minuto
setInterval(() => {
  appointmentService.SendNotification();
}, 1 * 60 * 1000); // 1 minuto em milissegundos

module.exports = appointmentService;
